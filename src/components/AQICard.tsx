import type { AirQuality } from "@/types/weather";
import { aqiLabel } from "@/utils/format";
import { Wind } from "lucide-react";
import { motion } from "framer-motion";

export default function AQICard({ data }: { data: AirQuality }) {
  const { label, color, bg } = aqiLabel(data.aqi);
  const pct = (data.aqi / 5) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Wind className="h-3.5 w-3.5" /> Air Quality</div>
          <div className="mt-1 font-display text-3xl font-bold">{label}</div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${color} ${bg}`}>
          AQI {data.aqi}
        </div>
      </div>

      <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-success via-warning to-destructive"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <Pollutant label="PM2.5" value={data.pm2_5} unit="µg" />
        <Pollutant label="PM10" value={data.pm10} unit="µg" />
        <Pollutant label="O₃" value={data.o3} unit="µg" />
        <Pollutant label="NO₂" value={data.no2} unit="µg" />
        <Pollutant label="SO₂" value={data.so2} unit="µg" />
        <Pollutant label="CO" value={data.co} unit="µg" />
      </div>
    </motion.div>
  );
}

function Pollutant({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="rounded-xl bg-muted/50 p-2">
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
      <div className="font-display font-semibold text-sm">{value} <span className="text-[10px] text-muted-foreground">{unit}</span></div>
    </div>
  );
}
