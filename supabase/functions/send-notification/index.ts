// Supabase Edge Function: Send Notification
// Sends notifications to users based on alerts

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface NotificationPayload {
  userId: string;
  alertId: string;
  alert_type: string;
  city: string;
  message: string;
}

Deno.serve(async (req) => {
  try {
    const payload: NotificationPayload = await req.json();
    const { userId, alertId, alert_type, city, message } = payload;

    // Get user preferences
    const { data: preferences, error: prefError } = await supabase
      .from("user_preferences")
      .select("notifications_enabled, alert_email")
      .eq("user_id", userId)
      .single();

    if (prefError) {
      console.error("Error fetching preferences:", prefError);
      return new Response(
        JSON.stringify({ error: "User preferences not found" }),
        { status: 404 }
      );
    }

    if (!preferences.notifications_enabled) {
      return new Response(
        JSON.stringify({ message: "Notifications disabled for user" }),
        { status: 200 }
      );
    }

    // In a real implementation, this would:
    // 1. Store notification in a notifications table
    // 2. Send email if alert_email is enabled
    // 3. Send push notification via Firebase Cloud Messaging or similar

    // For now, just log and store
    console.log(`Notification for user ${userId}: ${message}`);

    // Could store in a notifications table
    // const { error: insertError } = await supabase
    //   .from("notifications")
    //   .insert({
    //     user_id: userId,
    //     alert_id: alertId,
    //     type: alert_type,
    //     message,
    //     is_read: false,
    //   });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Notification sent for ${city}`,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
