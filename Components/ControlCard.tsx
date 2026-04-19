import { useRef, useState } from "react";
import { TouchableOpacity, Text, View, Animated } from "react-native";

export function ControlCard({
  titulo,
  children,
  onPress,
}: {
  titulo: string;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toOpen = !open;
    setOpen(toOpen);

    Animated.timing(anim, {
      toValue: toOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();

    onPress?.(); // 🔥 ejecuta lógica externa (panel flotante)
  };

  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 140], // ajusta si quieres más espacio
  });

  return (
    <View className="w-full bg-[#1A1A1A] border border-[#2C2C2C] rounded-xl overflow-hidden">

      <TouchableOpacity
        onPress={toggle}
        className="p-3 items-center"
        activeOpacity={0.8}
      >
        <Text className="text-[#81C784] text-sm font-bold">
          {titulo}
        </Text>
      </TouchableOpacity>

      <Animated.View style={{ height, overflow: "hidden" }}>
        <View className="px-3 pb-2">
          {children}
        </View>
      </Animated.View>

    </View>
  );
}