import { View, Text } from "react-native";
import { sensorStyles } from "@/lib/constants/styles";

export type SensorData = {
  humedad: number | null;
  temperatura: number | null;
  error: boolean;
};

type Props = {
  titulo: string;
  data: SensorData;
};

export default function SensorCard({ titulo, data }: Props) {
  return (
    <View style={sensorStyles.sensorCard}>
      <Text style={sensorStyles.sensorTitle}>{titulo}</Text>
      <View style={sensorStyles.sensorRow}>
        <View style={sensorStyles.sensorItem}>
          <Text style={sensorStyles.sensorLabel}>💧 Humedad</Text>
          <Text style={sensorStyles.sensorValue}>
            {data.error ? "—" : data.humedad !== null ? `${data.humedad}%` : "…"}
          </Text>
        </View>
        <View style={sensorStyles.divider} />
        <View style={sensorStyles.sensorItem}>
          <Text style={sensorStyles.sensorLabel}>🌡️ Temp.</Text>
          <Text style={sensorStyles.sensorValue}>
            {data.error ? "—" : data.temperatura !== null ? `${data.temperatura}°C` : "…"}
          </Text>
        </View>
      </View>
      {data.error && <Text style={sensorStyles.sensorErrorText}>Sin señal</Text>}
    </View>
  );
}