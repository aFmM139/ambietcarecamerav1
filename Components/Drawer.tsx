import "@/global.css";
import { useRef, useEffect } from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Trees } from "lucide-react-native";
import { DHTCard, AirCard, DHTData, AirData } from "@/Components/SensorCard";

const DRAWER_WIDTH = 240;

type DrawerProps = {
  sensor1: DHTData;
  sensor2: DHTData;
  aire: AirData;

  onOpenCameraControl: () => void;
  onOpenCarControl: () => void;

  ip: string;
  setIp: (v: string) => void;
  checkConnection: () => void;
  status: string;
  reachable: boolean;

  isOpen: boolean;
};

export function SensorDrawer({
  sensor1,
  sensor2,
  aire,
  onOpenCameraControl,
  onOpenCarControl,
  ip,
  setIp,
  checkConnection,
  status,
  reachable,
  isOpen,
}: DrawerProps) {

  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: isOpen ? DRAWER_WIDTH : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  return (
    <View className="absolute right-0 top-0 bottom-0 flex-row items-center">

      <Animated.View
        style={{ width: widthAnim }}
        className="overflow-hidden bg-[#1A1A1A] border border-[#2C2C2C] rounded-l-2xl"
      >
        <ScrollView className="p-2">

          <View className="bg-[#1E1E1E] p-2 gap-2 rounded-xl items-center">

            {/* HEADER */}
            <Trees color="#228B22" size={16} />
            <Text className="text-[#81C784] text-[10px] tracking-[3px]">
              MOE
            </Text>

            {/* ───── SENSORES ───── */}
            <TouchableOpacity
              onPress={() => router.push("/History")}
              activeOpacity={0.8}
              className="w-full gap-2"
            >
              <DHTCard titulo="Sensor 1" data={sensor1} />
              <DHTCard titulo="Sensor 2" data={sensor2} />
              <AirCard data={aire} />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </Animated.View>

    </View>
  );
}