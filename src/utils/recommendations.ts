import type { WeatherBundle } from "@/types/weather";
import { Umbrella, Snowflake, Sun, Droplets, Wind, ShieldAlert, Glasses, Shirt, Flame, CloudRain, Eye, Activity } from "lucide-react";

export interface Recommendation {
  id: string;
  title: string;
  message: string;
  icon: any;
  severity: "info" | "warning" | "danger" | "success";
}

export function generateRecommendations(b: WeatherBundle): Recommendation[] {
  const recs: Recommendation[] = [];
  const { current, airQuality, hourly } = b;

  const rainSoon = hourly.slice(0, 8).some((h) => h.pop > 0.45);
  if (rainSoon || current.rainChance > 50 || /rain|drizzle/i.test(current.condition.main)) {
    recs.push({
      id: "umbrella",
      title: "Carry an Umbrella",
      message: "Rain is likely in the next few hours. Stay dry out there.",
      icon: Umbrella,
      severity: "info",
    });
  }

  if (current.temp <= 8) {
    recs.push({
      id: "warm",
      title: "Wear Warm Clothes",
      message: `It's ${Math.round(current.temp)}°C — layer up with a jacket and scarf.`,
      icon: Shirt,
      severity: "info",
    });
  }

  if (current.temp >= 32) {
    recs.push({
      id: "heat",
      title: "Stay Hydrated",
      message: "Heatwave conditions. Drink water frequently and avoid midday sun.",
      icon: Flame,
      severity: "danger",
    });
  }

  if (current.uvIndex >= 6) {
    recs.push({
      id: "uv",
      title: "Wear Sunglasses & SPF",
      message: `UV index is ${current.uvIndex} — protect your eyes and skin.`,
      icon: Glasses,
      severity: "warning",
    });
  }

  if (airQuality.aqi >= 4) {
    recs.push({
      id: "mask",
      title: "Wear a Mask Outdoors",
      message: "Air quality is poor today. Limit outdoor activity if sensitive.",
      icon: ShieldAlert,
      severity: "danger",
    });
  } else if (airQuality.aqi === 1) {
    recs.push({
      id: "fresh",
      title: "Great Day for a Walk",
      message: "Air quality is excellent — perfect for outdoor activities.",
      icon: Activity,
      severity: "success",
    });
  }

  if (current.windSpeed > 8) {
    recs.push({
      id: "wind",
      title: "Strong Winds Expected",
      message: `Wind at ${current.windSpeed} m/s — secure loose items outdoors.`,
      icon: Wind,
      severity: "warning",
    });
  }

  if (current.humidity > 80) {
    recs.push({
      id: "humid",
      title: "High Humidity",
      message: "Air feels heavy. Light, breathable clothing recommended.",
      icon: Droplets,
      severity: "info",
    });
  }

  if (current.visibility < 4000) {
    recs.push({
      id: "vis",
      title: "Low Visibility",
      message: "Drive carefully — visibility is reduced.",
      icon: Eye,
      severity: "warning",
    });
  }

  if (/snow/i.test(current.condition.main)) {
    recs.push({
      id: "snow",
      title: "Snow Conditions",
      message: "Wear waterproof boots and drive with caution.",
      icon: Snowflake,
      severity: "warning",
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: "ok",
      title: "Pleasant Conditions",
      message: "Weather looks great — enjoy your day!",
      icon: Sun,
      severity: "success",
    });
  }

  return recs;
}
