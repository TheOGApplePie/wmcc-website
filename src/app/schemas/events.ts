import z from "zod";

export const EventParams = z
  .object({
    start: z.coerce.date(),
    end: z.coerce.date(),
  })
  .refine(
    ({ start, end }) =>
      end > start && end.getTime() - start.getTime() <= 93 * 86400000,
    "Choose a date range of up to 93 days.",
  );

export interface PublicEvent {
  id: number;
  navigation_slug: string | null;
  title: string;
  description: string | null;
  poster_url: string | null;
  poster_alt: string | null;
  location: string | null;
  call_to_action_link: string | null;
  call_to_action_caption: string | null;
  gallery_url: string | null;
}

export interface EventOccurrence extends Omit<PublicEvent, "id"> {
  id: string;
  event_id: number;
  schedule_id: string;
  start_at: string;
  end_at: string;
  cancelled: boolean;
  schedule_cancelled: boolean;
  superseded: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  description: string | null;
  poster_url: string | null;
  poster_alt: string | null;
  call_to_action_link: string | null;
  call_to_action_caption: string | null;
}

export interface PublicSchedule {
  id: string;
  event_id: number;
  label: string | null;
  start_at: string;
  end_at: string;
  poster_url: string | null;
  poster_alt: string | null;
  location: string | null;
  cancelled: boolean;
}

export const EventDetailParams = z.object({
  schedule: z.uuid().optional(),
  session: z.uuid().optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
});

export interface RecurrenceRule {
  frequency: string;
  interval?: number | null;
  by_weekdays?: string[] | null;
  by_month_day?: number | null;
  by_set_position?: number[] | null;
  until?: string | null;
  count?: number | null;
  exdates?: string[] | null;
}

export interface CalendarSchedule extends PublicSchedule {
  time_zone: string;
  recurrence_rule: RecurrenceRule | null;
}

export interface CalendarEvent extends PublicEvent {
  event_schedules: CalendarSchedule[];
}

export type CalendarSelection = Omit<EventOccurrence, "id">;
