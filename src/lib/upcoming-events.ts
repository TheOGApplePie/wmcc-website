import { DateTime } from "luxon";
import { RRule, type Options } from "rrule";
import type {
  CalendarEvent,
  CalendarSelection,
  CalendarSchedule,
} from "../app/schemas/events";
import { calendarEventInputs, toFloatingTime } from "./calendar-events";
import { EVENT_TIME_ZONE } from "./events";

export function recurrenceOptions(
  schedule: CalendarSchedule,
): Partial<Options> {
  const rule = schedule.recurrence_rule!;
  const timeZone = schedule.time_zone || EVENT_TIME_ZONE;
  const floating = (value: string) =>
    new Date(`${toFloatingTime(value, timeZone)}Z`);
  const options: Partial<Options> = {
    ...RRule.parseString(`FREQ=${rule.frequency.toUpperCase()}`),
    dtstart: floating(schedule.start_at),
    interval: rule.interval ?? 1,
  };
  if (rule.by_weekdays?.length) {
    options.byweekday = RRule.parseString(
      `BYDAY=${rule.by_weekdays.join(",").toUpperCase()}`,
    ).byweekday;
  }
  if (rule.by_month_day) options.bymonthday = rule.by_month_day;
  if (rule.by_set_position?.length) options.bysetpos = rule.by_set_position;
  if (rule.count) options.count = rule.count;
  if (rule.until) options.until = floating(rule.until);
  return options;
}

function scheduleOccurrences(
  event: CalendarEvent,
  schedule: CalendarSchedule,
  now: Date,
  limit: number,
): CalendarSelection[] {
  if (schedule.cancelled) return [];
  const [input] = calendarEventInputs([
    { ...event, event_schedules: [schedule] },
  ]);
  const selection = input.extendedProps!.selection as CalendarSelection;
  const duration = Date.parse(schedule.end_at) - Date.parse(schedule.start_at);
  if (!(duration > 0)) return [];
  const rule = schedule.recurrence_rule;
  if (!rule) return new Date(schedule.end_at) > now ? [selection] : [];
  const recurrence = new RRule(recurrenceOptions(schedule));
  const exclusions = new Set(rule.exdates?.map((value) => Date.parse(value)));
  const candidates: CalendarSelection[] = [];
  // Include sessions already underway, matching the homepage's existing behavior.
  const timeZone = schedule.time_zone || EVENT_TIME_ZONE;
  const earliest = new Date(now.getTime() - duration);
  let cursor = new Date(`${toFloatingTime(earliest.toISOString(), timeZone)}Z`);
  while (candidates.length < limit) {
    const localStart = recurrence.after(cursor, false);
    if (!localStart) break;
    cursor = localStart;
    const start = DateTime.fromISO(localStart.toISOString().slice(0, -1), {
      zone: timeZone,
    }).toJSDate();
    if (rule.until && start > new Date(rule.until)) break;
    if (exclusions.has(start.getTime())) continue;
    candidates.push({
      ...selection,
      start_at: start.toISOString(),
      end_at: new Date(start.getTime() + duration).toISOString(),
    });
  }
  return candidates;
}

// Collect at most `limit` dates per schedule before selecting the earliest overall.
export function upcomingEvents(
  events: CalendarEvent[],
  now = new Date(),
  limit = 5,
): CalendarSelection[] {
  if (limit <= 0) return [];
  return events
    .flatMap((event) =>
      event.event_schedules.flatMap((schedule) =>
        scheduleOccurrences(event, schedule, now, limit),
      ),
    )
    .sort(
      (a, b) =>
        Date.parse(a.start_at) - Date.parse(b.start_at) ||
        a.schedule_id.localeCompare(b.schedule_id),
    )
    .slice(0, limit);
}
