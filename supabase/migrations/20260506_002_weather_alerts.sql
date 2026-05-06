-- Weather Alerts Table
CREATE TABLE public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- 'temperature', 'precipitation', 'wind', 'air_quality', 'storm'
  city_name TEXT NOT NULL,
  lat FLOAT,
  lon FLOAT,
  severity TEXT NOT NULL, -- 'low', 'medium', 'high'
  threshold_value FLOAT,
  operator TEXT, -- 'greater_than', 'less_than', 'equals'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  triggered_at TIMESTAMPTZ
);

ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts" ON public.weather_alerts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own alerts" ON public.weather_alerts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON public.weather_alerts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts" ON public.weather_alerts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_weather_alerts_user_id ON public.weather_alerts(user_id);
CREATE INDEX idx_weather_alerts_is_active ON public.weather_alerts(is_active);
CREATE INDEX idx_weather_alerts_created_at ON public.weather_alerts(created_at DESC);

CREATE TRIGGER weather_alerts_updated_at
  BEFORE UPDATE ON public.weather_alerts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
