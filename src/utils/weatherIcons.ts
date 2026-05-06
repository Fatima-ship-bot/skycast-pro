import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Cloudy, Sun, Moon, type LucideIcon } from "lucide-react";

export const getWeatherIcon = (main: string, isDay = true): LucideIcon => {
  const m = (main || "").toLowerCase();
  if (m.includes("thunder")) return CloudLightning;
  if (m.includes("drizzle")) return CloudDrizzle;
  if (m.includes("rain")) return CloudRain;
  if (m.includes("snow")) return CloudSnow;
  if (m.includes("mist") || m.includes("fog") || m.includes("haze")) return CloudFog;
  if (m.includes("cloud")) return m.includes("few") ? Cloud : Cloudy;
  if (m.includes("clear")) return isDay ? Sun : Moon;
  return Cloud;
};
