import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = "Something went wrong", message = "We couldn't load the weather data. Please try again.", onRetry }: Props) {
  return (
    <div className="glass-card p-10 flex flex-col items-center text-center gap-4 max-w-lg mx-auto">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Try again
        </Button>
      )}
    </div>
  );
}
