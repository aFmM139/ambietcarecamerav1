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
import { DHTCard, DHTData } from "@/Components/SensorCard";
import { cameraStyles as cs, sensorStyles as ss } from "@/lib/constants/styles";
import { RefreshCcw,Trees  } from 'lucide-react-native';

const CAM_IP  = "192.168.1.24";
const CAM_URL = `http://${CAM_IP}`;

const SENSOR_1_URL = "http://192.168.1.27/sensor"; // ← IP Sensor 1
const SENSOR_2_URL = "http://192.168.1.27/sensor"; // ← IP Sensor 2

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

export default function CameraScreen() {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [key, setKey]           = useState(0);
  const [sensor1, setSensor1]   = useState<DHTData>(initialDHT);
  const [sensor2, setSensor2]   = useState<DHTData>(initialDHT);

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

    const poll = () => {
      fetchDHT(SENSOR_1_URL, setSensor1);
      fetchDHT(SENSOR_2_URL, setSensor2);
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
              <Text style={cs.reloadText}>
              <RefreshCcw 
              color={"#FFFFFF"}
              size={20}
              />
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Panel sensores ── */}
        <View style={ss.sensorPanel}>
        <Text style={ss.companyName}>
          <Trees 
          color={"#228B22"}
          />
        </Text>
          <Text style={ss.companyName}>AMBIETCARE</Text>
          <DHTCard titulo="Sensor 1" data={sensor1} />
          <DHTCard titulo="Sensor 2" data={sensor2} />
        </View>

      </View>
    </View>
  );
}