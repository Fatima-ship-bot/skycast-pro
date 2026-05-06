import { motion } from "framer-motion";
import { MapPin, Heart, Sunrise, Sunset, Wind, Droplets, Eye, Gauge } from "lucide-react";
import type { CurrentWeather } from "@/types/weather";
import { conditionGradient, fmtTemp, fmtTime, isDayTime, windDirection } from "@/utils/format";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";

export default function WeatherCard({ data }: { data: CurrentWeather }) {
  const { unit, addFavorite, removeFavorite, favorites } = useSettings();
  const isDay = isDayTime(data.dt, data.sunrise, data.sunset);
  const Icon = getWeatherIcon(data.condition.main, isDay);
  const gradient = conditionGradient(data.condition.main, isDay);

  const fav = favorites.find((f) => f.name.toLowerCase() === data.city.toLowerCase());
  const toggleFav = () => {
    if (fav) removeFavorite(fav.id);
    else addFavorite({ name: data.city, country: data.country, lat: data.lat, lon: data.lon });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl ${gradient} text-white shadow-elegant`}
    >
      {/* decorative orbs */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative p-6 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white/85 text-sm">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">{data.city}, {data.country}</span>
            </div>
            <p className="text-white/70 text-xs mt-1">{new Date(data.dt * 1000).toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</p>
          </div>
          <Button onClick={toggleFav} size="icon" variant="ghost" className="rounded-full text-white hover:bg-white/15">
            <Heart className={`h-5 w-5 ${fav ? "fill-white" : ""}`} />
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-between flex-wrap gap-6">
          <div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="flex items-baseline gap-2"
            >
              <span className="font-display text-7xl md:text-8xl font-bold tracking-tighter">
                {unit === "F" ? Math.round((data.temp * 9) / 5 + 32) : Math.round(data.temp)}°
              </span>
              <span className="text-2xl font-light">{unit === "F" ? "F" : "C"}</span>
            </motion.div>
            <p className="text-white/90 capitalize text-lg font-medium mt-1">{data.condition.description}</p>
            <p className="text-white/70 text-sm mt-0.5">Feels like {fmtTemp(data.feelsLike, unit)} · H {fmtTemp(data.tempMax, unit)} · L {fmtTemp(data.tempMin, unit)}</p>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
            <Icon className="relative h-32 w-32 md:h-40 md:w-40 drop-shadow-2xl" strokeWidth={1.2} />
          </motion.div>
        </div>

        {/* mini stats grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={Wind} label="Wind" value={`${data.windSpeed} m/s`} sub={windDirection(data.windDeg)} />
          <Stat icon={Droplets} label="Humidity" value={`${data.humidity}%`} />
          <Stat icon={Gauge} label="Pressure" value={`${data.pressure} hPa`} />
          <Stat icon={Eye} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
          <Stat icon={Sunrise} label="Sunrise" value={fmtTime(data.sunrise)} />
          <Stat icon={Sunset} label="Sunset" value={fmtTime(data.sunset)} />
          <Stat icon={Droplets} label="Rain chance" value={`${data.rainChance}%`} />
          <Stat icon={Gauge} label="UV Index" value={`${data.uvIndex}`} />
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 p-3">
      <div className="flex items-center gap-1.5 text-xs text-white/80">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-1 font-display font-semibold text-lg leading-none">{value}</div>
      {sub && <div className="text-[11px] text-white/70 mt-0.5">{sub}</div>}
    </div>
  );
}
