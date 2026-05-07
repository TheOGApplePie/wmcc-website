"use server";
import { createSafeActionClient } from "next-safe-action";
import {
  EventParams,
  FetchRecurringBaseEventsParams,
  OneEventParams,
  SimilarEvent,
  SimilarEventsParams,
} from "../app/schemas/events";
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
          "id, navigation_slug, poster_url, poster_alt, title, start_date, end_date, location, call_to_action_link, call_to_action_caption, description",
        )
        .is("recurrence_rule_id", null)
        .not("navigation_slug", "is", null)
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

export const fetchRecurringBaseEvents = actionClient
  .inputSchema(FetchRecurringBaseEventsParams)
  .action(async () => {
    try {
      const supabase = await createClient();
      const events = await supabase
        .from("events")
        .select(
          "id, navigation_slug, poster_url, poster_alt, title, start_date, end_date, location, call_to_action_link, call_to_action_caption, description, recurrence_rule_id, recurrence_rule(frequency, interval, by_weekdays, by_month_day, by_set_position, until, count, exdates)",
        )
        .not("recurrence_rule_id", "is", null)
        .not("navigation_slug", "is", null);
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

export const fetchSimilarEvents = actionClient
  .inputSchema(SimilarEventsParams)
  .action(async ({ parsedInput }) => {
    try {
      const { slug } = parsedInput;
      const words = slug.split("-").filter((w) => w.length >= 3);
      if (!words.length) return { error: null, data: [] };

      const supabase = await createClient();

      // One ilike query per word, run in parallel
      const results = await Promise.all(
        words.map((w) =>
          supabase
            .from("events")
            .select("id, navigation_slug, title, poster_url, poster_alt, start_date, location")
            .not("navigation_slug", "is", null)
            .ilike("navigation_slug", `%${w}%`)
            .limit(10),
        ),
      );

      // Merge: events that match more words rank higher
      const scoreMap = new Map<number, { data: SimilarEvent; score: number }>();
      for (const result of results) {
        if (result.error) throw result.error;
        for (const ev of result.data ?? []) {
          const entry = scoreMap.get(ev.id);
          if (entry) {
            entry.score++;
          } else {
            scoreMap.set(ev.id, { data: ev, score: 1 });
          }
        }
      }

      const similar = [...scoreMap.values()]
        .sort(
          (a, b) =>
            b.score - a.score ||
            new Date(a.data.start_date).getTime() - new Date(b.data.start_date).getTime(),
        )
        .slice(0, 3)
        .map((entry) => entry.data);

      return { error: null, data: similar };
    } catch (error) {
      console.error(error);
      return {
        error: error instanceof Error ? error.message : String(error),
        data: [],
      };
    }
  });

export const fetchOneEvent = actionClient
  .inputSchema(OneEventParams)
  .action(async ({ parsedInput }) => {
    try {
      const slug = parsedInput.slug;
      const supabase = await createClient();
      const events = await supabase
        .from("events")
        .select(
          "id, navigation_slug, poster_url, poster_alt, title, start_date, end_date, location, call_to_action_link, call_to_action_caption, description, gallery_url, recurrence_rule_id, recurrence_rule(frequency, interval, by_weekdays, by_month_day, by_set_position, until, count, exdates)",
        )
        .eq("navigation_slug", slug);
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
