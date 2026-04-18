import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRouter, useFocusEffect } from "expo-router";
import { SensorDrawer } from "@/Components/Drawer"; {/* 🔥 AQUÍ VA EL DRAWER */}

import { CAM_URL, CAM_IP } from "@/lib/constants/config";
import { INJECTED_JS } from "@/lib/constants/injectedJs";
import { useSensors } from "@/lib/hooks/useSensors";
import { useSupabaseSave } from "@/lib/hooks/useSupabaseSave";
import { CameraOverlay } from "@/Components/CameraOverlay";

import "@/global.css";

export default function CameraScreen() {
  const router = useRouter();
  const [showCameraControl, setShowCameraControl] = useState(false);
  const [showCarControl, setShowCarControl] = useState(false);

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

      </View>
       {/* Drawer */}
       <SensorDrawer
          sensor1={sensor1}
          sensor2={sensor2}
          aire={aire}
          onOpenCameraControl={() => {
            setShowCameraControl(prev => !prev);
          }}
          onOpenCarControl={() => {
             setShowCarControl(prev => !prev);
  }}
/>
       {/* 🔥 PANEL FLOTANTE */}
       {showCameraControl && (
        <View className="absolute bottom-4 left-4 w-40 h-40 bg-black/30 rounded-xl items-center justify-center">
          <Text className="text-white text-xs ">
            Control Cámara
          </Text>
        </View>
      )}

       {/* PANEL CARRO */}
       {showCarControl && (
        <View className="absolute bottom-4 right-4 w-40 h-40 bg-black/30 rounded-xl items-center justify-center">
          <Text className="text-white text-xs">
            Control Carro
          </Text>
        </View>
      )}
    </View>
  );
}