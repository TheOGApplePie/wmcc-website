import { UpcomingEvent } from "../app/page";
import Image from "next/image";

interface EventPillAttributes {
  upcomingEvent: UpcomingEvent;
}
export default function EventPill({
  upcomingEvent,
}: Readonly<EventPillAttributes>) {
  const eventDate = new Date(upcomingEvent.startdate);
  return (
    <div className="border rounded-xl p-3 min-h-[300px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 event-pill items-center">
        <div className="col-span-1">
          <Image
            height={300}
            width={200}
            src={upcomingEvent.posterurl}
            alt={upcomingEvent.posteralt}
          />
        </div>
        <div className="col-span-1">
          <p className="px-2 text-lg">{upcomingEvent.title}</p>
          <p className="px-2 text-lg">{upcomingEvent.location}</p>
          <p className="px-2 text-lg">
            {eventDate.toLocaleString(undefined, {
              hour12: true,
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <button className="rounded py-4 px-2 hover:bg-[var(--secondary-colour-green-light)] hover:text-white text-[var(--main-colour-blue)] transition-colors">
              <a href={upcomingEvent.registrationlink}>Register here</a>
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
