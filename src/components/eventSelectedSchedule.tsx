import Link from "next/link";
import type { EventOccurrence, PublicSchedule } from "../app/schemas/events";
import { getNextForSchedule } from "../lib/public-content";
import { eventHref } from "../lib/events";
import ContentError from "./contentError";
import SessionDetails from "./sessionDetails";

export default async function EventSelectedSchedule({
  schedule,
  session,
}: Readonly<{
  schedule: PublicSchedule;
  session: EventOccurrence | null;
}>) {
  let result;
  try {
    result = await getNextForSchedule(schedule, session);
  } catch {
    return (
      <ContentError message="We couldn’t load the next occurrence. Please try again." />
    );
  }
  const { next, changedSchedule } = result;
  return (
    <section className="py-6" aria-labelledby="next-occurrence-heading">
      <h2 id="next-occurrence-heading" className="text-2xl mb-4">
        Next occurrence
      </h2>
      {next && (
        <>
          {changedSchedule && (
            <p className="mb-4">
              There are no further upcoming occurrences in the selected
              schedule. Here is the next occurrence from another active schedule
              for this event.
            </p>
          )}
          <SessionDetails session={next} />
          <Link
            className="underline inline-block mt-2"
            href={eventHref(next.navigation_slug, next.id, next.schedule_id)}
          >
            View this occurrence
          </Link>
        </>
      )}
      {!next && (
        <output>No further occurrences are scheduled for this event.</output>
      )}
    </section>
  );
}
