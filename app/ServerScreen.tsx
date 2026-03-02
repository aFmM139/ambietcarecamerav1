import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, RefreshCcw } from "lucide-react-native";

type Medicion = {
  id: number;
  created_at: string;
  sensor1_humedad: number | null;
  sensor1_temperatura: number | null;
  sensor2_humedad: number | null;
  sensor2_temperatura: number | null;
  aire_ppm: number | null;
};

export default function ServerScreen() {
  const router = useRouter();
  const [data, setData]             = useState<Medicion[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const { data: rows, error: err } = await supabase
        .from("mediciones")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (err) throw err;
      setData(rows ?? []);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const val = (v: number | null) => (v !== null ? String(v) : "—");

  return (
    <View style={styles.root}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft color={"#81C784"} size={20} />
        </TouchableOpacity>
        <Text style={styles.title}>Historial de mediciones</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <RefreshCcw color={"#81C784"} size={18} />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando datos…</Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠️ Error al cargar los datos</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
            <Text style={styles.retryText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <View style={styles.tableHeader}>
                <Text style={[styles.cell, styles.cellDate]}>Fecha</Text>
                <Text style={styles.cell}>S1 Hum.</Text>
                <Text style={styles.cell}>S1 Temp.</Text>
                <Text style={styles.cell}>S2 Hum.</Text>
                <Text style={styles.cell}>S2 Temp.</Text>
                <Text style={styles.cell}>Aire ppm</Text>
              </View>

              {data.length === 0 && (
                <View style={styles.center}>
                  <Text style={styles.loadingText}>Sin registros aún</Text>
                </View>
              )}

              {data.map((row, i) => (
                <View key={row.id} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.cell, styles.cellDate, styles.cellValue]}>
                    {formatDate(row.created_at)}
                  </Text>
                  <Text style={[styles.cell, styles.cellValue]}>{val(row.sensor1_humedad)}%</Text>
                  <Text style={[styles.cell, styles.cellValue]}>{val(row.sensor1_temperatura)}°C</Text>
                  <Text style={[styles.cell, styles.cellValue]}>{val(row.sensor2_humedad)}%</Text>
                  <Text style={[styles.cell, styles.cellValue]}>{val(row.sensor2_temperatura)}°C</Text>
                  <Text style={[styles.cell, styles.cellValue]}>{val(row.aire_ppm)} ppm</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.footer}>Mostrando últimos {data.length} registros</Text>

          <TouchableOpacity
            style={styles.tableBtn}
            onPress={() => router.push("/TableScreen")}
            activeOpacity={0.8}
          >
              <Text style={styles.tableBtnText}>Visualizar con tablas</Text>
          </TouchableOpacity> 
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C",
    backgroundColor: "#1E1E1E",
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  refreshBtn: {
    padding: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2C2C2C",
  },
  title: {
    color: "#E0E0E0",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    gap: 14,
  },
  loadingText: { color: "#9E9E9E", fontSize: 14 },
  errorText: { color: "#EF5350", fontSize: 14 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF5020",
  },
  retryText: { color: "#81C784", fontWeight: "700" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C",
  },
  tableRowAlt: { backgroundColor: "#1E1E1E" },
  cell: {
    width: 90,
    paddingVertical: 10,
    paddingHorizontal: 8,
    color: "#9E9E9E",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  cellDate: { width: 140 },
  cellValue: { color: "#81C784", fontWeight: "600" },
  footer: {
    color: "#9E9E9E",
    fontSize: 11,
    textAlign: "center",
    padding: 16,
    letterSpacing: 1,
  },
  tableBtn: {
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF5020",
    alignItems: "center",
  },
  tableBtnText: {
    color: "#81C784",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
});