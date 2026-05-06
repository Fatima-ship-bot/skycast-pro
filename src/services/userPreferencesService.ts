// User Preferences Service
// Manage user settings and preferences

import { supabase } from "@/integrations/supabase/client";

export interface UserPreferences {
  id: string;
  user_id: string;
  temperature_unit: "celsius" | "fahrenheit";
  wind_unit: "ms" | "kmh" | "mph";
  pressure_unit: "hpa" | "mb" | "inHg";
  theme: "light" | "dark" | "system";
  notifications_enabled: boolean;
  alert_email: boolean;
  language: string;
  auto_detect_location: boolean;
  default_city?: string;
  hourly_updates: boolean;
  daily_updates: boolean;
  created_at: string;
  updated_at: string;
}

export async function getUserPreferences(): Promise<UserPreferences | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return null;

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", session.session.user.id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data as UserPreferences;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
}

export async function updateUserPreferences(
  updates: Partial<UserPreferences>
): Promise<UserPreferences | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("user_preferences")
      .update(updates)
      .eq("user_id", session.session.user.id)
      .select()
      .single();

    if (error) throw error;
    return data as UserPreferences;
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return null;
  }
}

export async function setTemperatureUnit(
  unit: "celsius" | "fahrenheit"
): Promise<boolean> {
  try {
    await updateUserPreferences({ temperature_unit: unit });
    return true;
  } catch (error) {
    console.error("Error setting temperature unit:", error);
    return false;
  }
}

export async function setTheme(theme: "light" | "dark" | "system"): Promise<boolean> {
  try {
    await updateUserPreferences({ theme });
    return true;
  } catch (error) {
    console.error("Error setting theme:", error);
    return false;
  }
}

export async function setNotifications(enabled: boolean): Promise<boolean> {
  try {
    await updateUserPreferences({ notifications_enabled: enabled });
    return true;
  } catch (error) {
    console.error("Error setting notifications:", error);
    return false;
  }
}

export async function setDefaultCity(city: string): Promise<boolean> {
  try {
    await updateUserPreferences({ default_city: city });
    return true;
  } catch (error) {
    console.error("Error setting default city:", error);
    return false;
  }
}
