import { useState } from "react";

export function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  return { coords, error, loading, request };
}
