import { TouchableOpacity, Text } from "react-native";

export function ControlCard({
  titulo,
  onPress,
}: {
  titulo: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl p-3 items-center"
    >
      <Text className="text-[#81C784] text-sm font-bold">
        {titulo}
      </Text>
    </TouchableOpacity>
  );
}