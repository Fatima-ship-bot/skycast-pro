// Hook to manage user preferences with database sync
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import * as preferencesService from "@/services/userPreferencesService";
import type { UserPreferences } from "@/services/userPreferencesService";

const DEFAULT_PREFERENCES: Partial<UserPreferences> = {
  temperature_unit: "celsius",
  wind_unit: "ms",
  theme: "system",
  notifications_enabled: true,
  language: "en",
  auto_detect_location: true,
  daily_updates: true,
};

export function usePreferencesSync() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    } else {
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
    }
  }, [user]);

  async function loadPreferences() {
    setLoading(true);
    const data = await preferencesService.getUserPreferences();
    if (data) {
      setPreferences(data);
    } else {
      setPreferences(DEFAULT_PREFERENCES);
    }
    setLoading(false);
  }

  async function updateTheme(theme: "light" | "dark" | "system") {
    const result = await preferencesService.setTheme(theme);
    if (result) {
      setPreferences((prev) => ({ ...prev, theme }));
    }
    return result;
  }

  async function updateTemperatureUnit(unit: "celsius" | "fahrenheit") {
    const result = await preferencesService.setTemperatureUnit(unit);
    if (result) {
      setPreferences((prev) => ({ ...prev, temperature_unit: unit }));
    }
    return result;
  }

  async function updateNotifications(enabled: boolean) {
    const result = await preferencesService.setNotifications(enabled);
    if (result) {
      setPreferences((prev) => ({ ...prev, notifications_enabled: enabled }));
    }
    return result;
  }

  async function updatePreferences(updates: Partial<UserPreferences>) {
    const result = await preferencesService.updateUserPreferences(updates);
    if (result) {
      setPreferences((prev) => ({ ...prev, ...updates }));
    }
    return result;
  }

  return {
    preferences,
    loading,
    updateTheme,
    updateTemperatureUnit,
    updateNotifications,
    updatePreferences,
    refetch: loadPreferences,
  };
}
