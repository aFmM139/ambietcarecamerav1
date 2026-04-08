import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { RefreshCcw, Video } from "lucide-react-native";
import "@/global.css"

const SCREEN_WIDTH = Dimensions.get("window").width;

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

  // Anchos calculados igual que antes
  const cellWidth   = (SCREEN_WIDTH - 160) / 5;
  const cellStyle   = { width: cellWidth } as const;
  const dateStyle   = { width: 160 }      as const;

  return (
    <View className="flex-1 bg-[#121212]">

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-[#2C2C2C] bg-[#1E1E1E]">
        <TouchableOpacity
          className="p-1.5 rounded-lg border border-[#2C2C2C]"
          onPress={() => router.back()}
        >
          <Video color="#81C784" size={20} />
        </TouchableOpacity>

        <Text className="text-[#E0E0E0] text-[16px] font-bold tracking-[1px]">
          Historial de mediciones
        </Text>

        <TouchableOpacity
          className="p-0.5 rounded-lg border border-[#2C2C2C]"
          onPress={onRefresh}
        >
          <RefreshCcw color="#81C784" size={18} />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <View className="flex-1 items-center justify-center p-10 gap-3.5">
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text className="text-[#9E9E9E] text-[14px]">Cargando datos…</Text>
        </View>
      )}

      {/* Error */}
      {error && !loading && (
        <View className="flex-1 items-center justify-center p-10 gap-3.5">
          <Text className="text-[#EF5350] text-[14px]">⚠️ Error al cargar los datos</Text>
          <TouchableOpacity
            className="px-6 py-2.5 rounded-lg border border-[#4CAF50] bg-[#4CAF5020]"
            onPress={fetchData}
          >
            <Text className="text-[#81C784] font-bold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tabla */}
      {!loading && !error && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
          }
        >
          <View style={{ width: SCREEN_WIDTH }}>

            {/* Encabezado */}
            <View className="flex-row bg-[#1A1A1A] border-b border-[#2C2C2C]">
              <Text
                className="py-2.5 px-1 text-[#9E9E9E] text-[11px] font-bold tracking-[0.5px] text-center"
                style={dateStyle}
              >
                Fecha
              </Text>
              {["S1 Hum.", "S1 Temp.", "S2 Hum.", "S2 Temp.", "Aire ppm"].map((h) => (
                <Text
                  key={h}
                  className="py-2.5 px-1 text-[#9E9E9E] text-[11px] font-bold tracking-[0.5px] text-center"
                  style={cellStyle}
                >
                  {h}
                </Text>
              ))}
            </View>

            {/* Sin registros */}
            {data.length === 0 && (
              <View className="items-center justify-center p-10">
                <Text className="text-[#9E9E9E] text-[14px]">Sin registros aún</Text>
              </View>
            )}

            {/* Filas */}
            {data.map((row, i) => (
              <View
                key={row.id}
                className={`flex-row border-b border-[#2C2C2C] ${i % 2 === 0 ? "bg-[#1E1E1E]" : "bg-transparent"}`}
              >
                <Text
                  className="py-2.5 px-1 text-[#81C784] text-[11px] font-semibold text-center"
                  style={dateStyle}
                >
                  {formatDate(row.created_at)}
                </Text>
                <Text className="py-2.5 px-1 text-[#81C784] text-[11px] font-semibold text-center" style={cellStyle}>{val(row.sensor1_humedad)}%</Text>
                <Text className="py-2.5 px-1 text-[#81C784] text-[11px] font-semibold text-center" style={cellStyle}>{val(row.sensor1_temperatura)}°C</Text>
                <Text className="py-2.5 px-1 text-[#81C784] text-[11px] font-semibold text-center" style={cellStyle}>{val(row.sensor2_humedad)}%</Text>
                <Text className="py-2.5 px-1 text-[#81C784] text-[11px] font-semibold text-center" style={cellStyle}>{val(row.sensor2_temperatura)}°C</Text>
                <Text className="py-2.5 px-1 text-[#81C784] text-[11px] font-semibold text-center" style={cellStyle}>{val(row.aire_ppm)} ppm</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <Text className="text-[#9E9E9E] text-[11px] text-center p-4 tracking-[1px]">
            Mostrando últimos {data.length} registros
          </Text>

          {/* Botón */}
          <TouchableOpacity
            className="mx-4 my-5 py-3.5 rounded-xl border border-[#4CAF50] bg-[#4CAF5020] items-center"
            onPress={() => router.push("/Charts")}
            activeOpacity={0.8}
          >
            <Text className="text-[#81C784] text-[15px] font-bold tracking-[1px]">
              Visualizar con tablas
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

    </View>
  );
}
