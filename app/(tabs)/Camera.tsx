import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { DHTCard, AirCard } from "@/Components/SensorCard";
import { Trees } from "lucide-react-native";
import { useRouter, useFocusEffect } from "expo-router";

import { CAM_URL, CAM_IP } from "@/lib/constants/config";
import { INJECTED_JS } from "@/lib/constants/injectedJs";
import { useSensors } from "@/lib/hooks/useSensors";
import { useSupabaseSave } from "@/lib/hooks/useSupabaseSave";
import { CameraOverlay } from "@/Components/CameraOverlay";

import "@/global.css";

export default function CameraScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [key, setKey] = useState(Date.now());

  const { sensor1, sensor2, aire } = useSensors();
  const { lastSaved } = useSupabaseSave(sensor1, sensor2, aire);

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.DEFAULT
      );
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setKey(Date.now());
      setLoading(true);
      setError(false);
    }, [])
  );

  const reload = () => {
    setLoading(true);
    setError(false);
    setKey((k) => k + 1);
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar hidden />

      <View className="flex-1 flex-row">

        {/* ── Cámara ── */}
        <View className="flex-1 relative">
          <WebView
            key={key}
            className="flex-1"
            source={{ uri: CAM_URL }}
            injectedJavaScript={INJECTED_JS}
            onMessage={(e) => {
              if (e.nativeEvent.data === "loaded") setLoading(false);
            }}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            onHttpError={() => {
              setLoading(false);
              setError(true);
            }}
            originWhitelist={["*"]}
            mixedContentMode="always"
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />

          {/* 🔥 Overlay limpio */}
          <CameraOverlay
            loading={loading}
            error={error}
            reload={reload}
            lastSaved={lastSaved}
            camIP={CAM_IP}
          />
        </View>

        {/* ── Panel sensores ── */}
        <TouchableOpacity
          className="flex-[0.35] bg-[#1E1E1E] items-center justify-center p-1 gap-0.5 border-l border-[#2C2C2C]"
          onPress={() => router.push("/History")}
          activeOpacity={0.8}
        >
          <Trees color={"#228B22"} size={16} />

          <Text className="text-[#81C784] text-[10px] font-extrabold tracking-[3px] mb-0.5">
            MOE
          </Text>

          <DHTCard titulo="Sensor 1" data={sensor1} />
          <DHTCard titulo="Sensor 2" data={sensor2} />
          <AirCard data={aire} />
        </TouchableOpacity>
      </View>
    </View>
  );
}