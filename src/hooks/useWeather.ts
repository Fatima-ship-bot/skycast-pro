import { useEffect, useState } from "react";
import { getWeatherByCity, getWeatherByCoords } from "@/services/weatherService";
import type { WeatherBundle } from "@/types/weather";

interface State {
  data: WeatherBundle | null;
  loading: boolean;
  error: string | null;
}

export function useWeather(city: string | null) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!city) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    getWeatherByCity(city)
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((e) => { if (!cancelled) setState({ data: null, loading: false, error: e.message || "Failed to fetch" }); });
    return () => { cancelled = true; };
  }, [city]);

  return state;
}

export function useWeatherByCoords(coords: { lat: number; lon: number } | null) {
  const [state, setState] = useState<State>({ data: null, loading: false, error: null });
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    getWeatherByCoords(coords.lat, coords.lon)
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((e) => { if (!cancelled) setState({ data: null, loading: false, error: e.message }); });
    return () => { cancelled = true; };
  }, [coords?.lat, coords?.lon]);
  return state;
}
