"use server";
import { createSafeActionClient } from "next-safe-action";
import { EventParams } from "../app/schemas/events";
import { createClient } from "../utils/supabase/server";

const actionClient = createSafeActionClient();

export const fetchEvents = actionClient
  .inputSchema(EventParams)
  .action(async ({ parsedInput }) => {
    try {
      const start = parsedInput.start;
      const end = parsedInput.end;
      const supabase = await createClient();
      const events = await supabase
        .from("events")
        .select(
          "id, poster_url,poster_alt,title,start_date, end_date, location, call_to_action_link, call_to_action_caption",
        )
        .gte("start_date", start.toISOString())
        .lte("start_date", end.toISOString())
        .order("start_date", { ascending: true });
      if (events.error) {
        throw events.error;
      }
      return {
        error: null,
        data: events.data,
      };
    } catch (error) {
      console.error(error);
      return {
        error: error instanceof Error ? error.message : String(error),
        data: [],
      };
    }
  });
