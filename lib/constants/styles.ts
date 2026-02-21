import { StyleSheet } from "react-native";

// Paleta verde ambiental basada en #228B22
export const colors = {
  primary:     "#228B22", // verde bosque
  primaryLight:"#2ECC2E", // verde claro
  primaryDim:  "#228B2215", // verde muy transparente
  primaryBorder:"#228B2266", // verde semitransparente
  bg:          "#0a0f0a", // negro verdoso
  surface:     "#111a11", // superficie oscura verdosa
  card:        "#162016", // card oscura
  cardBorder:  "#1e2e1e", // borde card
  text:        "#ffffff",
  textMuted:   "#5a7a5a", // gris verdoso
  error:       "#ff4444",
  live:        "#ff2222",
};

export const cameraStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
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
  overlayText: { color: colors.textMuted, fontSize: 14, letterSpacing: 1 },
  errorEmoji: { fontSize: 40 },
  retryBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primaryDim,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retryText: { color: colors.primaryLight, fontWeight: "700", letterSpacing: 1 },
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
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.live },
  badgeText: { color: colors.text, fontSize: 11, fontWeight: "600", letterSpacing: 1 },
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
  reloadText: { color: colors.text, fontSize: 20, lineHeight: 24 },
});

export const sensorStyles = StyleSheet.create({
  sensorPanel: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 14,
    borderLeftWidth: 1,
    borderLeftColor: colors.cardBorder,
  },
  companyName: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: 2,
  },
  sensorCard: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 8,
    alignItems: "center",
  },
  sensorTitle: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    alignSelf: "flex-start",
  },
  sensorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
  },
  sensorItem: { alignItems: "center", gap: 2 },
  divider: { width: 1, height: 30, backgroundColor: colors.cardBorder },
  sensorLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "600" },
  sensorValue: { color: colors.primaryLight, fontSize: 20, fontWeight: "800" },
  sensorErrorText: { color: colors.error, fontSize: 10, letterSpacing: 1, textAlign: "center" },
});

export const welcomeStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 40,
  },
  logoContainer: { alignItems: "center", gap: 10 },
  logo: { fontSize: 64 },
  company: {
    color: colors.primaryLight,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 6,
  },
  subtitle: { color: colors.textMuted, fontSize: 13, letterSpacing: 1 },
  line: {
    width: 60,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  infoContainer: { gap: 14, alignItems: "flex-start" },
  infoItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoIcon: { fontSize: 20 },
  infoText: { color: colors.textMuted, fontSize: 14, letterSpacing: 0.5 },
  btn: {
    backgroundColor: colors.primaryDim,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    color: colors.primaryLight,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1,
  },
});