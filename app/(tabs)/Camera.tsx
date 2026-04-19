import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { useRouter, useFocusEffect } from "expo-router";

import { SensorDrawer } from "@/Components/Drawer";
import { CameraControl } from "@/Components/CameraControl";

import { CAM_URL, CAM_IP } from "@/lib/constants/config";
import { INJECTED_JS } from "@/lib/constants/injectedJs";
import { useSensors } from "@/lib/hooks/useSensors";
import { useSupabaseSave } from "@/lib/hooks/useSupabaseSave";
import { CameraOverlay } from "@/Components/CameraOverlay";

import "@/global.css";

export default function CameraScreen() {
  const router = useRouter();

  // ───── UI ─────
  const [showCameraControl, setShowCameraControl] = useState(false);
  const [showCarControl, setShowCarControl] = useState(false);

  // ───── IP + CONEXIÓN ─────
  const [ip, setIp] = useState(CAM_IP || "192.168.1.66");
  const [status, setStatus] = useState("Sin verificar");
  const [reachable, setReachable] = useState(false);

  const checkConnection = useCallback(async () => {
    setStatus("Verificando...");
    try {
      const res = await fetch(`http://${ip}/angulo?valor=90`);

      if (res.ok) {
        setReachable(true);
        setStatus("✓ Conectado");
      } else {
        setReachable(false);
        setStatus(`Error ${res.status}`);
      }

    } catch {
      setReachable(false);
      setStatus("Sin conexión");
    }
  }, [ip]);

  // ───── CÁMARA ─────
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

        {/* ───── CÁMARA ───── */}
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
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />

          {/* Overlay */}
          <CameraOverlay
            loading={loading}
            error={error}
            reload={reload}
            lastSaved={lastSaved}
            camIP={CAM_IP}
          />
        </View>

      </View>

      {/* ───── DRAWER ───── */}
      <SensorDrawer
        sensor1={sensor1}
        sensor2={sensor2}
        aire={aire}

        onOpenCameraControl={() =>
          setShowCameraControl(prev => !prev)
        }

        onOpenCarControl={() =>
          setShowCarControl(prev => !prev)
        }

        ip={ip}
        setIp={setIp}
        checkConnection={checkConnection}
        status={status}
        reachable={reachable}
      />

      {/* ───── PANEL CONTROL CÁMARA ───── */}
      {showCameraControl && (
        <View className="absolute bottom-4 left-4">
          <CameraControl ip={ip} />
        </View>
      )}

      {/* ───── PANEL CONTROL CARRO ───── */}
      {showCarControl && (
        <View className="absolute bottom-4 right-4 w-44 h-40 bg-black/40 rounded-xl items-center justify-center">
          <Text className="text-white text-xs">
            Control Carro (pendiente)
          </Text>
        </View>
      )}

    </View>
  );
}