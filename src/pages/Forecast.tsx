import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import ForecastFilter from "@/components/ForecastFilter";
import { useWeather } from "@/hooks/useWeather";
import { HourlyForecastList, DailyForecastList } from "@/components/ForecastCard";
import { TempChart, HumidityChart, WindChart, PrecipitationChart } from "@/components/charts/WeatherCharts";
import { motion } from "framer-motion";

interface FilterOptions {
  tempRange: [number, number];
  showRain: boolean;
  showWind: boolean;
  maxWind: number;
}

export default function Forecast() {
  const [params, setParams] = useSearchParams();
  const [city, setCity] = useState(params.get("city") || "Karachi");
  const [filters, setFilters] = useState<FilterOptions>({
    tempRange: [-50, 50],
    showRain: true,
    showWind: true,
    maxWind: 50,
  });
  const { data, loading, error } = useWeather(city);

  const filteredHourly = data?.hourly.filter((h) => {
    const inTemp = h.temp >= filters.tempRange[0] && h.temp <= filters.tempRange[1];
    const inWind = h.windSpeed <= filters.maxWind;
    const notRainy = !filters.showRain || h.pop < 0.5;
    const notWindy = !filters.showWind || h.windSpeed < 10;
    return inTemp && inWind && notRainy && notWindy;
  }) || [];

  return (
    <div className="container py-8 md:py-12 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          Forecast <span className="gradient-text">Analytics</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Hourly trends, 7-day outlook, and atmospheric metrics — visualized.</p>
        <SearchBar onSearch={(c) => { setCity(c); setParams({ city: c }); }} initial={city} size="md" />
      </motion.div>

      {loading && <Loader />}
      {error && <ErrorState message={error} onRetry={() => setCity(city)} />}

      {data && (
        <>
          <div className="flex justify-end">
            <ForecastFilter filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2"><HourlyForecastList data={filteredHourly} /></div>
            <DailyForecastList data={data.daily} />
            <TempChart data={filteredHourly} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <HumidityChart data={filteredHourly} />
            <WindChart data={filteredHourly} />
          </div>

          <PrecipitationChart data={filteredHourly} />
        </>
      )}
    </div>
  );
}
