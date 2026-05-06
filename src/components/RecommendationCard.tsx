import { motion } from "framer-motion";
import type { Recommendation } from "@/utils/recommendations";

const severityStyles: Record<Recommendation["severity"], string> = {
  info: "from-info/20 to-primary/10 text-info border-info/30",
  warning: "from-warning/20 to-accent/10 text-warning border-warning/30",
  danger: "from-destructive/20 to-accent/10 text-destructive border-destructive/30",
  success: "from-success/20 to-primary/10 text-success border-success/30",
};

export default function RecommendationCard({ rec, index = 0 }: { rec: Recommendation; index?: number }) {
  const Icon = rec.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${severityStyles[rec.severity]} p-5 backdrop-blur-xl`}
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-current opacity-10 blur-2xl" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-current/20">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-display font-semibold text-foreground">{rec.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{rec.message}</p>
        </div>
      </div>
    </motion.div>
  );
}
