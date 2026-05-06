// Utility helpers for SkyCast Pro

export const fmtTemp = (t: number, unit: "C" | "F" = "C") =>
  unit === "F" ? `${Math.round((t * 9) / 5 + 32)}°F` : `${Math.round(t)}°C`;

export const cToF = (c: number) => (c * 9) / 5 + 32;

export const fmtTime = (unix: number, tz?: number) => {
  const d = new Date(unix * 1000);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const fmtHour = (unix: number) => {
  const d = new Date(unix * 1000);
  return d.toLocaleTimeString([], { hour: "numeric" });
};

export const fmtDay = (unix: number) =>
  new Date(unix * 1000).toLocaleDateString([], { weekday: "short" });

export const fmtFullDate = (unix: number) =>
  new Date(unix * 1000).toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

export const windDirection = (deg: number) => {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

export const aqiLabel = (aqi: number) => {
  switch (aqi) {
    case 1: return { label: "Good", color: "text-success", bg: "bg-success/15" };
    case 2: return { label: "Fair", color: "text-info", bg: "bg-info/15" };
    case 3: return { label: "Moderate", color: "text-warning", bg: "bg-warning/15" };
    case 4: return { label: "Poor", color: "text-accent", bg: "bg-accent/15" };
    case 5: return { label: "Very Poor", color: "text-destructive", bg: "bg-destructive/15" };
    default: return { label: "—", color: "text-muted-foreground", bg: "bg-muted" };
  }
};

export const uvLabel = (uv: number) => {
  if (uv <= 2) return { label: "Low", color: "text-success" };
  if (uv <= 5) return { label: "Moderate", color: "text-warning" };
  if (uv <= 7) return { label: "High", color: "text-accent" };
  if (uv <= 10) return { label: "Very High", color: "text-destructive" };
  return { label: "Extreme", color: "text-destructive" };
};

export const isDayTime = (dt: number, sunrise: number, sunset: number) =>
  dt >= sunrise && dt <= sunset;

export const conditionGradient = (main: string, isDay = true) => {
  const m = main.toLowerCase();
  if (!isDay) return "bg-gradient-night";
  if (m.includes("clear")) return "bg-gradient-day";
  if (m.includes("cloud")) return "bg-gradient-sky";
  if (m.includes("rain") || m.includes("drizzle")) return "bg-gradient-rain";
  if (m.includes("snow")) return "bg-gradient-snow";
  if (m.includes("thunder") || m.includes("storm")) return "bg-gradient-storm";
  if (m.includes("mist") || m.includes("fog") || m.includes("haze")) return "bg-gradient-sky";
  return "bg-gradient-sky";
};
