import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { FavoriteCity } from "@/types/weather";

type Theme = "light" | "dark";
type Unit = "C" | "F";

interface SettingsState {
  theme: Theme;
  unit: Unit;
  notifications: boolean;
  favorites: FavoriteCity[];
  recentSearches: string[];
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  setUnit: (u: Unit) => void;
  setNotifications: (v: boolean) => void;
  addFavorite: (c: Omit<FavoriteCity, "id" | "addedAt">) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (name: string) => boolean;
  pushRecent: (city: string) => void;
  clearRecent: () => void;
}

const SettingsCtx = createContext<SettingsState | null>(null);

const KEY = "skycast.settings.v1";
const FAV_KEY = "skycast.favorites.v1";
const REC_KEY = "skycast.recents.v1";

const load = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const initial = load(KEY, { theme: "dark" as Theme, unit: "C" as Unit, notifications: true });
  const [theme, setThemeState] = useState<Theme>(initial.theme);
  const [unit, setUnitState] = useState<Unit>(initial.unit);
  const [notifications, setNotificationsState] = useState<boolean>(initial.notifications);
  const [favorites, setFavorites] = useState<FavoriteCity[]>(load(FAV_KEY, []));
  const [recentSearches, setRecentSearches] = useState<string[]>(load(REC_KEY, []));

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(KEY, JSON.stringify({ theme, unit, notifications }));
  }, [theme, unit, notifications]);

  useEffect(() => { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(REC_KEY, JSON.stringify(recentSearches)); }, [recentSearches]);

  const toggleTheme = useCallback(() => setThemeState((t) => (t === "dark" ? "light" : "dark")), []);
  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const setUnit = useCallback((u: Unit) => setUnitState(u), []);
  const setNotifications = useCallback((v: boolean) => setNotificationsState(v), []);

  const addFavorite = useCallback((c: Omit<FavoriteCity, "id" | "addedAt">) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.name.toLowerCase() === c.name.toLowerCase())) return prev;
      return [...prev, { ...c, id: `${c.name}-${Date.now()}`, addedAt: Date.now() }];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const isFavorite = useCallback(
    (name: string) => favorites.some((f) => f.name.toLowerCase() === name.toLowerCase()),
    [favorites],
  );

  const pushRecent = useCallback((city: string) => {
    if (!city.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      return [city, ...filtered].slice(0, 8);
    });
  }, []);

  const clearRecent = useCallback(() => setRecentSearches([]), []);

  return (
    <SettingsCtx.Provider
      value={{
        theme, unit, notifications, favorites, recentSearches,
        toggleTheme, setTheme, setUnit, setNotifications,
        addFavorite, removeFavorite, isFavorite, pushRecent, clearRecent,
      }}
    >
      {children}
    </SettingsCtx.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error("useSettings must be inside SettingsProvider");
  return ctx;
};
