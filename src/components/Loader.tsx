import { motion } from "framer-motion";
import { CloudSun } from "lucide-react";

export default function Loader({ label = "Fetching atmospheric data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="relative h-20 w-20"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-aurora opacity-30 blur-xl" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-aurora shadow-glow">
          <CloudSun className="h-10 w-10 text-white" />
        </div>
      </motion.div>
      <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
    </div>
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-2xl ${className}`} />;
}
