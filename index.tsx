import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";

const apiKey = "c6259f32c862a6c498c87d182ea451c3";

const cityList = [
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
  { name: "Chicago", lat: 41.8781, lon: -87.6298 },
  { name: "Dallas", lat: 32.7767, lon: -96.797 },
  { name: "Miami", lat: 25.7617, lon: -80.1918 },
  { name: "Philadelphia", lat: 39.9526, lon: -75.1652 },
  { name: "Houston", lat: 29.7604, lon: -95.3698 },
  { name: "Phoenix", lat: 33.4484, lon: -112.074 },
  { name: "Seattle", lat: 47.6062, lon: -122.332 },
  { name: "Boston", lat: 42.3601, lon: -71.0589 },
];

export default function Index() {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [locationWeather, setLocationWeather] = useState<any>(null);
  const router = useRouter();

  const fetchWeather = async (lat: number, lon: number) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    const res = await fetch(url);
    return res.json();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const data = await fetchWeather(loc.coords.latitude, loc.coords.longitude);
      setLocationWeather({
        ...data,
        isCurrent: true,
      });
    })();
  }, []);

  useEffect(() => {
    const loadCityWeather = async () => {
      const results: any[] = [];
      for (const city of cityList) {
        const data = await fetchWeather(city.lat, city.lon);
        results.push(data);
      }
      setWeatherData(results);
    };
    loadCityWeather();
  }, []);

  const handlePress = (item: any) => {
    router.push({
      pathname: "CityDetail",
      params: { data: JSON.stringify(item) as string},
    } as any );
  };

  const renderCity = ({ item }: any) => (
    <TouchableOpacity onPress={() => handlePress(item)} style={styles.card}>
      <Text style={styles.city}>{item.name}</Text>
      <Image
        style={styles.icon}
        source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
      />
      <Text style={styles.temp}>{Math.round(item.main.temp)}°F</Text>
      <Text style={styles.desc}>{item.weather[0].description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {locationWeather && (
        <TouchableOpacity style={styles.currentCard} onPress={() => handlePress(locationWeather)}>
          <Text style={styles.currentText}>📍 Your Location</Text>
          <Text style={styles.city}>{locationWeather.name ?? "Nearby"}</Text>
          <Text style={styles.temp}>{Math.round(locationWeather.main.temp)}°F</Text>
        </TouchableOpacity>
      )}

      {}
      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#E3F2FD", flex: 1, padding: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    alignItems: "center",
  },
  currentCard: {
    backgroundColor: "#BBDEFB",
    padding: 18,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  currentText: { fontSize: 18, fontWeight: "bold" },
  city: { fontSize: 22, fontWeight: "bold" },
  temp: { fontSize: 20 },
  desc: { fontSize: 16, textTransform: "capitalize" },
  icon: { width: 50, height: 50, marginVertical: 5 },
});
