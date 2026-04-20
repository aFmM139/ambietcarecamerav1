import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import "@/global.css";

export function CameraControl({ ip }: { ip: string }) {
  const [angle, setAngle] = useState(90);

  const sendingRef = useRef(false);
  const lastSendTime = useRef(0);
  const intervalRef = useRef<any>(null);
  const currentAngle = useRef(90);

  const sendAngle = useCallback(async (val: number) => {
    const now = Date.now();
    if (sendingRef.current || now - lastSendTime.current < 20) return;

    sendingRef.current = true;
    lastSendTime.current = now;

    try {
      await fetch(`http://${ip}/angulo?valor=${val}`);
    } catch {}

    sendingRef.current = false;
  }, [ip]);

  const move = useCallback((direction: number) => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      currentAngle.current += direction;

      if (currentAngle.current > 170) currentAngle.current = 170;
      if (currentAngle.current < 10) currentAngle.current = 10;

      const val = Math.floor(currentAngle.current);
      setAngle(val);
      sendAngle(val);
    }, 25);
  }, [sendAngle]);

  const stopMoving = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const centerServo = useCallback(() => {
    currentAngle.current = 90;
    setAngle(90);
    sendAngle(90);
  }, [sendAngle]);

  return (
    <View className="w-44 bg-black/50 rounded-xl p-3 items-center">

      <Text className="text-white text-lg font-bold mb-2">
        {angle}°
      </Text>

      <TouchableOpacity
        className="w-full h-8 rounded-lg items-center justify-center border border-gray-500 mb-3"
        onPress={centerServo}
      >
        <Text className="text-gray-300 text-xs">CENTRO</Text>
      </TouchableOpacity>

      <View className="flex-row items-center gap-3">

        <Pressable
          className="w-16 h-16 rounded-xl items-center justify-center border border-red-500 bg-[#1f0a0f]"
          onPressIn={() => move(-2)}
          onPressOut={stopMoving}
        >
          <Text className="text-white text-xl">←</Text>
        </Pressable>

        <Pressable
          className="w-16 h-16 rounded-xl items-center justify-center border border-cyan-400 bg-[#0a1a1f]"
          onPressIn={() => move(2)}
          onPressOut={stopMoving}
        >
          <Text className="text-white text-xl">→</Text>
        </Pressable>

      </View>

      <Text className="text-gray-500 text-[10px] mt-2">
        Mantén presionado
      </Text>

    </View>
  );
}