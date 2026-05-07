import z from "zod";

export const EventParams = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
});
export const OneEventParams = z.object({
  slug: z.string(),
});
export const FetchRecurringBaseEventsParams = z.object({});
export const SimilarEventsParams = z.object({
  slug: z.string(),
});

export interface WMCCEvent {
  id: string;
  poster_url?: string;
  poster_alt?: string;
  title: string;
  start_date: string | Date;
  end_date: string | Date;
  location: string;
  registration_link?: string;
  description: string;
  gallery_url?: string;
}

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

export interface SimilarEvent {
  id: number;
  navigation_slug: string;
  title: string;
  poster_url: string | null;
  poster_alt: string | null;
  start_date: string;
  location: string;
}

export interface RecurringBaseEvent {
  id: number;
  navigation_slug: string;
  poster_url: string | null;
  poster_alt: string | null;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  call_to_action_link: string | null;
  call_to_action_caption: string | null;
  description: string;
  recurrence_rule_id: string | null;
  recurrence_rule: RecurrenceRule | RecurrenceRule[] | null;
}
