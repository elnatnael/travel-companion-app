import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  StyleSheet
} from "react-native";
import * as Location from "expo-location";

const BACKEND_URL = "http://10.55.112.100:3000"; // YOUR IP

export default function DiscoveryScreen() {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permission denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    try {
      const res = await fetch(
        `${BACKEND_URL}/places?lat=${latitude}&lng=${longitude}`
      );
      const data = await res.json();
      setPlaces(data.places || []);
    } catch (e) {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  const openGoogle = (name: string) => {
    const query = encodeURIComponent(name + " landmark");
    Linking.openURL(`https://www.google.com/search?q=${query}`);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <FlatList
      data={places}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => openGoogle(item.name)}
        >
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.address}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  title: {
    fontSize: 16,
    fontWeight: "bold"
  },
  subtitle: {
    color: "#666"
  }
});
