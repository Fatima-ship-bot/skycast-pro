// Favorites Service
// Manage user's favorite cities

import { supabase } from "@/integrations/supabase/client";

export interface FavoriteCity {
  id: string;
  user_id: string;
  city_name: string;
  lat: number;
  lon: number;
  country_code?: string;
  created_at: string;
}

export async function addFavorite(
  cityName: string,
  lat: number,
  lon: number,
  countryCode?: string
): Promise<FavoriteCity | null> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from("favorite_cities")
      .insert({
        user_id: session.session.user.id,
        city_name: cityName,
        lat,
        lon,
        country_code: countryCode,
      })
      .select()
      .single();

    if (error) throw error;
    return data as FavoriteCity;
  } catch (error) {
    console.error("Error adding favorite:", error);
    return null;
  }
}

export async function removeFavorite(cityName: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("favorite_cities")
      .delete()
      .eq("user_id", session.session.user.id)
      .eq("city_name", cityName);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
}

export async function getFavorites(): Promise<FavoriteCity[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return [];

    const { data, error } = await supabase
      .from("favorite_cities")
      .select("*")
      .eq("user_id", session.session.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as FavoriteCity[];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
}

export async function isFavorite(cityName: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return false;

    const { data, error } = await supabase
      .from("favorite_cities")
      .select("id")
      .eq("user_id", session.session.user.id)
      .eq("city_name", cityName)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
}
