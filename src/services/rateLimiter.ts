// Rate Limiting Service
// Manages API rate limiting per user and endpoint

import { supabase } from "@/integrations/supabase/client";

interface RateLimitConfig {
  endpoint: string;
  requestsPerHour: number;
  requestsPerDay: number;
  isEnabled: boolean;
}

interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limitType: "hourly" | "daily";
}

const DEFAULT_HOURLY_LIMIT = 60;
const DEFAULT_DAILY_LIMIT = 1000;

export async function checkRateLimit(
  userId: string | null,
  endpoint: string
): Promise<RateLimitStatus> {
  // If no user, allow unlimited (for demo/public)
  if (!userId) {
    return {
      allowed: true,
      remaining: Infinity,
      resetTime: new Date(),
      limitType: "hourly",
    };
  }

  try {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Get hourly request count
    const { data: hourlyData, error: hourlyError } = await supabase
      .from("api_rate_limits")
      .select("request_count")
      .eq("user_id", userId)
      .eq("endpoint", endpoint)
      .gte("window_start", hourAgo.toISOString())
      .lt("window_start", now.toISOString())
      .single();

    if (hourlyError && hourlyError.code !== "PGRST116") {
      console.error("Rate limit check error:", hourlyError);
      return { allowed: true, remaining: DEFAULT_HOURLY_LIMIT, resetTime: new Date(), limitType: "hourly" };
    }

    const hourlyCount = hourlyData?.request_count || 0;
    const hourlyRemaining = Math.max(0, DEFAULT_HOURLY_LIMIT - hourlyCount);

    if (hourlyRemaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(hourAgo.getTime() + 60 * 60 * 1000),
        limitType: "hourly",
      };
    }

    // Get daily request count
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { data: dailyData, error: dailyError } = await supabase
      .from("api_rate_limits")
      .select("request_count")
      .eq("user_id", userId)
      .eq("endpoint", endpoint)
      .gte("window_start", dayAgo.toISOString())
      .lt("window_start", now.toISOString());

    if (dailyError && dailyError.code !== "PGRST116") {
      console.error("Daily rate limit check error:", dailyError);
      return { allowed: true, remaining: DEFAULT_DAILY_LIMIT, resetTime: new Date(), limitType: "daily" };
    }

    const dailyCount =
      dailyData?.reduce((sum, record) => sum + (record.request_count || 0), 0) || 0;
    const dailyRemaining = Math.max(0, DEFAULT_DAILY_LIMIT - dailyCount);

    if (dailyRemaining <= 0) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(dayAgo.getTime() + 24 * 60 * 60 * 1000),
        limitType: "daily",
      };
    }

    return {
      allowed: true,
      remaining: Math.min(hourlyRemaining, dailyRemaining),
      resetTime: new Date(Math.min(
        hourAgo.getTime() + 60 * 60 * 1000,
        dayAgo.getTime() + 24 * 60 * 60 * 1000
      )),
      limitType: "hourly",
    };
  } catch (error) {
    console.error("Rate limit check exception:", error);
    return {
      allowed: true,
      remaining: DEFAULT_HOURLY_LIMIT,
      resetTime: new Date(),
      limitType: "hourly",
    };
  }
}

export async function recordRequest(
  userId: string | null,
  endpoint: string
): Promise<void> {
  if (!userId) return;

  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - (now.getTime() % (60 * 60 * 1000)));

    await supabase
      .from("api_rate_limits")
      .upsert(
        {
          user_id: userId,
          endpoint,
          window_start: windowStart.toISOString(),
          window_end: new Date(windowStart.getTime() + 60 * 60 * 1000).toISOString(),
          request_count: 1,
        },
        {
          onConflict: "user_id,endpoint,window_start",
        }
      )
      .then(({ error }) => {
        if (error && error.code !== "PGRST116") {
          console.error("Error recording request:", error);
        }
      });
  } catch (error) {
    console.error("Error recording API request:", error);
  }
}

export async function getRateLimitConfig(
  endpoint: string
): Promise<RateLimitConfig | null> {
  try {
    const { data, error } = await supabase
      .from("rate_limit_config")
      .select("*")
      .eq("endpoint", endpoint)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching rate limit config:", error);
      return null;
    }

    return data as RateLimitConfig;
  } catch (error) {
    console.error("Error getting rate limit config:", error);
    return null;
  }
}
