import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { TriangleAlert, RefreshCcw, House } from "lucide-react-native";
import { useRouter } from "expo-router";

type CameraOverlayProps = {
    loading: boolean;
    error: boolean;
    reload: () => void;
    lastSaved: string | null;
    camIP: string;
  };

export function CameraOverlay({
    loading,
    error,
    reload,
    lastSaved,
    camIP,
  }: CameraOverlayProps) {
  const router = useRouter();

  return (
    <>
      {loading && !error && (
        <View className="absolute inset-0 bg-black/70 items-center justify-center">
          <ActivityIndicator size="large" color="#228B22" />
          <Text className="text-white mt-2 text-base">Conectando…</Text>
        </View>
      )}

      {error && (
        <View className="absolute inset-0 bg-black/70 items-center justify-center">
          <TriangleAlert color="#FFFFFF" size={60} />
          <Text className="text-white mt-2 text-base">
            Sin conexión con la cámara
          </Text>
          <TouchableOpacity
            className="mt-4 bg-[#228B22] px-5 py-2 rounded-lg"
            onPress={reload}
          >
            <Text className="text-white font-semibold">Reintentar</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <>
          <View className="absolute top-2 left-2 flex-row items-center bg-black/50 px-3 py-1 rounded-full gap-x-2">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <Text className="text-white text-xs font-medium">
              EN VIVO {camIP}
            </Text>

            <TouchableOpacity onPress={() => router.replace("/")}>
              <House color="#E0E0E0" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full"
            onPress={reload}
          >
            <RefreshCcw color="#FFFFFF" size={20} />
          </TouchableOpacity>
        </>
      )}

      {lastSaved && (
        <View className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full">
          <Text className="text-white text-xs">💾 {lastSaved}</Text>
        </View>
      )}
    </>
  );
}