import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Trash2, ArrowRight } from "lucide-react";
import type { FavoriteCity } from "@/types/weather";
import { useWeather } from "@/hooks/useWeather";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { conditionGradient, fmtTemp } from "@/utils/format";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";

export default function FavoriteCityCard({ city, index = 0 }: { city: FavoriteCity; index?: number }) {
  const { data, loading } = useWeather(city.name);
  const { unit, removeFavorite } = useSettings();

  const Icon = data ? getWeatherIcon(data.current.condition.main) : MapPin;
  const gradient = data ? conditionGradient(data.current.condition.main) : "bg-gradient-sky";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`relative overflow-hidden rounded-2xl ${gradient} text-white shadow-card group`}
    >
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
      <div className="relative p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1 text-white/85 text-xs">
              <MapPin className="h-3 w-3" /> {city.country}
            </div>
            <h3 className="font-display text-xl font-bold mt-0.5">{city.name}</h3>
          </div>
          <Button onClick={() => removeFavorite(city.id)} size="icon" variant="ghost" className="h-8 w-8 rounded-full text-white/80 hover:bg-white/15 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            {loading ? (
              <div className="shimmer h-12 w-24 rounded-lg" />
            ) : data ? (
              <>
                <div className="font-display text-5xl font-bold leading-none">
                  {unit === "F" ? Math.round((data.current.temp * 9) / 5 + 32) : Math.round(data.current.temp)}°
                </div>
                <div className="text-sm text-white/80 capitalize mt-1">{data.current.condition.description}</div>
              </>
            ) : (
              <div className="text-sm text-white/80">—</div>
            )}
          </div>
          <Icon className="h-16 w-16 text-white/85" strokeWidth={1.3} />
        </div>

        <Link to={`/?city=${encodeURIComponent(city.name)}`} className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white/90 hover:text-white">
          View details <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}
