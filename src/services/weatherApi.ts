import axios from "axios";
import { checkRateLimit, recordRequest } from "./rateLimiter";
import { supabase } from "@/integrations/supabase/client";

// SkyCast Pro – Weather API service layer
// Pre-wired for OpenWeather API. Set VITE_OPENWEATHER_API_KEY in env to enable live data.
// Falls back to deterministic mock data so the dashboard is always populated.

const API_KEY = (import.meta as any).env?.VITE_OPENWEATHER_API_KEY ?? "";
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const weatherClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

export const isLiveMode = () => Boolean(API_KEY);

export const buildParams = (extra: Record<string, any> = {}) => ({
  appid: API_KEY,
  units: "metric",
  ...extra,
});

// Helper to check rate limits before API calls
async function checkAndRecordRequest(endpoint: string) {
  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user.id || null;

  const rateLimit = await checkRateLimit(userId, endpoint);
  if (!rateLimit.allowed) {
    throw new Error(
      `Rate limit exceeded for ${endpoint}. Try again in ${Math.ceil(
        (rateLimit.resetTime.getTime() - Date.now()) / 1000
      )} seconds`
    );
  }

  await recordRequest(userId, endpoint);
}

// ---- Live API endpoints (ready to use once API key is configured) ----

export async function fetchCurrentByCity(city: string) {
  await checkAndRecordRequest("/weather");
  const { data } = await weatherClient.get("/weather", {
    params: buildParams({ q: city }),
  });
  return data;
}

export async function fetchCurrentByCoords(lat: number, lon: number) {
  await checkAndRecordRequest("/weather");
  const { data } = await weatherClient.get("/weather", {
    params: buildParams({ lat, lon }),
  });
  return data;
}

export async function fetchHourlyForecast(lat: number, lon: number) {
  await checkAndRecordRequest("/forecast");
  const { data } = await weatherClient.get("/forecast", {
    params: buildParams({ lat, lon }),
  });
  return data;
}

export async function fetchWeeklyForecast(lat: number, lon: number) {
  await checkAndRecordRequest("/forecast");
  const { data } = await weatherClient.get("/forecast/daily", {
    params: buildParams({ lat, lon, cnt: 7 }),
  });
  return data;
}

export async function fetchAirQuality(lat: number, lon: number) {
  await checkAndRecordRequest("/air_pollution");
  const { data } = await axios.get(`${BASE_URL}/air_pollution`, {
    params: buildParams({ lat, lon }),
  });
  return data;
}

export async function geocodeCity(query: string) {
  await checkAndRecordRequest("/geocoding");
  const { data } = await axios.get(`${GEO_URL}/direct`, {
    params: { q: query, limit: 5, appid: API_KEY },
  });
  return data;
}
