import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Weather List" }} />
      <Stack.Screen name="CityDetail" options={{ title: "Details" }} />
    </Stack>
  );
}
