-- SkyCast Pro Database Migrations
-- Run this entire script in Supabase SQL Editor

-- =====================================================
-- 1. PROFILES TABLE (Base)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by owner" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles insert by owner" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles update by owner" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- =====================================================
-- 2. HELPER FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- 3. FAVORITE CITIES TABLE
-- =====================================================
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

-- =====================================================
-- 4. WEATHER ALERTS TABLE
-- =====================================================
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

-- =====================================================
-- 5. USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  temperature_unit TEXT DEFAULT 'celsius', -- 'celsius', 'fahrenheit'
  wind_unit TEXT DEFAULT 'ms', -- 'ms', 'kmh', 'mph'
  pressure_unit TEXT DEFAULT 'hpa', -- 'hpa', 'mb', 'inHg'
  theme TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
  notifications_enabled BOOLEAN DEFAULT true,
  alert_email BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  auto_detect_location BOOLEAN DEFAULT true,
  default_city TEXT,
  hourly_updates BOOLEAN DEFAULT false,
  daily_updates BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);

CREATE TRIGGER user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Create preferences record when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_preferences();

-- =====================================================
-- 6. SEARCH HISTORY TABLE
-- =====================================================
CREATE TABLE public.search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  city_name TEXT,
  lat FLOAT,
  lon FLOAT,
  country_code TEXT,
  result_count INT,
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own search history" ON public.search_history
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own search history" ON public.search_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own search history" ON public.search_history
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history" ON public.search_history
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_created_at ON public.search_history(created_at DESC);
CREATE INDEX idx_search_history_query ON public.search_history(query);
CREATE INDEX idx_search_history_is_saved ON public.search_history(is_saved);

-- Auto-cleanup: Keep only last 100 searches per user older than 30 days
CREATE OR REPLACE FUNCTION public.cleanup_old_search_history()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.search_history
  WHERE created_at < now() - interval '30 days'
    AND is_saved = false;
  
  DELETE FROM public.search_history sh1
  WHERE user_id IS NOT NULL
    AND created_at < now() - interval '90 days'
    AND EXISTS (
      SELECT 1 FROM public.search_history sh2
      WHERE sh2.user_id = sh1.user_id
      GROUP BY user_id
      HAVING COUNT(*) > 100
    );
END;
$$;

-- =====================================================
-- 7. WEATHER COMPARISONS TABLE
-- =====================================================
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

-- =====================================================
-- 8. API RATE LIMITING TABLES
-- =====================================================
CREATE TABLE public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  request_count INT DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  window_end TIMESTAMPTZ DEFAULT now() + interval '1 hour',
  UNIQUE(user_id, endpoint, window_start)
);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_api_rate_limits_user_id_endpoint ON public.api_rate_limits(user_id, endpoint);
CREATE INDEX idx_api_rate_limits_window_end ON public.api_rate_limits(window_end);

-- Clean up expired rate limit windows
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.api_rate_limits
  WHERE window_end < now();
END;
$$;

-- Rate limit config table
CREATE TABLE public.rate_limit_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT UNIQUE NOT NULL,
  requests_per_hour INT DEFAULT 60,
  requests_per_day INT DEFAULT 1000,
  is_enabled BOOLEAN DEFAULT true
);

INSERT INTO public.rate_limit_config (endpoint, requests_per_hour, requests_per_day)
VALUES
  ('/weather', 60, 1000),
  ('/forecast', 60, 1000),
  ('/air_pollution', 30, 500),
  ('/geocoding', 45, 500);

-- =====================================================
-- END OF MIGRATIONS
-- =====================================================
