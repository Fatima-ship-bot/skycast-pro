import { CloudSun, Github, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 glass-strong">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-aurora">
              <CloudSun className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold">SkyCast<span className="gradient-text"> Pro</span></span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            An intelligent weather forecasting dashboard combining real-time atmospheric data,
            analytics and AI-style smart recommendations.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/forecast" className="text-muted-foreground hover:text-primary transition-colors">Forecast</Link></li>
            <li><Link to="/compare" className="text-muted-foreground hover:text-primary transition-colors">Compare cities</Link></li>
            <li><Link to="/recommendations" className="text-muted-foreground hover:text-primary transition-colors">Smart AI</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About project</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3">Project</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Final Year Web Development Project
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Github className="h-4 w-4" />
            <span>v1.0 · 2026</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 SkyCast Pro. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with <Heart className="h-3 w-3 fill-accent text-accent" /> using React, Tailwind & Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
}
