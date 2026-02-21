import { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";
import SensorCard, { SensorData } from "@/Components/SensorCard";
import { cameraStyles as cs, sensorStyles as ss } from "@/lib/constants/styles";

const CAM_IP  = "192.168.1.24";
const CAM_URL = `http://${CAM_IP}`;

const SENSOR_1_URL = "http://192.168.18.XX/sensor"; // ← Sensor 1
const SENSOR_2_URL = "http://192.168.18.XX/sensor"; // ← Sensor 2
const SENSOR_3_URL = "http://192.168.18.XX/sensor"; // ← Sensor 3

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

const initialSensor: SensorData = { humedad: null, temperatura: null, error: false };

export default function CameraScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [key, setKey]         = useState(0);
  const [sensor1, setSensor1] = useState<SensorData>(initialSensor);
  const [sensor2, setSensor2] = useState<SensorData>(initialSensor);
  const [sensor3, setSensor3] = useState<SensorData>(initialSensor);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    return () => { ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT); };
  }, []);

  const fetchSensor = (url: string, setter: (d: SensorData) => void) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setter({ humedad: data.humedad, temperatura: data.temperatura, error: false }))
      .catch(() => setter({ humedad: null, temperatura: null, error: true }));
  };

  useEffect(() => {
    const poll = () => {
      fetchSensor(SENSOR_1_URL, setSensor1);
      fetchSensor(SENSOR_2_URL, setSensor2);
      fetchSensor(SENSOR_3_URL, setSensor3);
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  const reload = () => {
    setLoading(true);
    setError(false);
    setKey((k) => k + 1);
  };

  return (
    <View style={cs.root}>
      <StatusBar hidden />

      <View style={cs.row}>

        {/* ── Cámara ── */}
        <View style={cs.cameraContainer}>
          <WebView
            key={key}
            style={cs.webview}
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

          {loading && !error && (
            <View style={cs.overlay}>
              <ActivityIndicator size="large" color="#00e5ff" />
              <Text style={cs.overlayText}>Conectando…</Text>
            </View>
          )}

          {error && (
            <View style={cs.overlay}>
              <Text style={cs.errorEmoji}>⚠️</Text>
              <Text style={cs.overlayText}>Sin conexión con la cámara</Text>
              <TouchableOpacity style={cs.retryBtn} onPress={reload}>
                <Text style={cs.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && (
            <View style={cs.badge}>
              <View style={cs.liveDot} />
              <Text style={cs.badgeText}>EN VIVO  {CAM_IP}</Text>
            </View>
          )}

          {!loading && !error && (
            <TouchableOpacity style={cs.reloadBtn} onPress={reload}>
              <Text style={cs.reloadText}>↺</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Panel sensores ── */}
        <View style={ss.sensorPanel}>
          <Text style={ss.companyName}>AMBIETCARE</Text>
          <SensorCard titulo="Sensor 1" data={sensor1} />
          <SensorCard titulo="Sensor 2" data={sensor2} />
          <SensorCard titulo="Sensor 3" data={sensor3} />
        </View>

      </View>
    </View>
  );
}