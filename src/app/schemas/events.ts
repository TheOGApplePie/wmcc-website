import z from "zod";

export const EventParams = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
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
}
