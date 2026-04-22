import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useFavorites } from "../context/FavoritesContext";

/* ================= MAIN ================= */

export default function FavoritesScreen() {
  const { favorites, removeFavorite, addPhoto } = useFavorites();

  /* ================= PICK IMAGE ================= */

  const pickImage = async (id: number) => {
    // Ask permission (Android safety)
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos to add images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // ✅ correct & future-proof
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      addPhoto(id, result.assets[0].uri);
    }
  };

  /* ================= EMPTY STATE ================= */

  if (favorites.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>⭐ No Favorites Yet</Text>
        <Text style={styles.emptyText}>
          Save landmarks and add photos after your visit
        </Text>
      </View>
    );
  }

  /* ================= LIST ================= */

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* ===== TITLE ===== */}
          <Text style={styles.title}>
            {item.title_en}
            {item.title_ru ? ` / ${item.title_ru}` : ""}
          </Text>

          <Text style={styles.city}>📍 {item.city}</Text>

          {/* ===== PHOTO GALLERY ===== */}
          {item.photos.length > 0 && (
            <View style={styles.gallery}>
              {item.photos.map((uri, idx) => (
                <Image key={idx} source={{ uri }} style={styles.image} />
              ))}
            </View>
          )}

          {/* ===== ACTIONS ===== */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.photoBtn}
              onPress={() => pickImage(item.id)}
            >
              <Text style={styles.btnText}>📸 Add Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFavorite(item.id)}
            >
              <Text style={styles.btnText}>🗑 Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: "#0f172a",
  },

  empty: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#020617",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  title: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  city: {
    color: "#94a3b8",
    marginBottom: 10,
  },

  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  photoBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  removeBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  btnText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
});
