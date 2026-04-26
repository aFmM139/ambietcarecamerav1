import { useRef } from "react";
import { View, PanResponder, Animated } from "react-native";
import { CAR_URL } from "@/lib/constants/config";

export function CarJoystick() {
  const pan = useRef(new Animated.ValueXY()).current;

  let lastCommand = "";

  const send = (cmd: string) => {
    if (cmd === lastCommand) return;
    lastCommand = cmd;

    fetch(`${CAR_URL}/${cmd}`).catch(() => {});
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,

    onPanResponderMove: (_, gesture) => {
      let x = gesture.dx;
      let y = gesture.dy;

      const limit = 50;
      x = Math.max(-limit, Math.min(limit, x));
      y = Math.max(-limit, Math.min(limit, y));

      pan.setValue({ x, y });

      if (y < -20) send("adelante");
      else if (y > 20) send("atras");
      else if (x > 20) send("derecha");
      else if (x < -20) send("izquierda");
      else send("parar");
    },

    onPanResponderRelease: () => {
      pan.setValue({ x: 0, y: 0 });
      send("parar");
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