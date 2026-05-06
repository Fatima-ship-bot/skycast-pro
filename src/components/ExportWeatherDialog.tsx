import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Download } from "lucide-react";
import { exportWeatherData, downloadFile } from "@/utils/exportData";
import type { WeatherBundle } from "@/types/weather";
import { toast } from "sonner";

interface Props {
  data: WeatherBundle;
}

export default function ExportWeatherDialog({ data }: Props) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"json" | "csv">("json");
  const [includeHourly, setIncludeHourly] = useState(true);
  const [includeDaily, setIncludeDaily] = useState(true);
  const [includeAirQuality, setIncludeAirQuality] = useState(true);

  const handleExport = () => {
    const content = exportWeatherData(data, {
      format,
      includeHourly,
      includeDaily,
      includeAirQuality,
    });

    const ext = format === "json" ? ".json" : ".csv";
    const filename = `weather-${data.current.city}-${new Date().toISOString().split("T")[0]}${ext}`;

    downloadFile(content, filename);
    toast.success(`Weather data exported as ${filename}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Weather Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Format</Label>
            <RadioGroup value={format} onValueChange={(v: any) => setFormat(v)}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="json" id="format-json" />
                <Label htmlFor="format-json" className="cursor-pointer">
                  JSON (structured data)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="csv" id="format-csv" />
                <Label htmlFor="format-csv" className="cursor-pointer">
                  CSV (spreadsheet)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Include Data</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-hourly"
                  checked={includeHourly}
                  onCheckedChange={(c) => setIncludeHourly(!!c)}
                />
                <Label htmlFor="include-hourly" className="cursor-pointer">
                  Hourly Forecast
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-daily"
                  checked={includeDaily}
                  onCheckedChange={(c) => setIncludeDaily(!!c)}
                />
                <Label htmlFor="include-daily" className="cursor-pointer">
                  Daily Forecast
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="include-aq"
                  checked={includeAirQuality}
                  onCheckedChange={(c) => setIncludeAirQuality(!!c)}
                />
                <Label htmlFor="include-aq" className="cursor-pointer">
                  Air Quality Data
                </Label>
              </div>
            </div>
          </div>

          <div className="bg-muted/40 p-3 rounded-lg text-sm">
            File will be named:{" "}
            <code className="text-xs font-mono">
              weather-{data.current.city}-
              {new Date().toISOString().split("T")[0]}.
              {format === "json" ? "json" : "csv"}
            </code>
          </div>

          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Weather Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
