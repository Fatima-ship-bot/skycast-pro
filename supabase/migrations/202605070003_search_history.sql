-- User Preferences Table
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
