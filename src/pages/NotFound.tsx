import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { CloudOff, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: Route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 md:p-16 text-center max-w-lg">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-aurora shadow-glow">
          <CloudOff className="h-12 w-12 text-white" />
        </motion.div>
        <h1 className="mt-6 font-display text-7xl font-bold gradient-text">404</h1>
        <p className="mt-2 font-display text-xl font-semibold">Lost in the clouds</p>
        <p className="text-muted-foreground text-sm mt-1">
          The page <span className="font-mono">{location.pathname}</span> doesn't exist in our atmosphere.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-aurora text-white font-medium shadow-glow hover:opacity-90">
          <Home className="h-4 w-4" /> Back home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
