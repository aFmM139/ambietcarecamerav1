import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>

      {/* Logo / Título */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>📷</Text>
        <Text style={styles.company}>AMBIETCARE</Text>
        <Text style={styles.subtitle}>Sistema de monitoreo ambiental</Text>
      </View>

      {/* Línea decorativa */}
      <View style={styles.line} />

      {/* Info */}
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🎥</Text>
          <Text style={styles.infoText}>Cámara en vivo</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>💧</Text>
          <Text style={styles.infoText}>Humedad en tiempo real</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>🌡️</Text>
          <Text style={styles.infoText}>Temperatura en tiempo real</Text>
        </View>
      </View>

      {/* Botón */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push("/CameraScreen")}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>Ingresar al sistema →</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: "center",
    gap: 10,
  },
  logo: { fontSize: 64 },
  company: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 6,
  },
  subtitle: {
    color: "#555",
    fontSize: 13,
    letterSpacing: 1,
  },
  line: {
    width: 60,
    height: 2,
    backgroundColor: "#00e5ff",
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
    color: "#888",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  btn: {
    backgroundColor: "#00e5ff15",
    borderWidth: 1,
    borderColor: "#00e5ff",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    color: "#00e5ff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
});