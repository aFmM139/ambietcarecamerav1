import { useRef, useEffect } from "react";
import { View, PanResponder, Animated } from "react-native";
import { CAR_URL } from "@/lib/constants/config";

export function CarJoystick() {
  const pan = useRef(new Animated.ValueXY()).current;

  const lastCommand = useRef("0,0");
  const currentCommand = useRef("0,0");

  const send = (l: number, r: number) => {
    const cmd = `${l},${r}`;
    currentCommand.current = cmd;

    if (cmd === lastCommand.current) return;
    lastCommand.current = cmd;

    fetch(`${CAR_URL}/move?l=${l}&r=${r}`).catch(() => {});
  };

  // 🔥 ENVÍO CONTINUO (clave)
  useEffect(() => {
    const interval = setInterval(() => {
      const [l, r] = currentCommand.current.split(",");
      fetch(`${CAR_URL}/move?l=${l}&r=${r}`).catch(() => {});
    }, 150); // cada 150ms

    return () => clearInterval(interval);
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: (_, gesture) => {
      let x = gesture.dx;
      let y = gesture.dy;

      const limit = 50;
      x = Math.max(-limit, Math.min(limit, x));
      y = Math.max(-limit, Math.min(limit, y));

      pan.setValue({ x, y });

      if (y < -20) send(1, 1);
      else if (y > 20) send(-1, -1);
      else if (x > 20) send(1, -1);
      else if (x < -20) send(-1, 1);
      else send(0, 0);
    },

    onPanResponderRelease: () => {
      pan.setValue({ x: 0, y: 0 });
      send(0, 0);
    },
  });

  return (
    <View className="items-center justify-center">
      <View className="w-40 h-40 bg-black/40 rounded-full items-center justify-center">
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            transform: pan.getTranslateTransform(),
          }}
          className="w-16 h-16 bg-white rounded-full"
        />
      </View>
    </View>
  );
}