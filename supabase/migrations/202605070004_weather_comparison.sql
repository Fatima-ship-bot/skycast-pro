-- Search History Table
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
