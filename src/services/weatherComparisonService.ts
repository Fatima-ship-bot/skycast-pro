// Weather Comparison Service
// Manage weather comparisons for multiple cities

import { supabase } from "@/integrations/supabase/client";

export interface WeatherComparison {
  id: string;
  user_id?: string;
  comparison_name: string;
  cities: string[];
  lat_lon_pairs: [number, number][];
  created_at: string;
  updated_at: string;
  is_favorite: boolean;
}

export async function createComparison(
  comparisonName: string,
  cities: string[],
  latLonPairs: [number, number][]
): Promise<WeatherComparison | null> {
  try {
    const { data: session } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("weather_comparisons")
      .insert({
        user_id: session.session?.user.id || null,
        comparison_name: comparisonName,
        cities,
        lat_lon_pairs: latLonPairs,
      })
      .select()
      .single();

    if (error) throw error;
    return data as WeatherComparison;
  } catch (error) {
    console.error("Error creating comparison:", error);
    return null;
  }
}

export async function getComparisons(): Promise<WeatherComparison[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return [];

    const { data, error } = await supabase
      .from("weather_comparisons")
      .select("*")
      .eq("user_id", session.session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as WeatherComparison[];
  } catch (error) {
    console.error("Error fetching comparisons:", error);
    return [];
  }
}

export async function updateComparison(
  comparisonId: string,
  updates: Partial<WeatherComparison>
): Promise<WeatherComparison | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("weather_comparisons")
      .update(updates)
      .eq("id", comparisonId)
      .eq("user_id", session.session.user.id)
      .select()
      .single();

    if (error) throw error;
    return data as WeatherComparison;
  } catch (error) {
    console.error("Error updating comparison:", error);
    return null;
  }
}

export async function deleteComparison(comparisonId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("weather_comparisons")
      .delete()
      .eq("id", comparisonId)
      .eq("user_id", session.session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting comparison:", error);
    return false;
  }
}

export async function favoriteComparison(comparisonId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("weather_comparisons")
      .update({ is_favorite: true })
      .eq("id", comparisonId)
      .eq("user_id", session.session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error favoriting comparison:", error);
    return false;
  }
}
