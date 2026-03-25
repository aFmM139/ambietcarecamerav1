import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import { DHTCard, DHTData, AirCard, AirData } from "@/Components/SensorCard";
import { RefreshCcw, Trees, TriangleAlert, House } from "lucide-react-native";
import { supabase } from "@/lib/supabase";
import { useRouter, useFocusEffect } from "expo-router";
import "@/global.css"

const CAM_IP  = "192.168.1.33";
const CAM_URL = `http://${CAM_IP}`;

const SENSOR_IP    = "192.168.1.34";
const SENSOR_1_URL = `http://${SENSOR_IP}/sensor1`;
const SENSOR_2_URL = `http://${SENSOR_IP}/sensor2`;
const AIRE_URL     = `http://${SENSOR_IP}/aire`;

const SAVE_INTERVAL = 60000;

const INJECTED_JS = `
  (function() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.style.display = 'none';
    var logo = document.getElementById('logo');
    if (logo) logo.style.display = 'none';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = '#000';
    document.body.style.overflow = 'hidden';
    var main = document.querySelector('section.main');
    if (main) { main.style.margin = '0'; main.style.padding = '0'; }
    var content = document.getElementById('content');
    if (content) { content.style.display = 'flex'; content.style.width = '100vw'; content.style.height = '100vh'; content.style.margin = '0'; content.style.padding = '0'; }
    var figure = document.querySelector('figure');
    if (figure) { figure.style.width = '100vw'; figure.style.height = '100vh'; figure.style.margin = '0'; figure.style.padding = '0'; figure.style.overflow = 'hidden'; }
    var closeBtn = document.getElementById('close-stream');
    if (closeBtn) closeBtn.style.display = 'none';
    var saveBtn = document.getElementById('save-still');
    if (saveBtn) saveBtn.style.display = 'none';
    var streamBtn = document.getElementById('toggle-stream');
    if (streamBtn) streamBtn.click();
    setTimeout(function() {
      var streamImg = document.getElementById('stream');
      if (streamImg) { streamImg.style.width = '100vw'; streamImg.style.height = '100vh'; streamImg.style.objectFit = 'cover'; streamImg.style.marginTop = '0'; streamImg.style.borderRadius = '0'; streamImg.style.display = 'block'; }
      var streamContainer = document.getElementById('stream-container');
      if (streamContainer) { streamContainer.style.width = '100vw'; streamContainer.style.height = '100vh'; streamContainer.style.minWidth = 'unset'; streamContainer.style.margin = '0'; streamContainer.style.padding = '0'; }
    }, 500);
    window.ReactNativeWebView.postMessage('loaded');
  })();
  true;
`;

const initialDHT: DHTData = { humedad: null, temperatura: null, error: false };
const initialAir: AirData = { ppm: null, error: false };

export default function CameraScreen() {
  const router = useRouter();
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [key, setKey]             = useState(Date.now());
  const [sensor1, setSensor1]     = useState<DHTData>(initialDHT);
  const [sensor2, setSensor2]     = useState<DHTData>(initialDHT);
  const [aire, setAire]           = useState<AirData>(initialAir);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const sensor1Ref = useRef(sensor1);
  const sensor2Ref = useRef(sensor2);
  const aireRef    = useRef(aire);

  useEffect(() => { sensor1Ref.current = sensor1; }, [sensor1]);
  useEffect(() => { sensor2Ref.current = sensor2; }, [sensor2]);
  useEffect(() => { aireRef.current = aire; }, [aire]);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => { ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT); };
  }, []);

  useEffect(() => {
    const fetchDHT = (url: string, setter: (d: DHTData) => void) => {
      fetch(url)
        .then((r) => r.json())
        .then((d) => setter({ humedad: d.humedad, temperatura: d.temperatura, error: false }))
        .catch(() => setter({ humedad: null, temperatura: null, error: true }));
    };

    const fetchAir = () => {
      fetch(AIRE_URL)
        .then((r) => r.json())
        .then((d) => setAire({ ppm: d.ppm, error: false }))
        .catch(() => setAire({ ppm: null, error: true }));
    };

    const poll = () => {
      fetchDHT(SENSOR_1_URL, setSensor1);
      fetchDHT(SENSOR_2_URL, setSensor2);
      fetchAir();
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const saveToSupabase = async () => {
      const s1  = sensor1Ref.current;
      const s2  = sensor2Ref.current;
      const air = aireRef.current;

      if (s1.error && s2.error && air.error) return;

      const { error } = await supabase.from("mediciones").insert({
        sensor1_humedad:     s1.humedad,
        sensor1_temperatura: s1.temperatura,
        sensor2_humedad:     s2.humedad,
        sensor2_temperatura: s2.temperatura,
        aire_ppm:            air.ppm,
      });

      if (!error) {
        const now = new Date();
        setLastSaved(`${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`);
      }
    };

    const saveInterval = setInterval(saveToSupabase, SAVE_INTERVAL);
    return () => clearInterval(saveInterval);
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
            onMessage={(e) => { if (e.nativeEvent.data === "loaded") setLoading(false); }}
            onError={() => { setLoading(false); setError(true); }}
            onHttpError={() => { setLoading(false); setError(true); }}
            originWhitelist={["*"]}
            mixedContentMode="always"
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />

          {/* Overlay: cargando */}
          {loading && !error && (
            <View className="absolute inset-0 bg-black/70 items-center justify-center">
              <ActivityIndicator size="large" color="#228B22" />
              <Text className="text-white mt-2 text-base">Conectando…</Text>
            </View>
          )}

          {/* Overlay: error */}
          {error && (
            <View className="absolute inset-0 bg-black/70 items-center justify-center">
              <TriangleAlert color="#FFFFFF" size={60} />
              <Text className="text-white mt-2 text-base">Sin conexión con la cámara</Text>
              <TouchableOpacity
                className="mt-4 bg-[#228B22] px-5 py-2 rounded-lg"
                onPress={reload}
              >
                <Text className="text-white font-semibold">Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Badge EN VIVO */}
          {!loading && !error && (
            <View className="absolute top-2 left-2 flex-row items-center bg-black/50 px-3 py-1 rounded-full gap-x-2">
              <View className="w-2 h-2 rounded-full bg-red-500" />
              <Text className="text-white text-xs font-medium">EN VIVO  {CAM_IP}</Text>
              <TouchableOpacity className="ml-2" onPress={() => router.replace("/")}>
                <House color="#E0E0E0" size={20} />
              </TouchableOpacity>
            </View>
          )}

          {/* Badge guardado */}
          {lastSaved && (
            <View className="absolute bottom-2 left-2 bg-black/50 px-3 py-1 rounded-full">
              <Text className="text-white text-xs">💾 {lastSaved}</Text>
            </View>
          )}

          {/* Botón reload */}
          {!loading && !error && (
            <TouchableOpacity
              className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full"
              onPress={reload}
            >
              <RefreshCcw color="#FFFFFF" size={20} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Panel sensores ── */}
        <TouchableOpacity
          className="w-36 bg-[#0a0a0a] items-center justify-center gap-y-3 px-2 py-4"
          onPress={() => router.push("/ServerScreen")}
          activeOpacity={0.8}
        >
          <Trees color="#228B22" />
          <Text className="text-white font-bold text-lg tracking-widest">MOE</Text>
          <DHTCard titulo="Sensor 1" data={sensor1} />
          <DHTCard titulo="Sensor 2" data={sensor2} />
          <AirCard data={aire} />
        </TouchableOpacity>

      </View>
    </View>
  );
}