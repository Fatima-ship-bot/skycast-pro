import { useState, FormEvent, useRef, useEffect } from "react";
import { Search, Mic, X, History, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { KNOWN_CITIES } from "@/services/mockWeather";
import { recordSearch } from "@/services/searchHistoryService";
import { toast } from "sonner";

interface Props {
  onSearch: (city: string) => void;
  initial?: string;
  size?: "lg" | "md";
}

export default function SearchBar({ onSearch, initial = "", size = "lg" }: Props) {
  const [value, setValue] = useState(initial);
  const [focused, setFocused] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const { recentSearches, clearRecent } = useSettings();
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return;
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setValue(transcript);
    };
    recognitionRef.current.onend = () => setVoiceActive(false);
    recognitionRef.current.onerror = (event: any) => {
      toast.error(`Voice error: ${event.error}`);
      setVoiceActive(false);
    };
  }, []);

  const startVoiceSearch = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition not supported in your browser");
      return;
    }
    setVoiceActive(true);
    recognitionRef.current.start();
  };

  const stopVoiceSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      if (value.trim()) {
        // Record search in database
        const city = KNOWN_CITIES.find(c => c.name.toLowerCase() === value.toLowerCase());
        recordSearch(value.trim(), value, city?.lat, city?.lon, city?.country);
        onSearch(value.trim());
        setFocused(false);
      }
    }
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    // Record search in database
    const city = KNOWN_CITIES.find(c => c.name.toLowerCase() === value.toLowerCase());
    recordSearch(value.trim(), value, city?.lat, city?.lon, city?.country);
    onSearch(value.trim());
    setFocused(false);
  };

  const suggestions = value
    ? KNOWN_CITIES.filter((c) => c.name.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
    : [];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={submit}>
        <div className={`glass-strong rounded-2xl flex items-center gap-2 px-4 ${size === "lg" ? "h-16" : "h-12"} shadow-glow`}>
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search any city worldwide..."
            className={`flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${size === "lg" ? "text-base" : "text-sm"}`}
            aria-label="Search city"
          />
          {value && (
            <button type="button" onClick={() => setValue("")} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          {voiceActive ? (
            <Button type="button" onClick={stopVoiceSearch} size="icon" variant="ghost" className="rounded-full text-destructive animate-pulse" aria-label="Stop voice search">
              <Loader className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={startVoiceSearch} size="icon" variant="ghost" className="rounded-full" aria-label="Voice search" title="Click to speak city name">
              <Mic className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" size={size === "lg" ? "default" : "sm"} className="rounded-xl bg-gradient-aurora hover:opacity-90 text-white border-0">
            Search
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {focused && (suggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-30 mt-2 w-full glass-strong rounded-2xl p-2 shadow-elegant"
          >
            {suggestions.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Suggestions</div>
                {suggestions.map((s) => (
                  <button
                    key={s.name}
                    onMouseDown={() => { setValue(s.name); onSearch(s.name); setFocused(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10 flex items-center justify-between"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-muted-foreground">{s.country}</span>
                  </button>
                ))}
              </div>
            )}
            {!value && recentSearches.length > 0 && (
              <div>
                <div className="px-3 py-1.5 text-xs font-medium text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><History className="h-3 w-3" /> Recent</span>
                  <button onMouseDown={clearRecent} className="text-[10px] hover:text-foreground">Clear</button>
                </div>
                {recentSearches.map((c) => (
                  <button
                    key={c}
                    onMouseDown={() => { setValue(c); onSearch(c); setFocused(false); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary/10"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
