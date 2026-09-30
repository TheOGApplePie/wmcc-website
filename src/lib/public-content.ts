import "server-only";
import { upcomingEvents } from "./upcoming-events";
import { createClient } from "../utils/supabase/server";
import type {
  Announcement,
  CalendarEvent,
  EventOccurrence,
  PublicEvent,
  PublicSchedule,
} from "../app/schemas/events";

const EVENT_FIELDS =
  "id,navigation_slug,title,description,poster_url,poster_alt,location,call_to_action_link,call_to_action_caption,gallery_url";
const SESSION_FIELDS =
  "id,event_id,schedule_id,navigation_slug,title,description,poster_url,poster_alt,location,call_to_action_link,call_to_action_caption,gallery_url,start_at,end_at,cancelled,schedule_cancelled,superseded";

function checked<T>(data: T | null, error: unknown): T {
  if (error) {
    console.error("Public content query failed", error);
    throw new Error("Content is temporarily unavailable. Please try again.");
  }
  if (data === null)
    throw new Error("Content is temporarily unavailable. Please try again.");
  return data;
}

async function activeSessions() {
  const supabase = await createClient();
  return {
    query: supabase
      .from("resolved_event_occurrences")
      .select(SESSION_FIELDS)
      .eq("publication_status", "published")
      .eq("cancelled", false)
      .eq("schedule_cancelled", false)
      .eq("superseded", false)
      .order("start_at")
      .order("id"),
  };
}

// Advance by actual response length in case the project's row cap is below our page size.
export async function getSessionsInRange(
  start: Date,
  end: Date,
): Promise<EventOccurrence[]> {
  const sessions: EventOccurrence[] = [];
  for (;;) {
    const { query } = await activeSessions();
    const { data, error } = await query
      .lt("start_at", end.toISOString())
      .gt("end_at", start.toISOString())
      .range(sessions.length, sessions.length + 499);
    const page = checked(data, error) as EventOccurrence[];
    if (!page.length) return sessions;
    sessions.push(...page);
  }
}

export async function getUpcomingSessions(
  eventId?: number,
  offset = 0,
  limit = 5,
): Promise<EventOccurrence[]> {
  const sessions: EventOccurrence[] = [];
  const now = new Date().toISOString();
  while (sessions.length < limit) {
    const { query } = await activeSessions();
    let filtered = query.gt("end_at", now);
    if (eventId !== undefined) filtered = filtered.eq("event_id", eventId);
    const { data, error } = await filtered.range(
      offset + sessions.length,
      offset + limit - 1,
    );
    const page = checked(data, error) as EventOccurrence[];
    if (!page.length) break;
    sessions.push(...page);
  }
  return sessions;
}

export async function getPublicEvent(id: number): Promise<PublicEvent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .eq("publication_status", "published")
    .eq("id", id)
    .limit(1);
  return (checked(data, error) as PublicEvent[])[0] ?? null;
}

export async function getScheduleLabel(
  session: EventOccurrence,
): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_schedules")
    .select("label,events!inner(publication_status)")
    .eq("events.publication_status", "published")
    .eq("event_id", session.event_id)
    .eq("id", session.schedule_id)
    .limit(1);
  return checked(data, error)[0]?.label || null;
}

export async function getNextScheduleOccurrence(
  session: EventOccurrence,
): Promise<EventOccurrence | null> {
  const { query } = await activeSessions();
  const { data, error } = await query
    .eq("event_id", session.event_id)
    .eq("schedule_id", session.schedule_id)
    .gt("start_at", session.start_at)
    .gt("start_at", new Date().toISOString())
    .limit(1);
  return (checked(data, error) as EventOccurrence[])[0] ?? null;
}

export async function getEventsBySlug(slug: string): Promise<PublicEvent[]> {
  const supabase = await createClient();
  const events: PublicEvent[] = [];
  for (;;) {
    const { data, error } = await supabase
      .from("events")
      .select(EVENT_FIELDS)
      .eq("publication_status", "published")
      .eq("navigation_slug", slug)
      .order("id")
      .range(events.length, events.length + 499);
    const page = checked(data, error) as PublicEvent[];
    if (!page.length) return events;
    events.push(...page);
  }
}

export async function getSession(
  eventId: number,
  id: string,
): Promise<EventOccurrence | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resolved_event_occurrences")
    .select(SESSION_FIELDS)
    .eq("publication_status", "published")
    .eq("event_id", eventId)
    .eq("id", id)
    .limit(1);
  return (checked(data, error) as EventOccurrence[])[0] ?? null;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const announcements: Announcement[] = [];
  for (;;) {
    const { data, error } = await supabase
      .from("announcements")
      .select(
        "id,title,description,poster_url,poster_alt,call_to_action_link,call_to_action_caption",
      )
      .or(`publish_at.is.null,publish_at.lte.${now}`)
      .gt("expires_at", now)
      .order("display_order", { nullsFirst: false })
      .order("id")
      .range(announcements.length, announcements.length + 499);
    const page = checked(data, error) as Announcement[];
    if (!page.length) return announcements;
    announcements.push(...page);
  }
}

export async function getSimilarEvents(slug: string): Promise<PublicEvent[]> {
  const words = slug
    .split("-")
    .filter((word) => /^[a-zA-Z0-9]{3,40}$/.test(word))
    .slice(0, 5);
  if (!words.length) return [];
  const supabase = await createClient();
  const results = await Promise.all(
    words.map((word) =>
      supabase
        .from("events")
        .select(EVENT_FIELDS)
        .eq("publication_status", "published")
        .ilike("navigation_slug", `%${word}%`)
        .order("id")
        .limit(10),
    ),
  );
  const ranked = new Map<number, { event: PublicEvent; score: number }>();
  for (const result of results) {
    for (const event of checked(result.data, result.error) as PublicEvent[]) {
      const score = (ranked.get(event.id)?.score ?? 0) + 1;
      ranked.set(event.id, { event, score });
    }
  }
  return [...ranked.values()]
    .sort((a, b) => b.score - a.score || a.event.id - b.event.id)
    .slice(0, 3)
    .map((item) => item.event);
}

export async function getPublicSchedule(
  eventId: number,
  scheduleId: string,
): Promise<PublicSchedule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_schedules")
    .select(
      "id,event_id,label,start_at,end_at,poster_url,poster_alt,location,cancelled,events!inner(publication_status)",
    )
    .eq("events.publication_status", "published")
    .eq("event_id", eventId)
    .eq("id", scheduleId)
    .limit(1);
  return (checked(data, error) as PublicSchedule[])[0] ?? null;
}

export async function getEventSelection(
  event: PublicEvent,
  scheduleId?: string,
  sessionId?: string,
) {
  let session: EventOccurrence | null = null;
  if (sessionId) {
    session = await getSession(event.id, sessionId);
    if (!session) return null;
  } else if (!scheduleId) {
    session = (await getUpcomingSessions(event.id, 0, 1))[0] ?? null;
  }
  const selectedId = scheduleId ?? session?.schedule_id;
  const schedule = selectedId
    ? await getPublicSchedule(event.id, selectedId)
    : null;
  if (selectedId && !schedule) return null;
  // Validate the requested schedule before correcting a stale schedule/session pair.
  if (session && schedule && session.schedule_id !== schedule.id) {
    const currentSchedule = await getPublicSchedule(
      event.id,
      session.schedule_id,
    );
    if (!currentSchedule) return null;
    return { session, schedule, redirectScheduleId: currentSchedule.id };
  }
  return { session, schedule, redirectScheduleId: null };
}

export async function getNextForSchedule(
  schedule: PublicSchedule,
  session: EventOccurrence | null,
) {
  const now = new Date().toISOString();
  if (!schedule.cancelled) {
    const { query } = await activeSessions();
    let selected = query
      .eq("event_id", schedule.event_id)
      .eq("schedule_id", schedule.id)
      .gt("start_at", now);
    if (session) selected = selected.gt("start_at", session.start_at);
    const { data, error } = await selected.limit(1);
    const next = (checked(data, error) as EventOccurrence[])[0];
    if (next) return { next, changedSchedule: false };
  }
  const { query } = await activeSessions();
  const { data, error } = await query
    .eq("event_id", schedule.event_id)
    .neq("schedule_id", schedule.id)
    .gt("start_at", now)
    .limit(1);
  return {
    next: (checked(data, error) as EventOccurrence[])[0] ?? null,
    changedSchedule: true,
  };
}

export async function getCalendarEvents(
  eventId?: number,
): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const events: CalendarEvent[] = [];
  for (;;) {
    let query = supabase
      .from("events")
      .select(
        `${EVENT_FIELDS},event_schedules(id,event_id,label,start_at,end_at,time_zone,poster_url,poster_alt,location,cancelled,recurrence_rule(frequency,interval,by_weekdays,by_month_day,by_set_position,until,count,exdates))`,
      )
      .eq("publication_status", "published")
      .order("id");
    if (eventId !== undefined) query = query.eq("id", eventId);
    const { data, error } = await query
      .range(events.length, events.length + 499)
      .returns<CalendarEvent[]>();
    const page = checked(data, error);
    if (!page.length) return events;
    events.push(...page);
  }
}

export async function getUpcomingEvents() {
  return upcomingEvents(await getCalendarEvents());
}
