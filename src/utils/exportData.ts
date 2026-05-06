import type { WeatherBundle } from "@/types/weather";

export interface ExportOptions {
  includeHourly: boolean;
  includeDaily: boolean;
  includeAirQuality: boolean;
  format: "json" | "csv";
}

export const exportWeatherData = (data: WeatherBundle, options: ExportOptions) => {
  if (options.format === "json") {
    return exportAsJSON(data, options);
  } else {
    return exportAsCSV(data, options);
  }
};

const exportAsJSON = (data: WeatherBundle, options: ExportOptions) => {
  const exported: any = {
    exportedAt: new Date().toISOString(),
    current: data.current,
  };

  if (options.includeHourly) {
    exported.hourly = data.hourly;
  }

  if (options.includeDaily) {
    exported.daily = data.daily;
  }

  if (options.includeAirQuality) {
    exported.airQuality = data.airQuality;
  }

  return JSON.stringify(exported, null, 2);
};

const exportAsCSV = (data: WeatherBundle, options: ExportOptions) => {
  const rows: string[] = [];

  // Header
  rows.push(
    `Weather Export - ${data.current.city}, ${data.current.country}`
  );
  rows.push(`Exported: ${new Date().toISOString()}`);
  rows.push("");

  // Current Weather
  rows.push("=== CURRENT WEATHER ===");
  rows.push(
    `Temperature,${data.current.temp}°C
Feels Like,${data.current.feelsLike}°C
Min/Max,${data.current.tempMin}°C / ${data.current.tempMax}°C
Condition,${data.current.condition.main} - ${data.current.condition.description}
Humidity,${data.current.humidity}%
Pressure,${data.current.pressure} hPa
Wind Speed,${data.current.windSpeed} m/s
Visibility,${(data.current.visibility / 1000).toFixed(1)} km
UV Index,${data.current.uvIndex}
Rain Chance,${data.current.rainChance}%
Cloudiness,${data.current.cloudiness}%`
  );

  rows.push("");

  // Hourly Forecast
  if (options.includeHourly && data.hourly.length > 0) {
    rows.push("=== HOURLY FORECAST ===");
    rows.push(
      "Time,Temperature,Feels Like,Condition,Humidity,Wind Speed,Rain Chance"
    );
    data.hourly.forEach((h) => {
      rows.push(
        `${new Date(h.dt * 1000).toLocaleString()},${h.temp}°C,${h.feelsLike}°C,${h.condition.main},${h.humidity}%,${h.windSpeed} m/s,${Math.round(h.pop * 100)}%`
      );
    });
    rows.push("");
  }

  // Daily Forecast
  if (options.includeDaily && data.daily.length > 0) {
    rows.push("=== DAILY FORECAST ===");
    rows.push(
      "Date,Min Temp,Max Temp,Condition,Humidity,Wind Speed,Rain Chance"
    );
    data.daily.forEach((d) => {
      rows.push(
        `${new Date(d.dt * 1000).toLocaleDateString()},${d.tempMin}°C,${d.tempMax}°C,${d.condition.main},${d.humidity}%,${d.windSpeed} m/s,${Math.round(d.pop * 100)}%`
      );
    });
    rows.push("");
  }

  // Air Quality
  if (options.includeAirQuality) {
    rows.push("=== AIR QUALITY ===");
    rows.push(
      `AQI,${data.airQuality.aqi}
AQI Label,${getAQILabel(data.airQuality.aqi)}
PM2.5,${data.airQuality.pm2_5} µg/m³
PM10,${data.airQuality.pm10} µg/m³
O3,${data.airQuality.o3} µg/m³`
    );
  }

  return rows.join("\n");
};

const getAQILabel = (aqi: number) => {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Fair";
  if (aqi <= 150) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Severe";
};

export const downloadFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
