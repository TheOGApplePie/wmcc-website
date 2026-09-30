import type { PublicEvent, PublicSchedule } from "../app/schemas/events";

export function eventPoster(
  event: PublicEvent,
  schedule?: PublicSchedule | null,
) {
  if (schedule?.poster_url?.trim()) {
    return {
      src: schedule.poster_url,
      alt: schedule.poster_alt?.trim() || event.title,
    };
  }
  return {
    src: event.poster_url || "/wmcc-black.png",
    alt: event.poster_alt?.trim() || event.title,
  };
}
