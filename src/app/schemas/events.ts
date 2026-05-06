import z from "zod";

export const EventParams = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
});
export const OneEventParams = z.object({
  slug: z.string(),
});
export const FetchRecurringBaseEventsParams = z.object({});

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
