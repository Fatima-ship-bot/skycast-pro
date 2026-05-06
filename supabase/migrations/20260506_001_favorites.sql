-- Favorites Management Table
CREATE TABLE public.favorite_cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  lat FLOAT,
  lon FLOAT,
  country_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, city_name)
);

ALTER TABLE public.favorite_cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON public.favorite_cities
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorite_cities
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own favorites" ON public.favorite_cities
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorite_cities
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_favorite_cities_user_id ON public.favorite_cities(user_id);
CREATE INDEX idx_favorite_cities_created_at ON public.favorite_cities(created_at DESC);

CREATE TRIGGER favorite_cities_updated_at
  BEFORE UPDATE ON public.favorite_cities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
