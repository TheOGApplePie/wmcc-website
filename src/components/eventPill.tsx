import { UpcomingEvent } from "../app/page";
import Image from "next/image";

interface EventPillAttributes {
  upcomingEvent: UpcomingEvent;
}
export default function EventPill({
  upcomingEvent,
}: Readonly<EventPillAttributes>) {
  const eventDate = new Date(upcomingEvent.start_date);
  return (
    <div className="border rounded-xl p-3 min-h-[325px]">
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
              alt={upcomingEvent.poster_alt}
            />
          </div>
        )}
        <div className="col-span-1">
          <p className="px-2 text-lg">{upcomingEvent.title}</p>
          <p className="px-2 text-lg">{upcomingEvent.location}</p>
          <p className="px-2 text-lg">
            {eventDate.toLocaleString("en-CA", {
              dateStyle: "full",
              timeStyle: "medium",
            })}
          </p>
          {upcomingEvent.call_to_action_link && (
            <p>
              <button className="rounded py-4 px-2 hover:bg-[var(--secondary-colour-green-light)] hover:text-white text-[var(--main-colour-blue)] transition-colors">
                <a href={upcomingEvent.call_to_action_link}>
                  {upcomingEvent.call_to_action_caption}
                </a>
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
