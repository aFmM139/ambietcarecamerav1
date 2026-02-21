import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Webcam, TvMinimalPlay, Droplet, Thermometer } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>

      {/* Logo / Título */}
      <View style={styles.logoContainer}>
        <Text>
          <Webcam size={70} color="#FFFFFF" />
        </Text>
        <Text style={styles.company}>AMBIETCARE</Text>
        <Text style={styles.subtitle}>Sistema de monitoreo ambiental</Text>
      </View>

      {/* Línea decorativa */}
      <View style={styles.line} />

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>
            <TvMinimalPlay color={"#FFFFFF"} size={20} />
          </Text>
          <Text style={styles.infoText}>Cámara en vivo</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>
            <Droplet color={"#FFFFFF"} size={20} />
          </Text>
          <Text style={styles.infoText}>Humedad en tiempo real</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>
            <Thermometer color={"#FFFFFF"} size={20} />
          </Text>
          <Text style={styles.infoText}>Temperatura en tiempo real</Text>
        </View>
      </View>

      {/* Botón */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/CameraScreen")}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Ingresar al sistema</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0f0a",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    gap: 10,
  },
  company: {
    color: "#2ECC2E",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 6,
  },
  subtitle: {
    color: "#5a7a5a",
    fontSize: 13,
    letterSpacing: 1,
  },
  line: {
    width: 60,
    height: 2,
    backgroundColor: "#228B22",
    borderRadius: 2,
  },
  infoContainer: {
    gap: 14,
    alignItems: "flex-start",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoIcon: { fontSize: 20 },
  infoText: {
    color: "#5a7a5a",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  btn: {
    backgroundColor: "#228B2215",
    borderWidth: 1,
    borderColor: "#228B22",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    color: "#2ECC2E",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
});