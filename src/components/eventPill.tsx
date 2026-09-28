import Image from "./eventPoster";
import Link from "next/link";
import type { EventOccurrence } from "../app/schemas/events";
import { eventHref, formatEventTime } from "../lib/events";

export default function EventPill({
  upcomingEvent: event,
}: Readonly<{ upcomingEvent: EventOccurrence }>) {
  return (
    <Link
      href={eventHref(event.navigation_slug, event.id, event.schedule_id)}
      className="border rounded-xl p-3 min-h-[325px] block hover:shadow-md transition-shadow"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[450px] sm:w-[450px] items-center">
        <Image
          height={300}
          width={200}
          src={event.poster_url || "/wmcc-black.png"}
          alt={event.poster_alt ?? event.title}
        />
        <div>
          <p className="px-2 text-lg">{event.title}</p>
          <p className="px-2 text-lg">
            {event.location || "Location to be announced"}
          </p>
          <p className="px-2 text-lg">
            <time dateTime={event.start_at}>
              {formatEventTime(event.start_at)}
            </time>
          </p>
          <p className="px-2 text-sm">
            Ends{" "}
            <time dateTime={event.end_at}>{formatEventTime(event.end_at)}</time>
          </p>
          <span className="btn-primary inline-block mt-2">Learn more</span>
        </div>
      </div>
    </Link>
  );
}
