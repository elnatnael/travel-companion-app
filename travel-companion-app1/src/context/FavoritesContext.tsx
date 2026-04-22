import React, { createContext, useContext, useState } from "react";

export type FavoritePlace = {
  id: number;
  title_en: string;
  title_ru?: string;
  city: string;
  photos: string[];
};

type FavoritesContextType = {
  favorites: FavoritePlace[];
  addFavorite: (place: FavoritePlace) => void;
  removeFavorite: (id: number) => void;
  addPhoto: (id: number, uri: string) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoritePlace[]>([]);

  const addFavorite = (place: FavoritePlace) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === place.id) ? prev : [...prev, place]
    );
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  const addPhoto = (id: number, uri: string) => {
    setFavorites((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, photos: [...p.photos, uri] } : p
      )
    );
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, addPhoto }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside provider");
  return ctx;
};
