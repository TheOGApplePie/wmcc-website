import type { EventOccurrence } from "../app/schemas/events";

export const EVENT_TIME_ZONE = "America/Toronto";

export function eventHref(
  slug: string | null,
  session?: string,
  schedule?: string,
) {
  if (!slug) return "/events";
  const params = new URLSearchParams();
  if (schedule) params.set("schedule", schedule);
  if (session) params.set("session", session);
  const query = params.toString();
  return `/events/${encodeURIComponent(slug)}${query ? "?" + query : ""}`;
}

export function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIME_ZONE,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(value));
}

export function occurrenceStatus(session: EventOccurrence) {
  if (session.superseded)
    return "This session has been replaced. See the upcoming sessions below.";
  if (session.cancelled || session.schedule_cancelled)
    return "This session has been cancelled.";
  return null;
}
