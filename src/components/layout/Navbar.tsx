import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CloudSun, LayoutDashboard, BarChart3, Heart, GitCompareArrows, Bell,
  Sparkles, Settings as SettingsIcon, Info, Menu, X, Sun, Moon, LogOut, LogIn, User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/forecast", label: "Forecast", icon: BarChart3 },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/recommendations", label: "Smart AI", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
  { to: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useSettings();
  const { user, profile, signOut } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    nav("/");
  };

  const initials = (profile?.display_name || user?.email || "U")
    .split(/[\s@]/)[0].slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass-strong border-b border-white/10">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-aurora shadow-glow"
            >
              <CloudSun className="h-6 w-6 text-white" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight">SkyCast<span className="gradient-text"> Pro</span></span>
              <span className="text-[10px] text-muted-foreground">Intelligent Forecasting</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5
                  ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <l.icon className="h-4 w-4" />
                    {l.label}
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-aurora text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">{profile?.display_name || "User"}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav("/settings")}>
                    <UserIcon className="h-4 w-4 mr-2" /> Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="gap-1.5 bg-gradient-aurora text-white border-0 hover:opacity-90">
                  <LogIn className="h-4 w-4" /> Sign in
                </Button>
              </Link>
            )}
            <Button size="icon" variant="ghost" className="lg:hidden rounded-full" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-2"
          >
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"}`
                }
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </div>
    </header>
  );
}
