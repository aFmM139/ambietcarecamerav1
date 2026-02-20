import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import * as ScreenOrientation from "expo-screen-orientation";

const CAM_IP  = "192.168.18.179";
const CAM_URL = `http://${CAM_IP}`;

// ── IPs de los 3 sensores ─────────────────────────────────
const SENSOR_1_URL = "http://192.168.18.XX/sensor"; // ← Sensor 1
const SENSOR_2_URL = "http://192.168.18.XX/sensor"; // ← Sensor 2
const SENSOR_3_URL = "http://192.168.18.XX/sensor"; // ← Sensor 3
// ─────────────────────────────────────────────────────────

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

type SensorData = { humedad: number | null; temperatura: number | null; error: boolean };
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

  const SensorCard = ({ titulo, data }: { titulo: string; data: SensorData }) => (
    <View style={styles.sensorCard}>
      <Text style={styles.sensorTitle}>{titulo}</Text>
      <View style={styles.sensorRow}>
        <View style={styles.sensorItem}>
          <Text style={styles.sensorLabel}>💧 Humedad</Text>
          <Text style={styles.sensorValue}>
            {data.error ? "—" : data.humedad !== null ? `${data.humedad}%` : "…"}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.sensorItem}>
          <Text style={styles.sensorLabel}>🌡️ Temp.</Text>
          <Text style={styles.sensorValue}>
            {data.error ? "—" : data.temperatura !== null ? `${data.temperatura}°C` : "…"}
          </Text>
        </View>
      </View>
      {data.error && <Text style={styles.sensorErrorText}>Sin señal</Text>}
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <View style={styles.row}>

        {/* ── Cámara ── */}
        <View style={styles.cameraContainer}>
          <WebView
            key={key}
            style={styles.webview}
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
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#00e5ff" />
              <Text style={styles.overlayText}>Conectando…</Text>
            </View>
          )}

          {error && (
            <View style={styles.overlay}>
              <Text style={styles.errorEmoji}>⚠️</Text>
              <Text style={styles.overlayText}>Sin conexión con la cámara</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={reload}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && (
            <View style={styles.badge}>
              <View style={styles.liveDot} />
              <Text style={styles.badgeText}>EN VIVO  {CAM_IP}</Text>
            </View>
          )}

          {!loading && !error && (
            <TouchableOpacity style={styles.reloadBtn} onPress={reload}>
              <Text style={styles.reloadText}>↺</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Panel sensores ── */}
        <View style={styles.sensorPanel}>
          <Text style={styles.companyName}>AMBIETCARE</Text>
          <SensorCard titulo="Sensor 1" data={sensor1} />
          <SensorCard titulo="Sensor 2" data={sensor2} />
          <SensorCard titulo="Sensor 3" data={sensor3} />
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0a0a" },
  row:  { flex: 1, flexDirection: "row" },

  cameraContainer: { flex: 3, backgroundColor: "#000" },
  webview: { flex: 1, backgroundColor: "#000" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  overlayText: { color: "#666", fontSize: 14, letterSpacing: 1 },
  errorEmoji: { fontSize: 40 },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#00e5ff15",
    borderWidth: 1,
    borderColor: "#00e5ff",
  },
  retryText: { color: "#00e5ff", fontWeight: "700", letterSpacing: 1 },
  badge: {
    position: "absolute",
    top: 14,
    left: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00000099",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#ffffff15",
    zIndex: 5,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#ff2222" },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600", letterSpacing: 1 },
  reloadBtn: {
    position: "absolute",
    top: 10,
    right: 14,
    backgroundColor: "#00000099",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ffffff15",
    zIndex: 5,
  },
  reloadText: { color: "#fff", fontSize: 20, lineHeight: 24 },

  sensorPanel: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#222",
  },
  companyName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 2,
  },
  sensorCard: {
    width: "100%",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    gap: 6,
  },
  sensorTitle: {
    color: "#aaa",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  sensorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  sensorItem: { alignItems: "center", gap: 2 },
  divider: { width: 1, height: 30, backgroundColor: "#2a2a2a" },
  sensorLabel: { color: "#666", fontSize: 10, fontWeight: "600" },
  sensorValue: { color: "#00e5ff", fontSize: 20, fontWeight: "800" },
  sensorErrorText: { color: "#ff4444", fontSize: 10, letterSpacing: 1, textAlign: "center" },
});