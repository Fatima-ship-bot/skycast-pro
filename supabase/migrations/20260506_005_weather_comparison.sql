-- Weather Comparison Table
CREATE TABLE public.weather_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  comparison_name TEXT NOT NULL,
  cities TEXT[] NOT NULL, -- Array of city names
  lat_lon_pairs FLOAT8[][] NOT NULL, -- Array of [lat, lon] pairs
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_favorite BOOLEAN DEFAULT false
);

ALTER TABLE public.weather_comparisons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own comparisons" ON public.weather_comparisons
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparisons" ON public.weather_comparisons
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparisons" ON public.weather_comparisons
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons" ON public.weather_comparisons
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_weather_comparisons_user_id ON public.weather_comparisons(user_id);
CREATE INDEX idx_weather_comparisons_created_at ON public.weather_comparisons(created_at DESC);
CREATE INDEX idx_weather_comparisons_is_favorite ON public.weather_comparisons(is_favorite);

CREATE TRIGGER weather_comparisons_updated_at
  BEFORE UPDATE ON public.weather_comparisons
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
