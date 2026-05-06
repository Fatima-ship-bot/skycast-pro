import { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  Bell,
  Cloud,
  Droplets,
  Zap,
  Wind,
  Eye,
  Thermometer,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { CurrentWeather } from "@/types/weather";

export type AlertType =
  | "uv"
  | "rain"
  | "wind"
  | "temp_extreme"
  | "visibility"
  | "storm";

export interface WeatherAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: "info" | "warning" | "danger";
  icon: React.ReactNode;
  timestamp: number;
}

interface Props {
  data: CurrentWeather;
  enabled: boolean;
}

const getAlerts = (data: CurrentWeather): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  const id = (type: AlertType) => `${type}-${data.city}`;

  // UV Index Alert
  if (data.uvIndex >= 8) {
    alerts.push({
      id: id("uv"),
      type: "uv",
      title: "High UV Index",
      message: `UV index ${data.uvIndex} - extreme. Apply sunscreen SPF 50+`,
      severity: "danger",
      icon: <Zap className="h-5 w-5" />,
      timestamp: Date.now(),
    });
  } else if (data.uvIndex >= 6) {
    alerts.push({
      id: id("uv"),
      type: "uv",
      title: "Strong UV Index",
      message: `UV index ${data.uvIndex} - strong. Use protection`,
      severity: "warning",
      icon: <Zap className="h-5 w-5" />,
      timestamp: Date.now(),
    });
  }

  // Rain Alert
  if (data.rainChance > 70) {
    alerts.push({
      id: id("rain"),
      type: "rain",
      title: "Heavy Rain Expected",
      message: `${data.rainChance}% chance of rain - carry an umbrella`,
      severity: "warning",
      icon: <Droplets className="h-5 w-5" />,
      timestamp: Date.now(),
    });
  }

  // Wind Alert
  if (data.windSpeed > 12) {
    alerts.push({
      id: id("wind"),
      type: "wind",
      title: "Strong Winds",
      message: `Wind speed ${data.windSpeed} m/s - exercise caution outdoors`,
      severity: "warning",
      icon: <Wind className="h-5 w-5" />,
      timestamp: Date.now(),
    });
  }

  // Temperature Alert
  if (data.temp > 38) {
    alerts.push({
      id: id("temp_extreme"),
      type: "temp_extreme",
      title: "Extreme Heat",
      message: `Temperature ${Math.round(data.temp)}°C - stay hydrated and limit sun exposure`,
      severity: "danger",
      icon: <Thermometer className="h-5 w-5" />,
      timestamp: Date.now(),
    });
  } else if (data.temp < -10) {
    alerts.push({
      id: id("temp_extreme"),
      type: "temp_extreme",
      title: "Extreme Cold",
      message: `Temperature ${Math.round(data.temp)}°C - frostbite risk, dress warmly`,
      severity: "danger",
      icon: <Thermometer className="h-5 w-5" />,
      timestamp: Date.now(),
    });
  }

  // Visibility Alert
  if (data.visibility < 1000) {
    alerts.push({
      id: id("visibility"),
      type: "visibility",
      title: "Low Visibility",
      message: `Visibility ${(data.visibility / 1000).toFixed(1)} km - drive carefully`,
      severity: "warning",
      icon: <Eye className="h-5 w-5" />,
      timestamp: Date.now(),
    });
  }

  return alerts;
};

export default function WeatherAlerts({ data, enabled }: Props) {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!enabled) {
      setAlerts([]);
      return;
    }

    const newAlerts = getAlerts(data);
    setAlerts(newAlerts);

    // Request notification permission
    if ("Notification" in window && Notification.permission === "granted") {
      newAlerts.forEach((alert) => {
        if (!dismissed.has(alert.id) && alert.severity !== "info") {
          new Notification(`SkyCast Alert: ${alert.title}`, {
            body: alert.message,
            icon: "/public/robots.txt",
            badge: "/public/robots.txt",
          });
        }
      });
    }
  }, [data, enabled, dismissed]);

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  const filteredAlerts = alerts.filter((a) => !dismissed.has(a.id));

  if (!enabled || filteredAlerts.length === 0) return null;

  const severityColors: Record<string, string> = {
    info: "bg-blue-500/10 border-blue-500/20 text-blue-600",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-600",
    danger: "bg-red-500/10 border-red-500/20 text-red-600",
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold flex items-center gap-2">
        <Bell className="h-4 w-4" />
        Active Alerts ({filteredAlerts.length})
      </h3>
      <AnimatePresence>
        {filteredAlerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: i * 0.05 }}
            className={`p-4 rounded-lg border flex items-start gap-3 ${
              severityColors[alert.severity]
            }`}
          >
            <div className="mt-0.5">{alert.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <p className="text-xs opacity-85 mt-1">{alert.message}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 shrink-0"
              onClick={() => dismiss(alert.id)}
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
