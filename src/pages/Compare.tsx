import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { getWeatherByCity } from "@/services/weatherService";
import type { WeatherBundle } from "@/types/weather";
import { ComparisonChart } from "@/components/charts/WeatherCharts";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { conditionGradient, fmtTemp, aqiLabel } from "@/utils/format";
import { useSettings } from "@/context/SettingsContext";

export default function Compare() {
  const { unit } = useSettings();
  const [cities, setCities] = useState<string[]>(["Karachi", "London", "Tokyo"]);
  const [data, setData] = useState<Record<string, WeatherBundle>>({});

  useEffect(() => {
    cities.forEach(async (c) => {
      if (data[c]) return;
      try {
        const d = await getWeatherByCity(c);
        setData((prev) => ({ ...prev, [c]: d }));
      } catch {}
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  const add = (c: string) => { if (!cities.includes(c) && cities.length < 5) setCities([...cities, c]); };
  const remove = (c: string) => setCities(cities.filter((x) => x !== c));

  const loaded = cities.map((c) => data[c]).filter(Boolean) as WeatherBundle[];

  return (
    <div className="container py-8 md:py-12 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          Compare <span className="gradient-text">Cities</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Stack any cities side-by-side and see weather, air, and atmosphere differences.</p>
        <SearchBar onSearch={add} size="md" />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cities.map((c, i) => {
          const d = data[c];
          if (!d) return (
            <div key={c} className="shimmer rounded-2xl h-56" />
          );
          const Icon = getWeatherIcon(d.current.condition.main);
          const aq = aqiLabel(d.airQuality.aqi);
          return (
            <motion.div key={c} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`relative overflow-hidden rounded-2xl ${conditionGradient(d.current.condition.main)} text-white p-5 shadow-card`}>
              <button onClick={() => remove(c)} className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
              <h3 className="font-display text-xl font-bold">{d.current.city}</h3>
              <div className="text-xs text-white/75">{d.current.country}</div>
              <div className="mt-4 flex items-center justify-between">
                <span className="font-display text-5xl font-bold">{unit === "F" ? Math.round(d.current.temp * 9/5 + 32) : Math.round(d.current.temp)}°</span>
                <Icon className="h-14 w-14" strokeWidth={1.3} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/15 p-2">Humidity<br/><span className="font-semibold text-sm">{d.current.humidity}%</span></div>
                <div className="rounded-lg bg-white/15 p-2">Wind<br/><span className="font-semibold text-sm">{d.current.windSpeed} m/s</span></div>
                <div className="rounded-lg bg-white/15 p-2">UV<br/><span className="font-semibold text-sm">{d.current.uvIndex}</span></div>
                <div className="rounded-lg bg-white/15 p-2">AQI<br/><span className="font-semibold text-sm">{aq.label}</span></div>
              </div>
            </motion.div>
          );
        })}
        {cities.length < 5 && (
          <button onClick={() => {}} className="rounded-2xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center min-h-[14rem] text-muted-foreground hover:text-primary transition-colors">
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <span className="text-sm">Search above to add</span>
            </div>
          </button>
        )}
      </div>

      {loaded.length >= 2 && (
        <div className="grid lg:grid-cols-2 gap-6">
          <ComparisonChart label="Temperature (°C)" metric="Temperature" unit="°"
            cities={loaded.map((d) => ({ name: d.current.city, value: Math.round(d.current.temp) }))} />
          <ComparisonChart label="Humidity (%)" metric="Humidity" unit="%"
            cities={loaded.map((d) => ({ name: d.current.city, value: d.current.humidity }))} />
          <ComparisonChart label="Wind speed (m/s)" metric="Wind"
            cities={loaded.map((d) => ({ name: d.current.city, value: d.current.windSpeed }))} />
          <ComparisonChart label="Air Quality Index" metric="AQI"
            cities={loaded.map((d) => ({ name: d.current.city, value: d.airQuality.aqi }))} />
        </div>
      )}
    </div>
  );
}
