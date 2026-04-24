"use server";
import { createSafeActionClient } from "next-safe-action";
import { EventParams, OneEventParams, RecurringEventParams } from "../app/schemas/events";
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
          "id, poster_url, poster_alt, title, start_date, end_date, location, call_to_action_link, call_to_action_caption, description",
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

export const fetchRecurringEventDetails = actionClient
  .inputSchema(RecurringEventParams)
  .action(async ({ parsedInput }) => {
    try {
      const { recurrence_rule_id } = parsedInput;
      const supabase = await createClient();
      const now = new Date().toISOString();
      const [next, last] = await Promise.all([
        supabase
          .from("events")
          .select("id, start_date, end_date")
          .eq("recurrence_rule_id", recurrence_rule_id)
          .gte("start_date", now)
          .order("start_date", { ascending: true })
          .limit(1)
          .single(),
        supabase
          .from("events")
          .select("id, start_date, end_date")
          .eq("recurrence_rule_id", recurrence_rule_id)
          .lt("start_date", now)
          .order("start_date", { ascending: false })
          .limit(1)
          .single(),
      ]);
      return {
        error: null,
        nextOccurrence: next.data ?? null,
        lastOccurrence: last.data ?? null,
      };
    } catch (error) {
      console.error(error);
      return {
        error: error instanceof Error ? error.message : String(error),
        nextOccurrence: null,
        lastOccurrence: null,
      };
    }
  });

export const fetchOneEvent = actionClient
  .inputSchema(OneEventParams)
  .action(async ({ parsedInput }) => {
    try {
      const id = parsedInput.id;
      const supabase = await createClient();
      const events = await supabase
        .from("events")
        .select(
          "id, poster_url, poster_alt, title, start_date, end_date, location, call_to_action_link, call_to_action_caption, description, gallery_url, recurrence_rule_id, recurrence_rule(frequency, interval, by_weekdays, by_month_day, by_set_position)",
        )
        .eq("id", id);
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
