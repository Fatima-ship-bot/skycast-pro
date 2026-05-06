import { useState } from "react";
import { Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface FilterOptions {
  tempRange: [number, number];
  showRain: boolean;
  showWind: boolean;
  maxWind: number;
}

interface Props {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export default function ForecastFilter({ filters, onFilterChange }: Props) {
  const [tempRange, setTempRange] = useState(filters.tempRange);
  const [maxWind, setMaxWind] = useState(filters.maxWind);
  const [showRain, setShowRain] = useState(filters.showRain);
  const [showWind, setShowWind] = useState(filters.showWind);

  const apply = () => {
    onFilterChange({
      tempRange,
      showRain,
      showWind,
      maxWind,
    });
  };

  const reset = () => {
    setTempRange([-50, 50]);
    setMaxWind(50);
    setShowRain(true);
    setShowWind(true);
    onFilterChange({
      tempRange: [-50, 50],
      maxWind: 50,
      showRain: true,
      showWind: true,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sliders className="h-4 w-4" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Forecast</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Temperature Range: {tempRange[0]}°C to {tempRange[1]}°C</Label>
            <Slider
              value={tempRange}
              onValueChange={setTempRange}
              min={-50}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label>Max Wind Speed: {maxWind} m/s</Label>
            <Slider
              value={[maxWind]}
              onValueChange={(v) => setMaxWind(v[0])}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-rain"
                checked={showRain}
                onCheckedChange={(c) => setShowRain(!!c)}
              />
              <Label htmlFor="show-rain" className="cursor-pointer">
                Show rainy periods
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-wind"
                checked={showWind}
                onCheckedChange={(c) => setShowWind(!!c)}
              />
              <Label htmlFor="show-wind" className="cursor-pointer">
                Show windy periods
              </Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={apply} className="flex-1">
              Apply Filters
            </Button>
            <Button onClick={reset} variant="outline" className="flex-1">
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
