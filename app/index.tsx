import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Webcam, TvMinimalPlay, Droplet, Thermometer, Wind } from 'lucide-react-native';
import "@/global.css"

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#121212] items-center justify-center gap-8 px-10">

      {/* Logo */}
      <View className="items-center gap-2.5">
        <Webcam size={70} color="#4CAF50" />
        <Text className="text-[#E0E0E0] text-[28px] font-extrabold tracking-[6px]">MOE</Text>
        <Text className="text-[#9E9E9E] text-[13px] text-center tracking-[0.5px]">
          Sistema Móvil de Operación y Exploración Ambiental
        </Text>
      </View>

      {/* Divider */}
      <View className="w-[60px] h-[2px] bg-[#4CAF50] rounded-sm" />

      {/* Info */}
      <View className="gap-3.5 items-start">
        <View className="flex-row items-center gap-3">
          <TvMinimalPlay color="#9E9E9E" size={20} />
          <Text className="text-[#9E9E9E] text-[14px] tracking-[0.5px]">Cámara en vivo</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Droplet color="#9E9E9E" size={20} />
          <Text className="text-[#9E9E9E] text-[14px] tracking-[0.5px]">Humedad en tiempo real</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Thermometer color="#9E9E9E" size={20} />
          <Text className="text-[#9E9E9E] text-[14px] tracking-[0.5px]">Temperatura en tiempo real</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Wind color="#9E9E9E" size={20} />
          <Text className="text-[#9E9E9E] text-[14px] tracking-[0.5px]">Calidad de aire en tiempo real</Text>
        </View>
      </View>

      {/* Botón */}
      <TouchableOpacity
        className="bg-[#4CAF5020] border border-[#4CAF50] px-9 py-3.5 rounded-xl"
        onPress={() => router.push("/(tabs)/Camera")}
        activeOpacity={0.8}
      >
        <Text className="text-[#81C784] text-[15px] font-bold tracking-[1px]">
          Ingresar al sistema
        </Text>
      </TouchableOpacity>

    </View>
  );
}