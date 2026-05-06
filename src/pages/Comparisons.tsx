// Weather Comparison Component
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Heart, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import * as comparisonService from "@/services/weatherComparisonService";
import type { WeatherComparison } from "@/services/weatherComparisonService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchBar from "@/components/SearchBar";
import { toast } from "sonner";

export default function Compare() {
  const { user } = useAuth();
  const [comparisons, setComparisons] = useState<WeatherComparison[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [comparisonName, setComparisonName] = useState("");

  useEffect(() => {
    if (user) {
      loadComparisons();
    }
  }, [user]);

  async function loadComparisons() {
    setLoading(true);
    const data = await comparisonService.getComparisons();
    setComparisons(data);
    setLoading(false);
  }

  function handleAddCity(city: string) {
    if (!selectedCities.includes(city) && selectedCities.length < 5) {
      setSelectedCities([...selectedCities, city]);
    } else if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    }
  }

  async function handleCreateComparison() {
    if (!comparisonName.trim()) {
      toast.error("Please enter a comparison name");
      return;
    }

    if (selectedCities.length < 2) {
      toast.error("Select at least 2 cities");
      return;
    }

    const latLonPairs: [number, number][] = selectedCities.map(() => [0, 0]); // Would get from geocoding

    const result = await comparisonService.createComparison(
      comparisonName,
      selectedCities,
      latLonPairs
    );

    if (result) {
      setComparisons([result, ...comparisons]);
      setComparisonName("");
      setSelectedCities([]);
      setCreating(false);
      toast.success("Comparison saved");
    } else {
      toast.error("Failed to save comparison");
    }
  }

  async function handleDeleteComparison(comparisonId: string) {
    const success = await comparisonService.deleteComparison(comparisonId);
    if (success) {
      setComparisons(comparisons.filter((c) => c.id !== comparisonId));
      toast.success("Comparison deleted");
    }
  }

  async function handleFavoriteComparison(comparisonId: string) {
    const success = await comparisonService.favoriteComparison(comparisonId);
    if (success) {
      setComparisons(
        comparisons.map((c) =>
          c.id === comparisonId ? { ...c, is_favorite: true } : c
        )
      );
      toast.success("Added to favorites");
    }
  }

  if (!user) {
    return (
      <div className="container py-12">
        <div className="glass-card p-8 text-center">
          <p className="text-muted-foreground">Sign in to save weather comparisons</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
          Compare <span className="gradient-text">Cities</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Compare weather across multiple cities at once
        </p>
      </motion.div>

      {creating && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">New Comparison</h3>
            <button
              onClick={() => {
                setCreating(false);
                setSelectedCities([]);
                setComparisonName("");
              }}
              className="p-1 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div>
            <Label>Comparison Name</Label>
            <Input
              placeholder="e.g., Summer Vacation Destinations"
              value={comparisonName}
              onChange={(e) => setComparisonName(e.target.value)}
            />
          </div>

          <div>
            <Label>Add Cities ({selectedCities.length}/5)</Label>
            <SearchBar onSearch={handleAddCity} size="md" />
          </div>

          {selectedCities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedCities.map((city) => (
                <div
                  key={city}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                >
                  {city}
                  <button
                    onClick={() => handleAddCity(city)}
                    className="hover:opacity-70"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleCreateComparison}
              disabled={selectedCities.length < 2}
              className="bg-gradient-aurora text-white"
            >
              Save Comparison
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCreating(false);
                setSelectedCities([]);
                setComparisonName("");
              }}
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
          <Plus className="h-4 w-4" /> New Comparison
        </Button>
      )}

      <div className="grid gap-4">
        <AnimatePresence>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : comparisons.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-8 text-center"
            >
              <p className="text-muted-foreground">No comparisons saved yet</p>
              <p className="text-sm text-muted-foreground/70">
                Create one to compare weather across cities
              </p>
            </motion.div>
          ) : (
            comparisons.map((comparison, idx) => (
              <motion.div
                key={comparison.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-4 flex items-center justify-between hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="font-semibold">{comparison.comparison_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {comparison.cities.join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFavoriteComparison(comparison.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        comparison.is_favorite
                          ? "fill-current text-red-500"
                          : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteComparison(comparison.id)}
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
