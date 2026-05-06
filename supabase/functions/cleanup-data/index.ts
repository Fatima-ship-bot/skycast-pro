// Supabase Edge Function: Cleanup Old Data
// Runs on a schedule to clean up expired cache and old history records

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

Deno.serve(async (req) => {
  try {
    const results = {
      search_history_deleted: 0,
      rate_limits_deleted: 0,
    };

    // Clean up old search history (keep only 100 per user, delete after 30 days if not saved)
    const { data: usersData } = await supabase
      .from("search_history")
      .select("user_id")
      .distinct();

    if (usersData) {
      for (const userRecord of usersData) {
        if (userRecord.user_id) {
          // Delete old unsaved searches
          const { data: recordsToDelete, error: listError } = await supabase
            .from("search_history")
            .select("id")
            .eq("user_id", userRecord.user_id)
            .eq("is_saved", false)
            .lt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

          if (!listError && recordsToDelete) {
            const { error: deleteError } = await supabase
              .from("search_history")
              .delete()
              .in(
                "id",
                recordsToDelete.map((r) => r.id)
              );

            if (!deleteError) {
              results.search_history_deleted += recordsToDelete.length;
            }
          }
        }
      }
    }

    // Clean up expired rate limit windows
    const { error: rateLimitError } = await supabase
      .from("api_rate_limits")
      .delete()
      .lt("window_end", new Date().toISOString());

    if (!rateLimitError) {
      results.rate_limits_deleted = 1; // Count aggregate operation
    }

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
