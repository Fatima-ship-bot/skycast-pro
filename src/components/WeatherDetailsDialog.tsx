import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { CurrentWeather } from "@/types/weather";
import { fmtTemp, windDirection } from "@/utils/format";
import { useSettings } from "@/context/SettingsContext";
import { Cloud, Droplets, Eye, Gauge, Wind, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CurrentWeather;
}

export default function WeatherDetailsDialog({ open, onOpenChange, data }: Props) {
  const { unit } = useSettings();

  // Calculate health scores for weather metrics
  const getHealthScore = (label: string, value: number) => {
    const scores: Record<string, [number, string, string]> = {
      "UV Index": [value > 8 ? 30 : value > 5 ? 60 : 90, "⚠️", "!text-destructive"],
      "Humidity": [value > 70 ? 60 : value < 30 ? 60 : 90, "✓", "text-success"],
      "Visibility": [value < 3000 ? 60 : 90, "✓", "text-success"],
      "Air Pressure": [Math.abs(value - 1013) > 50 ? 60 : 90, "✓", "text-success"],
    };
    return scores[label] || [60, "◐", "text-warning"];
  };

  const details = [
    { label: "Feels Like", value: fmtTemp(data.feelsLike, unit), icon: "🌡️" },
    { label: "Min / Max", value: `${fmtTemp(data.tempMin, unit)} / ${fmtTemp(data.tempMax, unit)}`, icon: "📊" },
    { label: "Humidity", value: `${data.humidity}%`, icon: "💧" },
    { label: "Pressure", value: `${data.pressure} hPa`, icon: "📈" },
    { label: "Visibility", value: `${(data.visibility / 1000).toFixed(1)} km`, icon: "👁️" },
    { label: "UV Index", value: `${data.uvIndex}`, icon: "☀️" },
    { label: "Wind", value: `${data.windSpeed} m/s ${windDirection(data.windDeg)}`, icon: "💨" },
    { label: "Cloudiness", value: `${data.cloudiness}%`, icon: "☁️" },
    { label: "Rain Chance", value: `${data.rainChance}%`, icon: "🌧️" },
  ];

  const getWarning = (data: CurrentWeather) => {
    if (data.uvIndex >= 8) return "High UV Index: Use sunscreen and seek shade";
    if (data.humidity >= 80) return "High humidity: Stay hydrated";
    if (data.visibility < 1000) return "Low visibility: Drive carefully";
    if (data.windSpeed > 10) return "Strong winds: Be cautious outdoors";
    if (data.rainChance > 60) return "High rain chance: Bring an umbrella";
    return null;
  };

  const warning = getWarning(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Detailed Weather for {data.city}, {data.country}
          </DialogTitle>
        </DialogHeader>

        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30"
          >
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <p className="text-sm text-warning">{warning}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {details.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-card/60 border border-border hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-lg">{item.icon}</span>
              </div>
              <p className="text-lg font-semibold">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-3">Health Metrics</h3>
          <div className="space-y-2">
            {[
              { label: "UV Index", value: data.uvIndex },
              { label: "Humidity", value: data.humidity },
              { label: "Visibility", value: data.visibility },
              { label: "Air Pressure", value: data.pressure },
            ].map(({ label, value }) => {
              const [score, icon, color] = getHealthScore(label, value);
              return (
                <div key={label} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium w-32">{label}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className={`h-full ${color} transition-all`}
                    />
                  </div>
                  <span className="text-sm font-semibold">{score}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
