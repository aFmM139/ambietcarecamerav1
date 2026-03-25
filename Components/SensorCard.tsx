import "@/global.css";
import { Droplet, Thermometer, Wind } from 'lucide-react-native';
import { Text, View } from "react-native";

export type DHTData = {
  humedad: number | null;
  temperatura: number | null;
  error: boolean;
};

export type AirData = {
  ppm: number | null;
  error: boolean;
};

export function DHTCard({ titulo, data }: { titulo: string; data: DHTData }) {
  return (
    <View className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl p-2 items-center gap-1">
      
      <Text className="text-[#9E9E9E] text-[10px] font-bold tracking-[2px] uppercase self-start">
        {titulo}
      </Text>

      <View className="flex-row items-center justify-around w-full">
        
        {/* Humedad */}
        <View className="items-center gap-[2px]">
          <Droplet color={"#E0E0E0"} size={16} />
          <Text className="text-[#9E9E9E] text-[10px] font-semibold">
            Humedad
          </Text>
          <Text className="text-[#81C784] text-base font-extrabold">
            {data.error ? "—" : data.humedad !== null ? `${data.humedad}%` : "…"}
          </Text>
        </View>

        {/* Divider */}
        <View className="w-[1px] h-[30px] bg-[#2C2C2C]" />

        {/* Temperatura */}
        <View className="items-center gap-[2px]">
          <Thermometer color={"#E0E0E0"} size={16} />
          <Text className="text-[#9E9E9E] text-[10px] font-semibold">
            Temp.
          </Text>
          <Text className="text-[#81C784] text-base font-extrabold">
            {data.error ? "—" : data.temperatura !== null ? `${data.temperatura}°C` : "…"}
          </Text>
        </View>
      </View>

      {data.error && (
        <Text className="text-[#EF5350] text-[10px] tracking-[1px] text-center">
          Sin señal
        </Text>
      )}
    </View>
  );
}

export function AirCard({ data }: { data: AirData }) {
  return (
    <View className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl p-2 items-center gap-1">
      
      <Text className="text-[#9E9E9E] text-[10px] font-bold tracking-[2px] uppercase self-start">
        CALIDAD DE AIRE
      </Text>

      <View className="flex-row items-center justify-center w-full">
        <View className="items-center gap-[2px]">
          <Wind color={"#E0E0E0"} size={16} />
          <Text className="text-[#9E9E9E] text-[10px] font-semibold">
            MQ-135
          </Text>
          <Text className="text-[#81C784] text-base font-extrabold">
            {data.error ? "—" : data.ppm !== null ? `${data.ppm} ppm` : "…"}
          </Text>
        </View>
      </View>

      {data.error && (
        <Text className="text-[#EF5350] text-[10px] tracking-[1px] text-center">
          Sin señal
        </Text>
      )}
    </View>
  );
}