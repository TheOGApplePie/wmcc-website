import { getUpcomingEvents } from "../lib/public-content";
import EventPill from "./eventPill";
import ContentError from "./contentError";

export default async function HomeEvents() {
  let events;
  try {
    events = await getUpcomingEvents();
  } catch {
    return (
      <ContentError message="We couldn’t load upcoming events. Please try again." />
    );
  }
  if (!events.length)
    return (
      <output className="py-10">
        There are no upcoming events at this time, but stay tuned!
      </output>
    );
  return (
    <div className="flex flex-col sm:flex-row sm:overflow-x-auto py-10">
      {events.map((event) => (
        <div key={`${event.schedule_id}:${event.start_at}`} className="m-2">
          <EventPill upcomingEvent={event} />
        </div>
      ))}
    </div>
  );
}
