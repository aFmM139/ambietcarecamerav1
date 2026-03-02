import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="CameraScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ServerScreen" options={{ headerShown: false }} />
      <Stack.Screen name="TableScreen" options={{ headerShown: false }} />
    </Stack>
  );
}