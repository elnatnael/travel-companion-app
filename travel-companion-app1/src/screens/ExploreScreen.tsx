import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const slides = [
  {
    title: "Moscow",
    subtitle: "The heart of Russia",
    image: require("../assets/images/moscow1.jpg"),
  },
  {
    title: "Red Square",
    subtitle: "Historic and iconic",
    image: require("../assets/images/moscow2.jpg"),
  },
  {
    title: "Saint Petersburg",
    subtitle: "City of palaces & canals",
    image: require("../assets/images/SaintPetersburg.jpg"),
  },
  {
    title: "Sochi",
    subtitle: "Black Sea resort",
    image: require("../assets/images/sochi.jpg"),
  },
];

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (index + 1) % slides.length;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, [index]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.title}>Explore Russia 🇷🇺</Text>
        <Text style={styles.subtitle}>
          Discover cities, culture, and unforgettable places
        </Text>
      </View>

      {/* SLIDER */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
      >
        {slides.map((item, i) => (
          <Pressable
            key={i}
            style={styles.slide}
            onPress={() =>
              navigation.navigate("Discover", { city: item.title })
            }
          >
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.slideTitle}>{item.title}</Text>
              <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* DOTS */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, index === i && styles.dotActive]}
          />
        ))}
      </View>

      {/* FUN FACTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Did you know? 🤔</Text>
        <Text style={styles.fact}>• Russia spans 11 time zones</Text>
        <Text style={styles.fact}>
          • Moscow metro is one of the deepest in the world
        </Text>
        <Text style={styles.fact}>
          • The Hermitage has over 3 million artworks
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.navigate("Discover")}
      >
        <Text style={styles.ctaTitle}>Continue Exploring 🌍</Text>
        <Text style={styles.ctaText}>
          Cities, landmarks & experiences
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0f172a",
    flex: 1,
  },
  hero: {
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#cbd5f5",
    marginTop: 6,
  },
  slide: {
    width,
    height: 260,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  slideTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  slideSubtitle: {
    color: "#e5e7eb",
    fontSize: 14,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#475569",
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: "#38bdf8",
    width: 16,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  fact: {
    color: "#cbd5f5",
    fontSize: 15,
    marginBottom: 6,
  },
  cta: {
    margin: 20,
    padding: 22,
    backgroundColor: "#38bdf8",
    borderRadius: 20,
  },
  ctaTitle: {
    color: "#0f172a",
    fontSize: 20,
    fontWeight: "800",
  },
  ctaText: {
    color: "#0f172a",
    marginTop: 4,
  },
});
