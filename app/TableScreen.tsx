import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { Video } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";

const SCREEN_WIDTH = Dimensions.get("window").width - 32;

type Medicion = {
  id: number;
  created_at: string;
  sensor1_humedad: number | null;
  sensor1_temperatura: number | null;
  sensor2_humedad: number | null;
  sensor2_temperatura: number | null;
  aire_ppm: number | null;
};

const chartConfig = {
  backgroundGradientFrom: "#1A1A1A",
  backgroundGradientTo: "#1A1A1A",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(158, 158, 158, ${opacity})`,
  propsForDots: { r: "3", strokeWidth: "1", stroke: "#81C784" },
  propsForBackgroundLines: { stroke: "#2C2C2C" },
};

export default function TableScreen() {
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
        .limit(20);

      if (err) throw err;
      setData((rows ?? []).reverse());
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

  const getLabels = () =>
    data.map((_, i) => (i % 4 === 0 ? String(i + 1) : ""));

  const cleanData = (arr: (number | null)[]) =>
    arr.map((v) => (v !== null && !isNaN(v) ? v : 0));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Cargando gráficas…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ Error al cargar los datos</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const labels = getLabels();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push("/CameraScreen")}>
          <Video color={"#81C784"} size={20} />
        </TouchableOpacity>
        <Text style={styles.title}>Gráficas de sensores</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh}>
          <Text style={styles.refreshText}>↺</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>🌡️ Temperatura — Sensor 1</Text>
          <LineChart
            data={{ labels, datasets: [{ data: cleanData(data.map((d) => d.sensor1_temperatura)) }] }}
            width={SCREEN_WIDTH} height={200} chartConfig={chartConfig} bezier style={styles.chart} yAxisSuffix="°C"
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>💧 Humedad — Sensor 1</Text>
          <LineChart
            data={{ labels, datasets: [{ data: cleanData(data.map((d) => d.sensor1_humedad)) }] }}
            width={SCREEN_WIDTH} height={200}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(129, 199, 132, ${opacity})` }}
            bezier style={styles.chart} yAxisSuffix="%"
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>🌡️ Temperatura — Sensor 2</Text>
          <LineChart
            data={{ labels, datasets: [{ data: cleanData(data.map((d) => d.sensor2_temperatura)) }] }}
            width={SCREEN_WIDTH} height={200}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(255, 167, 38, ${opacity})` }}
            bezier style={styles.chart} yAxisSuffix="°C"
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>💧 Humedad — Sensor 2</Text>
          <LineChart
            data={{ labels, datasets: [{ data: cleanData(data.map((d) => d.sensor2_humedad)) }] }}
            width={SCREEN_WIDTH} height={200}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(100, 181, 246, ${opacity})` }}
            bezier style={styles.chart} yAxisSuffix="%"
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>💨 Calidad de aire — MQ-135</Text>
          <LineChart
            data={{ labels, datasets: [{ data: cleanData(data.map((d) => d.aire_ppm)) }] }}
            width={SCREEN_WIDTH} height={200}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(239, 83, 80, ${opacity})` }}
            bezier style={styles.chart} yAxisSuffix=" ppm"
          />
        </View>
        <TouchableOpacity
              style={styles.serverBtn}
              onPress={() => router.push("/ServerScreen")}
              activeOpacity={0.8}
        >
                <Text style={styles.serverBtnText}>Ver registros</Text>
        </TouchableOpacity>
        <Text style={styles.footer}>Últimos {data.length} registros</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#121212" },
  center: { flex: 1, backgroundColor: "#121212", alignItems: "center", justifyContent: "center", gap: 14 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "#2C2C2C", backgroundColor: "#1E1E1E",
  },
  backBtn: { padding: 6, borderRadius: 8, borderWidth: 1, borderColor: "#2C2C2C" },
  refreshBtn: { padding: 6, borderRadius: 8, borderWidth: 1, borderColor: "#2C2C2C", width: 34, alignItems: "center" },
  refreshText: { color: "#81C784", fontSize: 18 },
  title: { color: "#E0E0E0", fontSize: 16, fontWeight: "700", letterSpacing: 1 },
  scroll: { padding: 16 },
  chartCard: { backgroundColor: "#1A1A1A", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#2C2C2C", marginBottom: 16 },
  chartTitle: { color: "#E0E0E0", fontSize: 13, fontWeight: "700", marginBottom: 10, letterSpacing: 0.5 },
  chart: { borderRadius: 8 },
  loadingText: { color: "#9E9E9E", fontSize: 14 },
  errorText: { color: "#EF5350", fontSize: 14 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: "#4CAF50", backgroundColor: "#4CAF5020" },
  retryText: { color: "#81C784", fontWeight: "700" },
  footer: { color: "#9E9E9E", fontSize: 11, textAlign: "center", paddingVertical: 8, letterSpacing: 1 },
  serverBtn: {
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    backgroundColor: "#4CAF5020",
    alignItems: "center",
  },
  serverBtnText: {
    color: "#81C784",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
});