import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Webcam, TvMinimalPlay, Droplet, Thermometer, Wind } from 'lucide-react-native';
import { colors } from "@/lib/constants/styles";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>

      <View style={styles.logoContainer}>
        <Text>
          <Webcam size={70} color={colors.primary} />
        </Text>
        <Text style={styles.company}>MOE</Text>
        <Text style={styles.subtitle}>Sistema Móvil de Operación y Exploración Ambiental</Text>
      </View>

      <View style={styles.line} />

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>
            <TvMinimalPlay color={colors.textLight} size={20} />
          </Text>
          <Text style={styles.infoText}>Cámara en vivo</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>
            <Droplet color={colors.textLight} size={20} />
          </Text>
          <Text style={styles.infoText}>Humedad en tiempo real</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>
            <Thermometer color={colors.textLight} size={20} />
          </Text>
          <Text style={styles.infoText}>Temperatura en tiempo real</Text>
        </View>
        <View style={styles.infoItem}>
          <Wind color="#FFFFFF" size={20} />
          <Text style={styles.infoText}>Calidad de aire en tiempo real</Text>
        </View>
      </View>

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
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 40,
  },
  logoContainer: { alignItems: "center", gap: 10 },
  company: {
    color: "#E0E0E0",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 6,
  },
  subtitle: { 
    color: "#9E9E9E", 
    fontSize: 13, 
    textAlign: "center", 
    letterSpacing: 0.5 
  },
  line: {
    width: 60,
    height: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  infoContainer: { gap: 14, alignItems: "flex-start" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoIcon: { fontSize: 20 },
  infoText: { color: "#9E9E9E", fontSize: 14, letterSpacing: 0.5 },
  btn: {
    backgroundColor: "#4CAF5020",
    borderWidth: 1,
    borderColor: "#4CAF50",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    color: "#81C784",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
});