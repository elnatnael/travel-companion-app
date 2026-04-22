import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ExploreScreen from "./src/screens/ExploreScreen";
import CityDiscoveryScreen from "./src/screens/CityDiscoveryScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import { FavoritesProvider } from "./src/context/FavoritesContext";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#020617",
              borderTopWidth: 0,
              height: 62,
            },
            tabBarActiveTintColor: "#38bdf8",
            tabBarInactiveTintColor: "#94a3b8",
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: 6,
            },
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "help";

              if (route.name === "Explore") iconName = "compass";
              if (route.name === "Discover") iconName = "location";
              if (route.name === "Favorites") iconName = "heart";

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          {/* 1️⃣ Explore */}
          <Tab.Screen name="Explore" component={ExploreScreen} />

          {/* 2️⃣ Discover */}
          <Tab.Screen
            name="Discover"
            component={CityDiscoveryScreen}
            options={{ title: "Cities & Experiences" }}
          />

          {/* 3️⃣ Favorites (LAST) */}
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ title: "My Places" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}
