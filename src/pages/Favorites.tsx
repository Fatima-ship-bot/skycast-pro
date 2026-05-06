import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Download, Upload, Trash2, ArrowUpDown } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import FavoriteCityCard from "@/components/FavoriteCityCard";
import SearchBar from "@/components/SearchBar";
import { findCity } from "@/services/mockWeather";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortBy = "name" | "recent" | "country";

export default function Favorites() {
  const { favorites, addFavorite, removeFavorite } = useSettings();
  const [adding, setAdding] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("name");

  const handleAdd = (q: string) => {
    const c = findCity(q);
    if (!c) {
      addFavorite({ name: q, country: "—", lat: 0, lon: 0 });
    } else {
      addFavorite(c);
    }
    toast.success(`Added ${q} to favorites`);
    setAdding(false);
  };

  const sorted = [...favorites].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "country") return (a.country || "").localeCompare(b.country || "");
    return 0;
  });

  const exportFavorites = () => {
    const json = JSON.stringify(favorites, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skycast-favorites.json";
    a.click();
    toast.success("Favorites exported");
  };

  const importFavorites = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) {
            data.forEach((fav) => addFavorite(fav));
            toast.success(`Imported ${data.length} favorites`);
          }
        } catch {
          toast.error("Invalid file format");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="container py-8 md:py-12 space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Favorite <span className="gradient-text">Cities</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Quick access to weather in the cities that matter to you. ({favorites.length} saved)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportFavorites}>
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={importFavorites}>
                <Upload className="h-4 w-4 mr-2" />
                Import from JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-aurora text-white font-medium shadow-glow hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add city
          </button>
        </div>
      </motion.div>

      {adding && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <SearchBar onSearch={handleAdd} size="md" />
        </motion.div>
      )}

      {favorites.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sorted.length} favorites
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                Sort by {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("name")}>By name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("country")}>By country</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("recent")}>Recently added</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )}

      {favorites.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">No favorites yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Add cities you check often. They'll appear here with live previews.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((f, i) => <FavoriteCityCard key={f.id} city={f} index={i} />)}
        </div>
      )}
    </div>
  );
}
