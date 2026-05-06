import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Sun, Moon, Thermometer, Bell, Trash2, User as UserIcon, LogOut, LogIn, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Settings() {
  const { theme, setTheme, unit, setUnit, notifications, setNotifications, clearRecent, recentSearches, favorites } = useSettings();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const nav = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { setDisplayName(profile?.display_name || ""); }, [profile]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles")
      .update({ display_name: displayName.trim().slice(0, 80) })
      .eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    toast.success("Profile updated");
  };

  return (
    <div className="container py-8 md:py-12 max-w-3xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-muted-foreground mt-2">Customize how SkyCast Pro looks and behaves. Saved automatically.</p>
      </motion.div>

      <Section title="Account" desc={user ? "Manage your profile information." : "Sign in to sync favorites and unlock personalization."}>
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-aurora text-white shadow-glow">
                <UserIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{profile?.display_name || "User"}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dn">Display name</Label>
              <div className="flex gap-2">
                <Input id="dn" value={displayName} maxLength={80} onChange={(e) => setDisplayName(e.target.value)} />
                <Button onClick={saveProfile} disabled={saving} className="gap-1.5">
                  <Save className="h-4 w-4" /> Save
                </Button>
              </div>
            </div>
            <Button variant="outline" onClick={async () => { await signOut(); toast.success("Signed out"); nav("/"); }} className="gap-1.5">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button className="gap-1.5 bg-gradient-aurora text-white border-0 hover:opacity-90">
              <LogIn className="h-4 w-4" /> Sign in or create account
            </Button>
          </Link>
        )}
      </Section>

      <Section title="Appearance" desc="Switch between light and dark themes.">
        <div className="grid grid-cols-2 gap-3">
          <ThemeOption active={theme === "light"} onClick={() => setTheme("light")} icon={Sun} label="Light" gradient="bg-gradient-day" />
          <ThemeOption active={theme === "dark"} onClick={() => setTheme("dark")} icon={Moon} label="Dark" gradient="bg-gradient-night" />
        </div>
      </Section>

      <Section title="Units" desc="Temperature display unit.">
        <div className="grid grid-cols-2 gap-3">
          <UnitOption active={unit === "C"} onClick={() => setUnit("C")} label="Celsius" symbol="°C" />
          <UnitOption active={unit === "F"} onClick={() => setUnit("F")} label="Fahrenheit" symbol="°F" />
        </div>
      </Section>

      <Section title="Notifications" desc="Get alerts for severe weather, UV and AQI.">
        <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Bell className="h-5 w-5" /></div>
            <div>
              <div className="font-medium">Weather alerts</div>
              <div className="text-xs text-muted-foreground">Show high UV and severe weather alerts in dashboard</div>
            </div>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </div>
      </Section>

      <Section title="Data" desc="Manage your stored data.">
        <div className="space-y-2">
          <DataRow label="Favorite cities" value={`${favorites.length} saved`} />
          <DataRow label="Recent searches" value={`${recentSearches.length} stored`}
            action={<Button size="sm" variant="ghost" onClick={() => { clearRecent(); toast.success("Recent searches cleared"); }} className="gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Clear</Button>} />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, desc, children }: any) {
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground mb-4">{desc}</p>
      {children}
    </motion.section>
  );
}

function ThemeOption({ active, onClick, icon: Icon, label, gradient }: any) {
  return (
    <button onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 text-left transition-all ${active ? "ring-2 ring-primary shadow-glow" : "ring-1 ring-border hover:ring-primary/40"}`}>
      <div className={`absolute inset-0 ${gradient} opacity-90`} />
      <div className="relative flex items-center justify-between text-white">
        <div className="flex items-center gap-2 font-semibold"><Icon className="h-5 w-5" /> {label}</div>
        {active && <div className="text-xs px-2 py-0.5 rounded-full bg-white/25">Active</div>}
      </div>
    </button>
  );
}

function UnitOption({ active, onClick, label, symbol }: any) {
  return (
    <button onClick={onClick}
      className={`rounded-2xl p-5 text-left transition-all ${active ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/40 ring-1 ring-border hover:ring-primary/40"}`}>
      <div className="flex items-center gap-2 text-muted-foreground text-xs"><Thermometer className="h-3.5 w-3.5" /> {label}</div>
      <div className="mt-1 font-display text-2xl font-bold">{symbol}</div>
    </button>
  );
}

function DataRow({ label, value, action }: any) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{value}</div>
      </div>
      {action}
    </div>
  );
}
