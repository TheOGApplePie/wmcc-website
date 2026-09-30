import { RRule } from "rrule";
import type { CalendarSchedule } from "../app/schemas/events";
import { recurrenceOptions } from "../lib/upcoming-events";
import { EVENT_TIME_ZONE } from "../lib/events";

export default function EventScheduleSummary({ schedule }: Readonly<{ schedule: CalendarSchedule }>) {
  const zone = schedule.time_zone || EVENT_TIME_ZONE;
  const date = (value: string) => new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, month: "short", day: "numeric",
  }).format(new Date(value));
  const time = (value: string) => new Intl.DateTimeFormat("en-CA", {
    timeZone: zone, hour: "numeric", minute: "2-digit",
  }).format(new Date(value));
  const rule = schedule.recurrence_rule;
  const recurrence = rule ? new RRule(recurrenceOptions(schedule)) : null;
  let last: Date | null = null;
  if (recurrence && rule?.count) last = recurrence.all().at(-1) ?? null;
  else if (recurrence?.options.until) last = recurrence.before(recurrence.options.until, true);
  // RRule's dates here represent local wall time, so format them in UTC.
  const lastDate = last && new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC", month: "short", day: "numeric",
  }).format(last);
  return (
    <div className="min-w-0">
      <h3 className="text-xl sm:text-2xl font-semibold leading-snug">
        {date(schedule.start_at)}{lastDate && ` – ${lastDate}`}
        {rule && !lastDate && " onwards"}
      </h3>
      <p className="mt-1 text-base">
        {time(schedule.start_at)} – {time(schedule.end_at)}
      </p>
      {recurrence && <p className="mt-2 text-sm text-gray-600 capitalize">{recurrence.toText()}</p>}
      {rule?.exdates?.length ? <p className="mt-2 text-sm">Except {rule.exdates.map(date).join(", ")}</p> : null}
      {schedule.location && <p className="mt-2">{schedule.location}</p>}
    </div>
  );
}
