import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Camera" />
      <Stack.Screen name="History" />
      <Stack.Screen name="Charts" />
    </Stack>
  );
}