import type {
  WeatherBundle,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AirQuality,
  WeatherCondition,
} from "@/types/weather";

// Deterministic mock generator so the dashboard always has rich, realistic data
// for demos. Live data takes over automatically once VITE_OPENWEATHER_API_KEY is set.

const CONDITIONS: WeatherCondition[] = [
  { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
  { id: 801, main: "Clouds", description: "few clouds", icon: "02d" },
  { id: 803, main: "Clouds", description: "broken clouds", icon: "04d" },
  { id: 500, main: "Rain", description: "light rain", icon: "10d" },
  { id: 600, main: "Snow", description: "light snow", icon: "13d" },
  { id: 200, main: "Thunderstorm", description: "thunderstorm", icon: "11d" },
  { id: 701, main: "Mist", description: "mist", icon: "50d" },
];

// Simple seeded hash so each city produces stable but distinct mock data
const seed = (s: string) =>
  Array.from(s.toLowerCase()).reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

const rand = (s: number) => {
  let x = s;
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0;
    return x / 0xffffffff;
  };
};

export const KNOWN_CITIES: Array<{ name: string; country: string; lat: number; lon: number }> = [
  { name: "Karachi", country: "PK", lat: 24.86, lon: 67.01 },
  { name: "Lahore", country: "PK", lat: 31.55, lon: 74.34 },
  { name: "Islamabad", country: "PK", lat: 33.69, lon: 73.05 },
  { name: "London", country: "GB", lat: 51.51, lon: -0.13 },
  { name: "New York", country: "US", lat: 40.71, lon: -74.0 },
  { name: "Tokyo", country: "JP", lat: 35.68, lon: 139.69 },
  { name: "Dubai", country: "AE", lat: 25.27, lon: 55.3 },
  { name: "Paris", country: "FR", lat: 48.85, lon: 2.35 },
  { name: "Sydney", country: "AU", lat: -33.87, lon: 151.21 },
  { name: "Toronto", country: "CA", lat: 43.65, lon: -79.38 },
  { name: "Mumbai", country: "IN", lat: 19.08, lon: 72.88 },
  { name: "Singapore", country: "SG", lat: 1.35, lon: 103.82 },
  { name: "Berlin", country: "DE", lat: 52.52, lon: 13.4 },
  { name: "Cape Town", country: "ZA", lat: -33.92, lon: 18.42 },
];

export function findCity(name: string) {
  const n = name.trim().toLowerCase();
  return (
    KNOWN_CITIES.find((c) => c.name.toLowerCase() === n) ||
    KNOWN_CITIES.find((c) => c.name.toLowerCase().includes(n)) ||
    null
  );
}

export function buildMockWeather(cityName: string): WeatherBundle {
  const found = findCity(cityName);
  const city = found?.name ?? cityName;
  const country = found?.country ?? "—";
  const lat = found?.lat ?? 0;
  const lon = found?.lon ?? 0;
  const r = rand(seed(city));

  const baseTemp = Math.round(8 + r() * 28); // 8–36
  const condition = CONDITIONS[Math.floor(r() * CONDITIONS.length)];
  const humidity = Math.round(35 + r() * 55);
  const wind = +(2 + r() * 9).toFixed(1);
  const pressure = Math.round(1000 + r() * 25);
  const visibility = Math.round(6000 + r() * 4000);
  const uvIndex = Math.round(1 + r() * 10);
  const rainChance = Math.round(r() * 100);
  const cloudiness = Math.round(r() * 100);
  const now = Math.floor(Date.now() / 1000);

  const current: CurrentWeather = {
    city,
    country,
    lat,
    lon,
    temp: baseTemp,
    feelsLike: baseTemp + Math.round((r() - 0.5) * 4),
    tempMin: baseTemp - Math.round(2 + r() * 3),
    tempMax: baseTemp + Math.round(2 + r() * 4),
    humidity,
    pressure,
    visibility,
    windSpeed: wind,
    windDeg: Math.round(r() * 360),
    cloudiness,
    uvIndex,
    rainChance,
    sunrise: now - 3600 * 4,
    sunset: now + 3600 * 5,
    timezone: 0,
    dt: now,
    condition,
  };

  const hourly: HourlyForecast[] = Array.from({ length: 24 }).map((_, i) => {
    const variance = Math.sin((i / 24) * Math.PI * 2) * 5;
    return {
      dt: now + i * 3600,
      temp: Math.round(baseTemp + variance + (r() - 0.5) * 2),
      feelsLike: Math.round(baseTemp + variance),
      humidity: Math.max(20, Math.min(95, humidity + Math.round((r() - 0.5) * 15))),
      windSpeed: +(wind + (r() - 0.5) * 2).toFixed(1),
      pop: +(r() * 0.9).toFixed(2),
      condition: CONDITIONS[Math.floor(r() * CONDITIONS.length)],
    };
  });

  const daily: DailyForecast[] = Array.from({ length: 7 }).map((_, i) => {
    const dayBase = baseTemp + Math.round((r() - 0.5) * 6);
    return {
      dt: now + i * 86400,
      tempMin: dayBase - Math.round(2 + r() * 4),
      tempMax: dayBase + Math.round(2 + r() * 5),
      tempDay: dayBase + 2,
      tempNight: dayBase - 4,
      humidity: Math.max(20, Math.min(95, humidity + Math.round((r() - 0.5) * 20))),
      windSpeed: +(wind + (r() - 0.5) * 3).toFixed(1),
      pop: +(r() * 0.95).toFixed(2),
      uvi: Math.round(1 + r() * 10),
      condition: CONDITIONS[Math.floor(r() * CONDITIONS.length)],
    };
  });

  const airQuality: AirQuality = {
    aqi: (Math.floor(1 + r() * 5) as 1 | 2 | 3 | 4 | 5),
    co: +(200 + r() * 800).toFixed(1),
    no2: +(5 + r() * 60).toFixed(1),
    o3: +(20 + r() * 100).toFixed(1),
    pm2_5: +(5 + r() * 70).toFixed(1),
    pm10: +(10 + r() * 100).toFixed(1),
    so2: +(1 + r() * 30).toFixed(1),
  };

  return { current, hourly, daily, airQuality };
}
