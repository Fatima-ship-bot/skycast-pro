// Search History Service
// Track and manage user search history

import { supabase } from "@/integrations/supabase/client";

export interface SearchHistoryRecord {
  id: string;
  user_id?: string;
  query: string;
  city_name?: string;
  lat?: number;
  lon?: number;
  country_code?: string;
  result_count?: number;
  is_saved: boolean;
  created_at: string;
}

export async function recordSearch(
  query: string,
  cityName?: string,
  lat?: number,
  lon?: number,
  countryCode?: string,
  resultCount?: number
): Promise<SearchHistoryRecord | null> {
  try {
    const { data: session } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from("search_history")
      .insert({
        user_id: session.session?.user.id || null,
        query,
        city_name: cityName,
        lat,
        lon,
        country_code: countryCode,
        result_count: resultCount,
        is_saved: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as SearchHistoryRecord;
  } catch (error) {
    console.error("Error recording search:", error);
    return null;
  }
}

export async function getSearchHistory(limit = 20): Promise<SearchHistoryRecord[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return [];

    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .eq("user_id", session.session.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as SearchHistoryRecord[];
  } catch (error) {
    console.error("Error fetching search history:", error);
    return [];
  }
}

export async function getSavedSearches(): Promise<SearchHistoryRecord[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) return [];

    const { data, error } = await supabase
      .from("search_history")
      .select("*")
      .eq("user_id", session.session.user.id)
      .eq("is_saved", true)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data || []) as SearchHistoryRecord[];
  } catch (error) {
    console.error("Error fetching saved searches:", error);
    return [];
  }
}

export async function saveSearch(recordId: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("search_history")
      .update({ is_saved: true })
      .eq("id", recordId)
      .eq("user_id", session.session.user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving search:", error);
    return false;
  }
}

export async function clearSearchHistory(): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user.id) throw new Error("User not authenticated");

    const { error } = await supabase
      .from("search_history")
      .delete()
      .eq("user_id", session.session.user.id)
      .eq("is_saved", false);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error clearing search history:", error);
    return false;
  }
}
