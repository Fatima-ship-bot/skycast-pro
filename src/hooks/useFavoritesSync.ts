// Hook to manage favorites with database sync
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import * as favoritesService from "@/services/favoritesService";
import type { FavoriteCity as FavoriteCityType } from "@/services/favoritesService";

export function useFavoritesSync() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteCityType[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from database on mount and when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
      setLoading(false);
    }
  }, [user]);

  async function loadFavorites() {
    setLoading(true);
    const data = await favoritesService.getFavorites();
    setFavorites(data);
    setLoading(false);
  }

  async function addFavorite(cityName: string, lat: number, lon: number, countryCode?: string) {
    if (!user) return null;
    const result = await favoritesService.addFavorite(cityName, lat, lon, countryCode);
    if (result) {
      setFavorites((prev) => [result, ...prev]);
    }
    return result;
  }

  async function removeFavorite(cityName: string) {
    if (!user) return false;
    const result = await favoritesService.removeFavorite(cityName);
    if (result) {
      setFavorites((prev) => prev.filter((f) => f.city_name !== cityName));
    }
    return result;
  }

  async function checkIsFavorite(cityName: string) {
    if (!user) return false;
    return await favoritesService.isFavorite(cityName);
  }

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    checkIsFavorite,
    refetch: loadFavorites,
  };
}
