import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useWeather } from "@/hooks/useWeather";
import Loader from "@/components/Loader";
import ErrorState from "@/components/ErrorState";
import RecommendationCard from "@/components/RecommendationCard";
import { generateRecommendations } from "@/utils/recommendations";

export default function Recommendations() {
  const [city, setCity] = useState("Karachi");
  const { data, loading, error } = useWeather(city);
  const recs = data ? generateRecommendations(data) : [];

  return (
    <div className="container py-8 md:py-12 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
          <Brain className="h-3 w-3" /> AI-style weather assistant
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
          Smart <span className="gradient-text">Recommendations</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Personalized advice based on temperature, UV, air quality, wind and more.</p>
        <SearchBar onSearch={setCity} initial={city} size="md" />
      </motion.div>

      {loading && <Loader label="Analyzing atmospheric conditions..." />}
      {error && <ErrorState message={error} onRetry={() => setCity(city)} />}

      {data && (
        <>
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-aurora text-white shadow-glow">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current conditions in</p>
              <h3 className="font-display text-xl font-semibold">{data.current.city}, {data.current.country}</h3>
            </div>
            <div className="ml-auto text-right">
              <div className="font-display text-3xl font-bold">{Math.round(data.current.temp)}°C</div>
              <div className="text-xs text-muted-foreground capitalize">{data.current.condition.description}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recs.map((r, i) => <RecommendationCard key={r.id} rec={r} index={i} />)}
          </div>
        </>
      )}
    </div>
  );
}
