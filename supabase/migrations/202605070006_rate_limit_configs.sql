-- API Rate Limiting Table
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
