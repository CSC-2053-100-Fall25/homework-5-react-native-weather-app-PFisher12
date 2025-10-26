import { View, Text, StyleSheet, Image, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CityDetail() {
  const { data } = useLocalSearchParams();
  const router = useRouter();
  const weather = JSON.parse(data as string);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{weather.name}</Text>

      <Image
        style={styles.icon}
        source={{
          uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        }}
      />

      <Text style={styles.temp}>{Math.round(weather.main.temp)}°F</Text>
      <Text style={styles.desc}>{weather.weather[0].description}</Text>

      <Text style={styles.detail}>Humidity: {weather.main.humidity}%</Text>
      <Text style={styles.detail}>Wind Speed: {weather.wind.speed} mph</Text>

      <Button title="Go Back" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  icon: { width: 100, height: 100 },
  temp: { fontSize: 26, marginTop: 10 },
  desc: { fontSize: 22, textTransform: "capitalize" },
  detail: { fontSize: 18, marginTop: 4 },
});
