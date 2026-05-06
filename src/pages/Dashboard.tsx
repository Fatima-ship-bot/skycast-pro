import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LocateFixed, Sparkles, BarChart3, Bell, X, Info } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import WeatherDetailsDialog from "@/components/WeatherDetailsDialog";
import WeatherAlerts from "@/components/WeatherAlerts";
import ExportWeatherDialog from "@/components/ExportWeatherDialog";
import AQICard from "@/components/AQICard";
import RecommendationCard from "@/components/RecommendationCard";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import { useWeather, useWeatherByCoords } from "@/hooks/useWeather";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useSettings } from "@/context/SettingsContext";
import { generateRecommendations } from "@/utils/recommendations";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const initialCity = params.get("city") || "Karachi";
  const [city, setCity] = useState(initialCity);
  const [alertOpen, setAlertOpen] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { pushRecent, notifications } = useSettings();
  const { coords, request, loading: geoLoading } = useGeolocation();
  const { data: cityData, loading, error } = useWeather(city);
  const { data: geoData } = useWeatherByCoords(coords);

  const data = geoData || cityData;

  useEffect(() => {
    if (city) pushRecent(city);
  }, [city, pushRecent]);

  const handleSearch = (q: string) => {
    setCity(q);
    setParams({ city: q });
  };

  const recs = data ? generateRecommendations(data).slice(0, 3) : [];
  const showAlert = notifications && data && data.current.uvIndex >= 8;

  return (
    <div className="container py-8 md:py-12 space-y-8">
      {/* Hero */}
      <section className="text-center space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="h-3 w-3" /> Real-time intelligent weather insights
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance"
        >
          Your Sky, <span className="gradient-text">Decoded.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-xl mx-auto text-balance"
        >
          Hyper-detailed forecasts, air quality analytics and AI-style recommendations for any city worldwide.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SearchBar onSearch={handleSearch} initial={initialCity} />
          <Button onClick={request} disabled={geoLoading} variant="ghost" size="sm" className="mt-3 gap-1.5">
            <LocateFixed className="h-4 w-4" />
            {geoLoading ? "Locating..." : "Use my location"}
          </Button>
        </motion.div>
      </section>

      {/* Weather alert */}
      {showAlert && alertOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4 flex items-center gap-3 border-l-4 border-warning"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/20 text-warning shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1 text-sm">
            <strong>Weather alert:</strong> Very high UV index detected ({data!.current.uvIndex}).
            Limit sun exposure between 11 AM and 4 PM.
          </div>
          <Button size="icon" variant="ghost" onClick={() => setAlertOpen(false)} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {loading && !data && <Loader />}
      {error && !data && <ErrorState message={error} onRetry={() => setCity(city)} />}

      {data && (
        <>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold">Weather Overview</h2>
            <Button
              onClick={() => setDetailsOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              View Details
            </Button>
          </div>
          <WeatherCard data={data.current} />
          
          <WeatherDetailsDialog
            open={detailsOpen}
            onOpenChange={setDetailsOpen}
            data={data.current}
          />

          <WeatherAlerts data={data.current} enabled={notifications} />

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">Actions</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              <ExportWeatherDialog data={data} />
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  navigator.share?.({
                    title: `Weather in ${data.current.city}`,
                    text: `Current: ${Math.round(data.current.temp)}°C, ${data.current.condition.description}`,
                  })
                }
              >
                Share
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl font-semibold">Today's smart insights</h3>
                  <Link to="/recommendations" className="text-xs text-primary hover:underline">View all →</Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {recs.map((r, i) => <RecommendationCard key={r.id} rec={r} index={i} />)}
                </div>
              </div>
            </div>
            <AQICard data={data.airQuality} />
          </div>

          <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Want deeper analytics?</h3>
              <p className="text-sm text-muted-foreground">Explore hourly trends, 7-day outlook and detailed charts.</p>
            </div>
            <Link to={`/forecast?city=${encodeURIComponent(data.current.city)}`}>
              <Button className="gap-2 bg-gradient-aurora text-white border-0 hover:opacity-90">
                <BarChart3 className="h-4 w-4" /> Open forecast details
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
