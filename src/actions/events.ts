"use server";
import { EventParams } from "../app/schemas/events";
import { getSimilarEvents, getSessionsInRange } from "../lib/public-content";

export async function fetchEvents(input: { start: Date; end: Date }) {
  const parsed = EventParams.safeParse(input);
  if (!parsed.success)
    return { error: "Choose a valid date range of up to 93 days.", data: null };
  try {
    return {
      error: null,
      data: await getSessionsInRange(parsed.data.start, parsed.data.end),
    };
  } catch {
    return { error: "We couldn’t load events. Please try again.", data: null };
  }
}

export async function fetchSimilarEvents(slug: string) {
  if (typeof slug !== "string" || slug.length > 200)
    return { data: [], error: null };
  try {
    return { data: await getSimilarEvents(slug), error: null };
  } catch {
    return { data: null, error: "Suggestions are temporarily unavailable." };
  }
}
