import { buildMockWeather } from "./mockWeather";
import {
  isLiveMode,
  fetchCurrentByCity,
  fetchCurrentByCoords,
  fetchHourlyForecast,
  fetchAirQuality,
} from "./weatherApi";
import { weatherCache, getCacheKey } from "./cache";
import type { WeatherBundle } from "@/types/weather";

// Unified facade: returns a complete WeatherBundle from either live API or mock.
// Adds a small artificial delay for nicer skeleton UX.

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getWeatherByCity(city: string): Promise<WeatherBundle> {
  if (!city || !city.trim()) throw new Error("Please enter a city name");

  // Check cache first
  const cacheKey = getCacheKey("city", city.toLowerCase());
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  await delay(450);

  if (!isLiveMode()) {
    const data = buildMockWeather(city);
    // Cache for 10 minutes
    weatherCache.set(cacheKey, data, 600);
    return data;
  }

  // Live mode (kept simple — full normalization left as upgrade path)
  try {
    const cur = await fetchCurrentByCity(city);
    const fc = await fetchHourlyForecast(cur.coord.lat, cur.coord.lon);
    const aq = await fetchAirQuality(cur.coord.lat, cur.coord.lon);
    const normalized = normalize(cur, fc, aq);
    // Cache for 5 minutes for live data
    weatherCache.set(cacheKey, normalized, 300);
    return normalized;
  } catch (e) {
    throw new Error("City not found or network error");
  }
}

export async function getWeatherByCoords(lat: number, lon: number): Promise<WeatherBundle> {
  // Check cache first
  const cacheKey = getCacheKey("coords", lat, lon);
  const cached = weatherCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  await delay(450);

  if (!isLiveMode()) {
    const data = buildMockWeather("Karachi");
    weatherCache.set(cacheKey, data, 600);
    return data;
  }

  try {
    const cur = await fetchCurrentByCoords(lat, lon);
    const fc = await fetchHourlyForecast(lat, lon);
    const aq = await fetchAirQuality(lat, lon);
    const normalized = normalize(cur, fc, aq);
    weatherCache.set(cacheKey, normalized, 300);
    return normalized;
  } catch (e) {
    throw new Error("Location not found or network error");
  }
}

function normalize(cur: any, fc: any, aq: any): WeatherBundle {
  // Minimal normalization — real prod would map every field.
  const base = buildMockWeather(cur.name);
  return {
    ...base,
    current: {
      ...base.current,
      city: cur.name,
      country: cur.sys?.country ?? base.current.country,
      lat: cur.coord.lat,
      lon: cur.coord.lon,
      temp: Math.round(cur.main.temp),
      feelsLike: Math.round(cur.main.feels_like),
      humidity: cur.main.humidity,
      pressure: cur.main.pressure,
      windSpeed: cur.wind.speed,
      windDeg: cur.wind.deg,
      visibility: cur.visibility,
      sunrise: cur.sys.sunrise,
      sunset: cur.sys.sunset,
      condition: cur.weather?.[0] ?? base.current.condition,
    },
    airQuality: aq?.list?.[0]
      ? {
          aqi: aq.list[0].main.aqi,
          ...aq.list[0].components,
        }
      : base.airQuality,
  };
}
