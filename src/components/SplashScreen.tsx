import { motion } from "framer-motion";
import { CloudSun } from "lucide-react";
import { useEffect, useState } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exit, setExit] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setExit(true), 1300);
    const t2 = setTimeout(onDone, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: exit ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-aurora"
    >
      <div className="absolute inset-0 mesh-bg opacity-50" />
      <div className="relative flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/40 blur-3xl rounded-full" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-elegant">
            <CloudSun className="h-14 w-14 text-white" />
          </div>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl font-bold text-white tracking-tight">SkyCast Pro</h1>
          <p className="text-white/80 text-sm mt-1">Intelligent weather forecasting</p>
        </motion.div>
        <motion.div className="h-1 w-40 rounded-full bg-white/20 overflow-hidden">
          <motion.div initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 1.3, ease: "easeInOut" }} className="h-full w-1/2 bg-white rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
