import { useState, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { SERVO_URL } from "@/lib/constants/config";

export function CameraControl() {
  const [angle, setAngle] = useState(90);

  const lastSendTime = useRef(0);
  const lastExtreme = useRef<"min" | "max" | "center" | null>(null);

  const sendAngle = useCallback(async (val: number) => {
    const now = Date.now();

    // 🔥 evita spam
    if (now - lastSendTime.current < 100) return;
    lastSendTime.current = now;

    setAngle(val);

    try {
      await fetch(`${SERVO_URL}?angulo=${val}`);
    } catch {}
  }, []);

  const handleSliderChange = (value: number) => {
    const val = Math.floor(value);

    // 🔥 EXTREMO IZQUIERDA
    if (val <= 10 && lastExtreme.current !== "min") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 80);

      lastExtreme.current = "min";
    }

    // 🔥 EXTREMO DERECHA
    else if (val >= 170 && lastExtreme.current !== "max") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }, 80);

      lastExtreme.current = "max";
    }

    // 🎯 CENTRO
    else if (val >= 88 && val <= 92 && lastExtreme.current !== "center") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastExtreme.current = "center";
    }

    // 🔄 RESET
    else if (val > 10 && val < 170 && (val < 88 || val > 92)) {
      lastExtreme.current = null;
    }

    setAngle(val);
    sendAngle(val);
  };

  return (
    <View className="w-64 bg-black/50 rounded-xl p-4 items-center">

      {/* ANGULO */}
      <Text className="text-white text-lg font-bold mb-2">
        {angle}°
      </Text>

      {/* SLIDER */}
      <Slider
        style={{ width: 220 }}
        minimumValue={10}
        maximumValue={170}
        value={angle}
        minimumTrackTintColor="#00FFFF"
        maximumTrackTintColor="#555"
        thumbTintColor="#00FFFF"
        onValueChange={handleSliderChange}
      />

      {/* BOTONES */}
      <View className="flex-row gap-3 mt-4">

        {/* IZQUIERDA */}
        <TouchableOpacity
          onPress={() => handleSliderChange(10)}
          className="w-12 h-12 rounded-xl bg-[#1f0a0f] border border-red-500 items-center justify-center"
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>

        {/* CENTRO */}
        <TouchableOpacity
          onPress={() => handleSliderChange(90)}
          className="w-12 h-12 rounded-xl bg-[#0f1f0f] border border-green-500 items-center justify-center"
        >
          <Text className="text-white text-lg">●</Text>
        </TouchableOpacity>

        {/* DERECHA */}
        <TouchableOpacity
          onPress={() => handleSliderChange(170)}
          className="w-12 h-12 rounded-xl bg-[#0a1a1f] border border-cyan-400 items-center justify-center"
        >
          <Text className="text-white text-lg">→</Text>
        </TouchableOpacity>

      </View>

      <Text className="text-gray-500 text-[10px] mt-3">
        Control manual + feedback pro
      </Text>

    </View>
  );
}