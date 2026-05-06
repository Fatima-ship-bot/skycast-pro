import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import type { HourlyForecast } from "@/types/weather";
import { fmtHour } from "@/utils/format";

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
    fontSize: "12px",
  },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function TempChart({ data }: { data: HourlyForecast[] }) {
  const chartData = data.map((h) => ({ time: fmtHour(h.dt), temp: Math.round(h.temp), feels: Math.round(h.feelsLike) }));
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-3">Temperature variation (24h)</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={2} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="°" />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#tg)" name="Temp" />
            <Line type="monotone" dataKey="feels" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Feels like" />
            <Legend />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HumidityChart({ data }: { data: HourlyForecast[] }) {
  const chartData = data.map((h) => ({ time: fmtHour(h.dt), humidity: h.humidity }));
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-3">Humidity (24h)</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity={0.5} />
                <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={2} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="humidity" stroke="hsl(var(--info))" strokeWidth={2.5} fill="url(#hg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function WindChart({ data }: { data: HourlyForecast[] }) {
  const chartData = data.map((h) => ({ time: fmtHour(h.dt), wind: h.windSpeed }));
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-3">Wind speed (24h)</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={2} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit=" m/s" />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="wind" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ r: 3, fill: "hsl(var(--accent))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function PrecipitationChart({ data }: { data: HourlyForecast[] }) {
  const chartData = data.map((h) => ({ time: fmtHour(h.dt), pop: Math.round(h.pop * 100) }));
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-3">Precipitation chance (24h)</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={2} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="pop" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ComparisonChart({ cities, metric, label, unit = "" }: { cities: { name: string; value: number }[]; metric: string; label: string; unit?: string }) {
  return (
    <div className="glass-card p-5">
      <h3 className="font-display font-semibold mb-3">{label}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cities} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} unit={unit} />
            <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
            <Tooltip {...tooltipStyle} />
            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} name={metric} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
