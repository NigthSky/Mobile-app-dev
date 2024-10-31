import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="Profile"/>
      <Stack.Screen name="Register"/>
      <Stack.Screen name="camera"/>
    </Stack>
  );
}