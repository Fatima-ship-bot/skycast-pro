// Weather Alerts Service
// Manage user weather alerts and notifications

import { supabase } from "@/integrations/supabase/client";

export interface WeatherAlert {
  id: string;
  user_id: string;
  alert_type: "temperature" | "precipitation" | "wind" | "air_quality" | "storm";
  city_name: string;
  lat: number;
  lon: number;
  severity: "low" | "medium" | "high";
  threshold_value?: number;
  operator?: "greater_than" | "less_than" | "equals";
  is_active: boolean;
  created_at: string;
  triggered_at?: string;
}

export async function createWeatherAlert(
  alert: Omit<WeatherAlert, "id" | "user_id" | "created_at">
): Promise<WeatherAlert | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("weather_alerts")
      .insert({
        ...alert,
        user_id: session.session.user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as WeatherAlert;
  } catch (error) {
    console.error("Error creating weather alert:", error);
    return null;
  }
}

export async function getWeatherAlerts(): Promise<WeatherAlert[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return [];

    const { data, error } = await supabase
      .from("weather_alerts")
      .select("*")
      .eq("user_id", session.session.user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as WeatherAlert[];
  } catch (error) {
    console.error("Error fetching weather alerts:", error);
    return [];
  }
}

export async function updateWeatherAlert(
  alertId: string,
  updates: Partial<WeatherAlert>
): Promise<WeatherAlert | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("weather_alerts")
      .update(updates)
      .eq("id", alertId)
      .eq("user_id", session.session.user.id)
      .select()
      .single();

    if (error) throw error;
    return data as WeatherAlert;
  } catch (error) {
    console.error("Error updating weather alert:", error);
    return null;
  }
}

export async function deleteWeatherAlert(alertId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("weather_alerts")
      .delete()
      .eq("id", alertId)
      .eq("user_id", session.session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting weather alert:", error);
    return false;
  }
}

export async function deactivateWeatherAlert(alertId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("weather_alerts")
      .update({ is_active: false })
      .eq("id", alertId)
      .eq("user_id", session.session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deactivating weather alert:", error);
    return false;
  }
}
