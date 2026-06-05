import { UpcomingEvent } from "../app/page";
import Image from "next/image";
import Link from "next/link";

interface EventPillAttributes {
  upcomingEvent: UpcomingEvent;
}
export default function EventPill({
  upcomingEvent,
}: Readonly<EventPillAttributes>) {
  const eventDate = new Date(upcomingEvent.start_date);
  return (
    <Link
      href={`/events/${upcomingEvent.navigation_slug}`}
      className="border rounded-xl p-3 min-h-[325px] block hover:shadow-md transition-shadow"
    >
      <div
        className={`grid grid-cols-1 ${
          upcomingEvent.poster_url && "sm:grid-cols-2"
        } gap-4 max-w-[450px] sm:w-[450px] items-center`}
      >
        {upcomingEvent.poster_url && (
          <div className="col-span-1">
            <Image
              height={300}
              width={200}
              src={upcomingEvent.poster_url}
              alt={upcomingEvent.poster_alt ?? ""}
            />
          </div>
        )}
        <div className="col-span-1">
          <p className="px-2 text-lg">{upcomingEvent.title}</p>
          <p className="px-2 text-lg">{upcomingEvent.location}</p>
          <p className="px-2 text-lg">
            {new Date(eventDate).toLocaleString("en-CA", {
              timeZone: "America/Toronto",
              dateStyle: "full",
              timeStyle: "medium",
            })}
          </p>
          <span className="btn-primary inline-block mt-2">Learn more</span>
        </div>
      </div>
    </Link>
  );
}
