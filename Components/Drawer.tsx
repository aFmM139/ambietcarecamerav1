import "@/global.css";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Trees } from "lucide-react-native";
import { DHTCard, AirCard, DHTData, AirData } from "@/Components/SensorCard";
import { ControlCard } from "@/Components/ControlCard";

const DRAWER_WIDTH = 240;

type DrawerProps = {
  sensor1: DHTData;
  sensor2: DHTData;
  aire: AirData;
  onOpenCameraControl: () => void;
  onOpenCarControl: () => void;
};

export function SensorDrawer({
  sensor1,
  sensor2,
  aire,
  onOpenCameraControl,
  onOpenCarControl,
}: DrawerProps) {
  const [open, setOpen] = useState(false);
  const widthAnim = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    const toOpen = !open;
    setOpen(toOpen);

    Animated.timing(widthAnim, {
      toValue: toOpen ? DRAWER_WIDTH : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View className="absolute right-0 top-0 bottom-0 flex-row items-center">

      {/* Drawer */}
      <Animated.View
        style={{ width: widthAnim }}
        className="overflow-hidden bg-[#1A1A1A] border border-[#2C2C2C] rounded-l-2xl"
      >
        <ScrollView className="p-2">

          <View className="bg-[#1E1E1E] p-2 gap-2 rounded-xl items-center">
            <Trees color="#228B22" size={16} />

            <Text className="text-[#81C784] text-[10px] tracking-[3px]">
              MOE
            </Text>

            {/* Sensores (clickeables) */}
            <TouchableOpacity
              onPress={() => router.push("/History")}
              activeOpacity={0.8}
              className="w-full gap-2"
            >
              <DHTCard titulo="Sensor 1" data={sensor1} />
              <DHTCard titulo="Sensor 2" data={sensor2} />
              <AirCard data={aire} />
            </TouchableOpacity>

            {/* Controles */}
            <View className="w-full gap-2 mt-2">
              <ControlCard
                titulo="Mover Cámara"
                onPress={onOpenCameraControl}
              />

              <ControlCard
                titulo="Mover Carro"
                onPress={onOpenCarControl}
              />
            </View>
          </View>

        </ScrollView>
      </Animated.View>

      {/* Handle */}
      <Pressable
        onPress={toggle}
        className="w-8 h-full bg-[#1F1F1F] border border-[#2C2C2C] rounded-l-2xl items-center justify-center"
      >
        <Animated.Text
          style={{
            transform: [
              {
                rotate: widthAnim.interpolate({
                  inputRange: [0, DRAWER_WIDTH],
                  outputRange: ["0deg", "180deg"],
                }),
              },
            ],
          }}
          className="text-[#555]"
        >
          ‹
        </Animated.Text>
      </Pressable>
    </View>
  );
}