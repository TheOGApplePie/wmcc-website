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
    <div className="container border rounded-sm p-3">
      <div className="grid grid-cols-2 event-pill">
        <div className="col-span-1">
          <Image
            className="img-fluid text-center"
            height={300}
            width={200}
            src={upcomingEvent.posterurl}
            alt={upcomingEvent.posteralt}
          />
        </div>
        <div className="col-span-1">
          <p className="text-lg">{upcomingEvent.title}</p>
          <p className="text-lg">{upcomingEvent.location}</p>
          <p className="text-lg">
            {eventDate.toLocaleString(undefined, {
              hour12: true,
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
