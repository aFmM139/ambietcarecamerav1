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
import { MoveLeft } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
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

const baseConfig = {
  backgroundGradientFrom: "#1A1A1A",
  backgroundGradientTo: "#1A1A1A",
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(158, 158, 158, ${opacity})`,
  propsForDots: { r: "3", strokeWidth: "1", stroke: "#81C784" },
  propsForBackgroundLines: { stroke: "#2C2C2C" },
};

const chartConfig = (color: string) => ({
  ...baseConfig,
  color: (opacity = 1) => `${color.replace(")", `, ${opacity})`).replace("rgb", "rgba")}`,
});

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
      <View className="flex-1 bg-[#121212] items-center justify-center gap-3.5">
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text className="text-[#9E9E9E] text-[14px]">Cargando gráficas…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#121212] items-center justify-center gap-3.5">
        <Text className="text-[#EF5350] text-[14px]">⚠️ Error al cargar los datos</Text>
        <TouchableOpacity
          className="px-6 py-2.5 rounded-lg border border-[#4CAF50] bg-[#4CAF5020]"
          onPress={fetchData}
        >
          <Text className="text-[#81C784] font-bold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const labels = getLabels();

  const charts = [
    {
      title: "🌡️ Temperatura — Sensor 1",
      values: data.map((d) => d.sensor1_temperatura),
      color: "rgb(76, 175, 80)",
      suffix: "°C",
    },
    {
      title: "💧 Humedad — Sensor 1",
      values: data.map((d) => d.sensor1_humedad),
      color: "rgb(129, 199, 132)",
      suffix: "%",
    },
    {
      title: "🌡️ Temperatura — Sensor 2",
      values: data.map((d) => d.sensor2_temperatura),
      color: "rgb(255, 167, 38)",
      suffix: "°C",
    },
    {
      title: "💧 Humedad — Sensor 2",
      values: data.map((d) => d.sensor2_humedad),
      color: "rgb(100, 181, 246)",
      suffix: "%",
    },
    {
      title: "💨 Calidad de aire — MQ-135",
      values: data.map((d) => d.aire_ppm),
      color: "rgb(239, 83, 80)",
      suffix: " ppm",
    },
  ];

  return (
    <View className="flex-1 bg-[#121212]">

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-[#2C2C2C] bg-[#1E1E1E]">
        <TouchableOpacity
          className="p-1.5 rounded-lg border border-[#2C2C2C]"
          onPress={() => router.back()}
        >
          <MoveLeft color="#81C784" size={20} />
        </TouchableOpacity>

        <Text className="text-[#E0E0E0] text-[16px] font-bold tracking-[1px]">
          Gráficas de sensores
        </Text>

        <TouchableOpacity
          className="p-1.5 rounded-lg border border-[#2C2C2C] w-[34px] items-center"
          onPress={onRefresh}
        >
          <Text className="text-[#81C784] text-[18px]">↺</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />
        }
      >
        {charts.map(({ title, values, color, suffix }) => (
          <View
            key={title}
            className="bg-[#1A1A1A] rounded-xl border border-[#2C2C2C] mb-4"
          >
            <Text className="text-[#E0E0E0] text-[13px] font-bold tracking-[0.5px] mb-2.5 px-3 pt-3">
              {title}
            </Text>
            <LineChart
              data={{ labels, datasets: [{ data: cleanData(values) }] }}
              width={SCREEN_WIDTH}
              height={200}
              chartConfig={chartConfig(color)}
              bezier
              style={{ borderRadius: 8 }}
              yAxisSuffix={suffix}
            />
          </View>
        ))}

        <Text className="text-[#9E9E9E] text-[11px] text-center py-2 tracking-[1px]">
          Últimos {data.length} registros
        </Text>
      </ScrollView>

    </View>
  );
}