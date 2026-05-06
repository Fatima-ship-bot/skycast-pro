import type { HourlyForecast, DailyForecast } from "@/types/weather";
import { fmtDay, fmtHour, fmtTemp } from "@/utils/format";
import { getWeatherIcon } from "@/utils/weatherIcons";
import { useSettings } from "@/context/SettingsContext";
import { Droplets } from "lucide-react";
import { motion } from "framer-motion";

interface HourlyProps { data: HourlyForecast[] }
export function HourlyForecastList({ data }: HourlyProps) {
  const { unit } = useSettings();
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-4">Next 24 hours</h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {data.map((h, i) => {
          const Icon = getWeatherIcon(h.condition.main);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="shrink-0 w-20 rounded-2xl bg-card/60 border border-border p-3 text-center hover:bg-primary/10 transition-colors"
            >
              <div className="text-xs text-muted-foreground font-medium">{i === 0 ? "Now" : fmtHour(h.dt)}</div>
              <Icon className="h-7 w-7 mx-auto my-2 text-primary" />
              <div className="font-display font-semibold">{fmtTemp(h.temp, unit)}</div>
              <div className="text-[10px] text-info mt-1 flex items-center justify-center gap-0.5">
                <Droplets className="h-2.5 w-2.5" /> {Math.round(h.pop * 100)}%
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

interface DailyProps { data: DailyForecast[] }
export function DailyForecastList({ data }: DailyProps) {
  const { unit } = useSettings();
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-4">7-day forecast</h3>
      <div className="space-y-2">
        {data.map((d, i) => {
          const Icon = getWeatherIcon(d.condition.main);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[60px_40px_1fr_120px] items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-primary/8 transition-colors"
            >
              <span className="font-medium text-sm">{i === 0 ? "Today" : fmtDay(d.dt)}</span>
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-sm capitalize text-muted-foreground truncate">{d.condition.description}</span>
              <div className="flex items-center justify-end gap-2 text-sm">
                <span className="text-muted-foreground">{fmtTemp(d.tempMin, unit)}</span>
                <div className="relative h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                  <div className="absolute inset-y-0 bg-gradient-to-r from-info via-warning to-accent rounded-full" style={{ left: "10%", right: "10%" }} />
                </div>
                <span className="font-semibold">{fmtTemp(d.tempMax, unit)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
