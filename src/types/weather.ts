// Core weather domain types for SkyCast Pro
export interface WeatherCondition {
  id: number;
  main: string; // Clear, Clouds, Rain, Snow, Thunderstorm, Drizzle, Mist
  description: string;
  icon: string;
}

export interface CurrentWeather {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  visibility: number; // meters
  windSpeed: number; // m/s
  windDeg: number;
  cloudiness: number;
  uvIndex: number;
  rainChance: number; // %
  sunrise: number; // unix
  sunset: number; // unix
  timezone: number;
  dt: number;
  condition: WeatherCondition;
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pop: number; // probability of precipitation 0-1
  condition: WeatherCondition;
}

export interface DailyForecast {
  dt: number;
  tempMin: number;
  tempMax: number;
  tempDay: number;
  tempNight: number;
  humidity: number;
  windSpeed: number;
  pop: number;
  uvi: number;
  condition: WeatherCondition;
}

export interface AirQuality {
  aqi: 1 | 2 | 3 | 4 | 5; // 1 good - 5 very poor
  co: number;
  no2: number;
  o3: number;
  pm2_5: number;
  pm10: number;
  so2: number;
}

export interface WeatherBundle {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality: AirQuality;
}

export interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  addedAt: number;
}
