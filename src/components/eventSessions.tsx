import Link from "next/link";
import { getUpcomingSessions } from "../lib/public-content";
import type { PublicEvent } from "../app/schemas/events";
import { eventHref } from "../lib/events";
import ContentError from "./contentError";
import SessionDetails from "./sessionDetails";

export default async function EventSessions({
  event,
  page,
  selectedSessionId,
  selectedScheduleId,
}: Readonly<{
  event: PublicEvent;
  page: number;
  selectedSessionId?: string;
  selectedScheduleId?: string;
}>) {
  let sessions;
  try {
    sessions = await getUpcomingSessions(event.id, (page - 1) * 20, 21);
  } catch {
    return (
      <ContentError message="We couldn’t load upcoming sessions. Please try again." />
    );
  }
  const base = eventHref(
    event.navigation_slug,
    selectedSessionId,
    selectedScheduleId,
  );
  const separator = selectedSessionId || selectedScheduleId ? "&" : "?";
  return (
    <section className="py-8">
      <h2 className="text-2xl mb-4">Upcoming sessions</h2>
      {!sessions.length && (
        <output>No upcoming sessions scheduled on this page.</output>
      )}
      <ul className="space-y-4">
        {sessions.slice(0, 20).map((session) => (
          <li key={session.id}>
            <SessionDetails session={session} />
            <Link
              className="underline inline-block my-2"
              href={eventHref(
                event.navigation_slug,
                session.id,
                session.schedule_id,
              )}
            >
              Link to this session
            </Link>
          </li>
        ))}
      </ul>
      <nav aria-label="Session pages" className="flex gap-6 mt-4">
        {page > 1 && (
          <Link href={`${base}${separator}page=${page - 1}`}>
            Previous sessions
          </Link>
        )}
        {sessions.length > 20 && (
          <Link href={`${base}${separator}page=${page + 1}`}>
            More sessions
          </Link>
        )}
      </nav>
    </section>
  );
}
