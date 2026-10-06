import type { EventOccurrence } from "../app/schemas/events";

export const EVENT_TIME_ZONE = "America/Toronto";

// Match complete program names, not unrelated events mentioning a school.
const programRoutes: Record<string, string> = {
  "wmcc-weekend-school": "/wmcc-weekend-school",
  "wmcc-sunday-arabic-school": "/wmcc-sunday-arabic-school",
  "wmcc-quran-program": "/wmcc-quran-program",
};

export function calendarEventHref(event: {
  navigation_slug: string | null;
  title: string;
  schedule_id: string;
}) {
  for (const name of [event.navigation_slug, event.title]) {
    const key = (name || "")
      .toLowerCase()
      .trim()
      .replace(/['’]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^wmcc-/, "");
    if (Object.hasOwn(programRoutes, key)) return programRoutes[key];
  }
  return event.navigation_slug
    ? eventHref(event.navigation_slug, undefined, event.schedule_id)
    : null;
}

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
