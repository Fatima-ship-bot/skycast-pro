import { motion } from "framer-motion";
import { Code2, Layers, Sparkles, Zap, Cpu, Globe, ChartLine, Cloud, Github, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const tech = ["React 18", "TypeScript", "Vite", "Tailwind CSS", "React Router DOM", "Framer Motion", "Recharts", "Axios", "Lucide Icons", "Context API", "LocalStorage"];

const features = [
  { icon: Cloud, title: "Real-time weather", desc: "Current conditions, hourly and 7-day forecasts." },
  { icon: ChartLine, title: "Analytics charts", desc: "Temperature, humidity, wind and precipitation graphs." },
  { icon: Cpu, title: "Smart AI assistant", desc: "Context-aware recommendations across 9+ scenarios." },
  { icon: Globe, title: "City comparison", desc: "Compare up to 5 cities side-by-side with charts." },
  { icon: Layers, title: "Glassmorphism UI", desc: "Premium glass cards with dynamic weather gradients." },
  { icon: Zap, title: "Geolocation & PWA-ready", desc: "Use current location and install on any device." },
];

const stats = [
  { label: "Cities Available", value: "14+" },
  { label: "Data Points", value: "40+" },
  { label: "Forecast Hours", value: "48" },
  { label: "Components", value: "50+" },
];

export default function About() {
  return (
    <div className="container py-8 md:py-12 max-w-5xl space-y-10">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Sparkles className="h-3 w-3" /> Final Year Web Development Project
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
          About <span className="gradient-text">SkyCast Pro</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
          A premium intelligent weather forecasting dashboard combining real-time atmospheric data,
          advanced analytics, and AI-style smart recommendations — built end-to-end with a production-grade React architecture.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 text-center rounded-xl"
          >
            <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-2">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <section className="glass-card p-8">
        <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><Code2 className="h-5 w-5 text-primary" /> Project description</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          SkyCast Pro demonstrates a scalable, modular React architecture with feature-driven folders, typed
          domain models, a service layer ready for live API integration (OpenWeather), Context-based global state,
          custom hooks, and a fully themed design system. The UI showcases glassmorphism, dynamic weather gradients
          and motion choreography to create a premium consumer-grade experience.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Production-ready</Badge>
          <Badge variant="secondary">Type-safe</Badge>
          <Badge variant="secondary">Responsive</Badge>
          <Badge variant="secondary">Accessible</Badge>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold mb-4">Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="glass-card p-8">
        <h2 className="font-display text-2xl font-semibold flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Technologies & Stack
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">{t}</span>
          ))}
        </div>
      </section>

      <section className="glass-card p-8">
        <h2 className="font-display text-2xl font-semibold">Architecture Highlights</h2>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-0.5">→</span>
            <div>
              <strong>Modular Component Structure:</strong> Feature-driven organization with isolated concerns (services, hooks, utilities)
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-0.5">→</span>
            <div>
              <strong>Custom Hooks:</strong> useWeather, useGeolocation, useSettings for reusable logic
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-0.5">→</span>
            <div>
              <strong>Context API State:</strong> AuthContext, SettingsContext for global state management
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-0.5">→</span>
            <div>
              <strong>Service Layer:</strong> Abstracted API calls with support for mock and live data
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold mt-0.5">→</span>
            <div>
              <strong>TypeScript & Type Safety:</strong> Strict typing for all data models and API responses
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card p-8">
        <h2 className="font-display text-2xl font-semibold">Developer</h2>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-aurora text-white font-display text-2xl font-bold shadow-glow">
            SE
          </div>
          <div>
            <div className="font-display font-semibold text-lg">Computer Science Student</div>
            <div className="text-sm text-muted-foreground">Final Year Project · 2026</div>
            <div className="text-xs text-muted-foreground mt-1">Replace this placeholder with your name and university.</div>
          </div>
        </div>
      </section>

      <section className="glass-card p-8">
        <h2 className="font-display text-2xl font-semibold mb-4">Resources & Links</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors border border-border"
          >
            <Cloud className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-sm">Live Dashboard</div>
              <div className="text-xs text-muted-foreground">View current weather</div>
            </div>
          </Link>
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors border border-border"
          >
            <ExternalLink className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-sm">OpenWeather API</div>
              <div className="text-xs text-muted-foreground">Live data provider</div>
            </div>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors border border-border"
          >
            <Github className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-sm">GitHub Repository</div>
              <div className="text-xs text-muted-foreground">View source code</div>
            </div>
          </a>
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors border border-border"
          >
            <ExternalLink className="h-5 w-5 text-primary" />
            <div>
              <div className="font-semibold text-sm">Supabase</div>
              <div className="text-xs text-muted-foreground">Backend infrastructure</div>
            </div>
          </a>
        </div>
      </section>

      <div className="text-center">
        <Link to="/" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-aurora text-white font-medium shadow-glow hover:opacity-90">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
