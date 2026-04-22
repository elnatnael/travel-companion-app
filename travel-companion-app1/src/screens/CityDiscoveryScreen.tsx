import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import { useFavorites } from '../context/FavoritesContext'; // <-- import your favorites context

/* ================= TYPES ================= */

type City = {
  geonameId: number;
  name: string;
  adminName1?: string;
  population?: number;
  lat: string;
  lng: string;
};

type Place = {
  pageid: number;
  title_en: string;
  title_ru?: string;
};

/* ================= MAIN ================= */

export default function CityDiscoveryScreen() {
  const [query, setQuery] = useState('Moscow');
  const [city, setCity] = useState<City | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { addFavorite } = useFavorites(); // <-- hook to add favorite

  /* ================= FETCH CITY ================= */

  const fetchCity = async (search: string) => {
    if (!search.trim()) return;

    setLoading(true);
    setCity(null);
    setPlaces([]);

    try {
      const geoUrl = `https://secure.geonames.org/searchJSON?q=${encodeURIComponent(
        search
      )}&country=RU&featureClass=P&maxRows=1&username=elnatnael09`;

      const res = await fetch(geoUrl);
      const data = await res.json();

      if (data.geonames?.length > 0) {
        const c = data.geonames[0];
        setCity(c);
        fetchPlaces(c.lat, c.lng);
      }
    } catch (err) {
      console.log('CITY ERROR', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* ================= FETCH LANDMARKS ================= */

  const fetchPlaces = async (lat: string, lng: string) => {
    try {
      const wikiGeoUrl =
        `https://en.wikipedia.org/w/api.php?` +
        `action=query&list=geosearch&gscoord=${lat}|${lng}` +
        `&gsradius=10000&gslimit=10&format=json&origin=*`;

      const res = await fetch(wikiGeoUrl, {
        headers: {
          'User-Agent': 'TravelCompanion/1.0',
          Accept: 'application/json',
        },
      });

      const data = await res.json();

      const mappedPlaces: Place[] = data.query?.geosearch.map((p: any) => ({
        pageid: p.pageid,
        title_en: p.title,
        title_ru: undefined,
      })) || [];

      const ruPromises = mappedPlaces.map(async (p) => {
        try {
          const ruRes = await fetch(
            `https://ru.wikipedia.org/w/api.php?action=query&pageids=${p.pageid}&prop=info&format=json&origin=*`
          );
          const ruData = await ruRes.json();
          const ruPage = ruData.query.pages[p.pageid];
          return { ...p, title_ru: ruPage?.title || undefined };
        } catch {
          return p;
        }
      });

      const placesWithRU = await Promise.all(ruPromises);
      setPlaces(placesWithRU);
    } catch (err) {
      console.log('WIKI ERROR', err);
      setPlaces([]);
    }
  };

  /* ================= OPEN MAP ================= */

  const openInMaps = async (placeName: string) => {
    if (!city) return;

    const label = `${placeName}, ${city.name}`;
    const geoUrl = `geo:0,0?q=${encodeURIComponent(label)}`;
    const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      label
    )}`;

    try {
      const supported = await Linking.canOpenURL(geoUrl);
      supported ? await Linking.openURL(geoUrl) : await Linking.openURL(webUrl);
    } catch {
      Linking.openURL(webUrl);
    }
  };

  /* ================= OPEN WIKIPEDIA ================= */

  const openWikipedia = (pageid: number, lang: 'en' | 'ru') => {
    Linking.openURL(`https://${lang}.wikipedia.org/?curid=${pageid}`);
  };

  /* ================= UI ================= */

  useEffect(() => {
    fetchCity(query);
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Cities and Experiences</Text>
        <Text style={styles.subtitle}>
          Discover landmarks and open them in your favorite map app
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchCity(query);
            }}
            colors={['#1e90ff']}
          />
        }
      >
        {/* SEARCH INPUT */}
        <TextInput
          style={styles.input}
          placeholder="Search city (Moscow, Kazan, Volgograd...)"
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => fetchCity(query)}
        />

        {loading && <ActivityIndicator size="large" color="#1e90ff" />}

        {city && (
          <View style={styles.cityCard}>
            <Text style={styles.cityName}>{city.name}</Text>
            <Text style={styles.info}>
              Region:{' '}
              <Text style={styles.infoHighlight}>
                {city.adminName1 || 'Unknown'}
              </Text>
            </Text>
            <Text style={styles.info}>
              Population:{' '}
              <Text style={styles.infoHighlight}>
                {city.population?.toLocaleString() || 'Unknown'}
              </Text>
            </Text>

            <View style={styles.divider} />
            <Text style={styles.section}>📍 Places to Visit</Text>

            {places.length === 0 && (
              <Text style={styles.empty}>No landmarks found</Text>
            )}

            {places.map((item) => (
              <View key={item.pageid} style={styles.placeRow}>
                <Text style={styles.placeText}>
                  📍 {item.title_en} {item.title_ru ? `/ ${item.title_ru}` : ''}
                </Text>

                <View style={styles.buttonsRow}>
                  {/* EN Wikipedia */}
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => openWikipedia(item.pageid, 'en')}
                  >
                    <Text style={styles.infoButtonText}>EN Wiki</Text>
                  </TouchableOpacity>

                  {/* RU Wikipedia */}
                  {item.title_ru && (
                    <TouchableOpacity
                      style={[styles.infoButton, { backgroundColor: '#ff5722' }]}
                      onPress={() => openWikipedia(item.pageid, 'ru')}
                    >
                      <Text style={styles.infoButtonText}>RU Wiki</Text>
                    </TouchableOpacity>
                  )}

                  {/* MAPS */}
                  <TouchableOpacity
                    style={styles.mapButton}
                    onPress={() => openInMaps(item.title_en)}
                  >
                    <Text style={styles.mapButtonText}>Maps →</Text>
                  </TouchableOpacity>

                  {/* ⭐ FAVORITE BUTTON */}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() =>
                      addFavorite({
                        id: item.pageid,
                        title_en: item.title_en,
                        title_ru: item.title_ru,
                        city: city.name,
                        photos: [],
                      })
                    }
                  >
                    <Text style={styles.favoriteText}>⭐ Favorite</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { padding: 18 },
  title: { fontSize: 28, fontWeight: '800', color: '#fff' },
  subtitle: { marginTop: 6, color: '#cbd5f5' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  input: {
    backgroundColor: '#020617',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 15,
  },
  cityCard: { backgroundColor: '#020617', borderRadius: 20, padding: 18 },
  cityName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  info: { color: '#94a3b8' },
  infoHighlight: { color: '#38bdf8', fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#1e293b', marginVertical: 14 },
  section: { fontSize: 18, fontWeight: '700', color: '#38bdf8', marginBottom: 10 },
  placeRow: { backgroundColor: '#0f172a', borderRadius: 14, padding: 14, marginBottom: 10 },
  placeText: { fontSize: 14, color: '#e5e7eb', marginBottom: 10, fontWeight: '500' },
  buttonsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  infoButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  infoButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  mapButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },
  mapButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  favoriteButton: {
    backgroundColor: '#facc15',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
  },
  favoriteText: { color: '#000', fontSize: 12, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#94a3b8', marginVertical: 10 },
});
