// Supabase Edge Function: Process Weather Alerts
// Runs on a schedule to check weather conditions against user alerts
// Configure in supabase/config.toml with: functions = ["process-alerts"]

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const openWeatherApiKey = Deno.env.get("OPENWEATHER_API_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface WeatherData {
  main: { temp: number };
  wind: { speed: number };
  rain?: { "1h": number };
  air_quality?: { aqi: number };
}

async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`
  );
  return response.json();
}

async function processAlert(alert: any, weatherData: WeatherData) {
  const { id, alert_type, threshold_value, operator } = alert;
  let triggered = false;

  switch (alert_type) {
    case "temperature":
      if (operator === "greater_than" && weatherData.main.temp > threshold_value) {
        triggered = true;
      } else if (operator === "less_than" && weatherData.main.temp < threshold_value) {
        triggered = true;
      }
      break;

    case "wind":
      if (operator === "greater_than" && weatherData.wind.speed > threshold_value) {
        triggered = true;
      }
      break;

    case "precipitation":
      if (weatherData.rain && weatherData.rain["1h"] > (threshold_value || 0)) {
        triggered = true;
      }
      break;
  }

  if (triggered) {
    // Update alert with trigger timestamp
    await supabase
      .from("weather_alerts")
      .update({ triggered_at: new Date().toISOString() })
      .eq("id", id);

    // Send notification
    await supabase.functions.invoke("send-notification", {
      body: {
        userId: alert.user_id,
        alertId: id,
        alert_type,
        city: alert.city_name,
        message: `Weather alert: ${alert_type} threshold exceeded in ${alert.city_name}`,
      },
    });
  }
}

Deno.serve(async (req) => {
  try {
    // Get all active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from("weather_alerts")
      .select("*")
      .eq("is_active", true);

    if (alertsError) throw alertsError;

    // Process each alert
    for (const alert of alerts) {
      try {
        const weatherData = await fetchWeatherData(alert.lat, alert.lon);
        await processAlert(alert, weatherData);
      } catch (error) {
        console.error(`Error processing alert ${alert.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: alerts.length,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
