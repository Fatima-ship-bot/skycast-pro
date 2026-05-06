// Weather Alerts Component
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, X, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import * as alertsService from "@/services/weatherAlertsService";
import type { WeatherAlert } from "@/services/weatherAlertsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function WeatherAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    city_name: "",
    alert_type: "temperature" as const,
    severity: "medium" as const,
    threshold_value: "",
    operator: "greater_than" as const,
  });

  useEffect(() => {
    if (user) {
      loadAlerts();
    }
  }, [user]);

  async function loadAlerts() {
    setLoading(true);
    const data = await alertsService.getWeatherAlerts();
    setAlerts(data);
    setLoading(false);
  }

  async function handleCreateAlert() {
    if (!formData.city_name.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    const result = await alertsService.createWeatherAlert({
      alert_type: formData.alert_type,
      city_name: formData.city_name,
      lat: 0, // Would get from geocoding
      lon: 0,
      severity: formData.severity,
      threshold_value: formData.threshold_value ? parseFloat(formData.threshold_value) : undefined,
      operator: formData.operator,
      is_active: true,
    });

    if (result) {
      setAlerts([result, ...alerts]);
      setFormData({
        city_name: "",
        alert_type: "temperature",
        severity: "medium",
        threshold_value: "",
        operator: "greater_than",
      });
      setCreating(false);
      toast.success("Alert created successfully");
    } else {
      toast.error("Failed to create alert");
    }
  }

  async function handleDeleteAlert(alertId: string) {
    const success = await alertsService.deleteWeatherAlert(alertId);
    if (success) {
      setAlerts(alerts.filter((a) => a.id !== alertId));
      toast.success("Alert deleted");
    } else {
      toast.error("Failed to delete alert");
    }
  }

  async function toggleAlert(alertId: string, isActive: boolean) {
    const success = await alertsService.updateWeatherAlert(alertId, {
      is_active: !isActive,
    });
    if (success) {
      setAlerts(
        alerts.map((a) => (a.id === alertId ? { ...a, is_active: !isActive } : a))
      );
      toast.success(isActive ? "Alert paused" : "Alert activated");
    }
  }

  if (!user) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted-foreground">Sign in to create weather alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          <span className="gradient-text">Weather Alerts</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Get notified when weather conditions meet your criteria
        </p>
      </motion.div>

      {creating && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Create New Alert</h3>
            <button
              onClick={() => setCreating(false)}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>City</Label>
              <Input
                placeholder="Enter city name"
                value={formData.city_name}
                onChange={(e) =>
                  setFormData({ ...formData, city_name: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Alert Type</Label>
              <Select
                value={formData.alert_type}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, alert_type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="precipitation">Precipitation</SelectItem>
                  <SelectItem value="wind">Wind</SelectItem>
                  <SelectItem value="air_quality">Air Quality</SelectItem>
                  <SelectItem value="storm">Storm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Select
                value={formData.operator}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, operator: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                  <SelectItem value="equals">Equals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Threshold Value</Label>
              <Input
                type="number"
                placeholder="e.g., 25"
                value={formData.threshold_value}
                onChange={(e) =>
                  setFormData({ ...formData, threshold_value: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Severity</Label>
              <Select
                value={formData.severity}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, severity: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCreateAlert}
              className="bg-gradient-aurora text-white"
            >
              Create Alert
            </Button>
            <Button
              variant="outline"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </motion.div>
      )}

      {!creating && (
        <Button
          onClick={() => setCreating(true)}
          className="gap-2 bg-gradient-aurora text-white"
        >
          <Plus className="h-4 w-4" /> New Alert
        </Button>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading alerts...
            </div>
          ) : alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <Bell className="h-12 w-12 text-muted-foreground/30" />
              </div>
              <p className="text-muted-foreground">No alerts yet</p>
              <p className="text-sm text-muted-foreground/70">
                Create one to get notified about weather conditions
              </p>
            </motion.div>
          ) : (
            alerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-card p-4 flex items-center justify-between ${
                  !alert.is_active ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium">
                      {alert.city_name} - {alert.alert_type}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {alert.operator.replace("_", " ")} {alert.threshold_value}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAlert(alert.id, alert.is_active)}
                  >
                    {alert.is_active ? "Pause" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
