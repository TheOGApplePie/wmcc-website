import Image from "./eventPoster";
import type { EventOccurrence } from "../app/schemas/events";
import { formatEventTime, occurrenceStatus } from "../lib/events";

export default function SessionDetails({
  session,
}: Readonly<{ session: EventOccurrence }>) {
  const status = occurrenceStatus(session);
  return (
    <article className="border rounded-xl p-4">
      {status && <output className="font-semibold mb-3">{status}</output>}
      <div className="flex flex-col sm:flex-row gap-4">
        <Image
          src={session.poster_url || "/wmcc-black.png"}
          alt={session.poster_alt ?? session.title}
          width={180}
          height={240}
          className="object-contain"
        />
        <div>
          <p>
            <time dateTime={session.start_at}>
              {formatEventTime(session.start_at)}
            </time>
          </p>
          <p>
            Ends{" "}
            <time dateTime={session.end_at}>
              {formatEventTime(session.end_at)}
            </time>
          </p>
          <p>{session.location || "Location to be announced"}</p>
        </div>
      </div>
    </article>
  );
}
