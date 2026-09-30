import type { EventInput } from "@fullcalendar/core";
import type {
  CalendarEvent,
  CalendarSelection,
  RecurrenceRule,
} from "../app/schemas/events";
import { eventPoster } from "./event-poster";
import { EVENT_TIME_ZONE } from "./events";

export function toFloatingTime(isoDate: string, timeZone: string): string {
  const date = new Date(isoDate);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

interface FCRRuleInput {
  freq: string;
  dtstart: string;
  interval?: number;
  byweekday?: string[];
  bymonthday?: number;
  bysetpos?: number[];
  until?: string;
  count?: number;
}

function buildRRuleObj(
  dtstart: string,
  rule: RecurrenceRule,
  timeZone: string,
): FCRRuleInput {
  const options: FCRRuleInput = {
    freq: rule.frequency.toUpperCase(),
    dtstart: toFloatingTime(dtstart, timeZone),
  };
  if (rule.interval && rule.interval > 1) options.interval = rule.interval;
  if (rule.by_weekdays?.length) options.byweekday = rule.by_weekdays;
  if (rule.by_month_day) options.bymonthday = rule.by_month_day;
  if (rule.by_set_position?.length) options.bysetpos = rule.by_set_position;
  if (rule.until) options.until = toFloatingTime(rule.until, timeZone);
  if (rule.count) options.count = rule.count;
  return options;
}

export function calendarEventInputs(events: CalendarEvent[]): EventInput[] {
  return events.flatMap((event) => event.event_schedules
    .filter((schedule) => !schedule.cancelled)
    .map((schedule) => {
      const timeZone = schedule.time_zone || EVENT_TIME_ZONE;
      const poster = eventPoster(event, schedule);
      const selection: CalendarSelection = {
        ...event,
        event_id: event.id,
        schedule_id: schedule.id,
        start_at: schedule.start_at,
        end_at: schedule.end_at,
        poster_url: poster.src,
        poster_alt: poster.alt,
        location: schedule.location ?? event.location,
        cancelled: false,
        schedule_cancelled: false,
        superseded: false,
      };
      const input: EventInput = {
        id: schedule.id,
        title: event.title,
        extendedProps: { selection },
      };
      if (!schedule.recurrence_rule) {
        return { ...input, start: schedule.start_at, end: schedule.end_at };
      }
      return {
        ...input,
        rrule: buildRRuleObj(schedule.start_at, schedule.recurrence_rule, timeZone),
        duration: {
          milliseconds:
            new Date(schedule.end_at).getTime() - new Date(schedule.start_at).getTime(),
        },
        exdate: schedule.recurrence_rule.exdates?.map((date) =>
          toFloatingTime(date, timeZone),
        ) ?? [],
      };
    }));
}
