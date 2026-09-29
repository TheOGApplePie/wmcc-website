import Loading from "../../../components/loading";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getEventsBySlug,
  getEventSelection,
} from "../../../lib/public-content";
import { EventDetailParams } from "../../schemas/events";
import EventPoster from "../../../components/eventPoster";
import EventGallery from "../../../components/eventGallery";
import EventSelectedSchedule from "../../../components/eventSelectedSchedule";
import SessionDetails from "../../../components/sessionDetails";
import EventLocation from "../../../components/eventLocation";
import CTALink from "../../../components/CTALink";
import { eventHref, formatEventTime } from "../../../lib/events";
import { SITE_ORIGIN } from "../../../lib/site";

type Props = Readonly<{
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>;

// Share the published event lookup between metadata and rendering within a request.
const getEvent = cache(async (slug: string) => {
  const events = await getEventsBySlug(slug);
  if (!events.length) notFound();
  if (events.length !== 1)
    throw new Error("Duplicate event slug requires reconciliation.");
  return events[0];
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  const description =
    event.description?.replace(/\s+/g, " ").trim() ||
    `View dates, times and details for ${event.title} at the Waterdown Muslim Community Centre.`;
  const title = `${event.title} | WMCC`;
  const canonical = `${SITE_ORIGIN}/events/${encodeURIComponent(slug)}`;
  const images = event.poster_url
    ? [{ url: event.poster_url, alt: event.poster_alt || event.title }]
    : [];

  return {
    title: event.title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: "WMCC",
      url: canonical,
      title,
      description,
      images,
    },
    twitter: {
      card: event.poster_url ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export default async function EventPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const parsed = EventDetailParams.safeParse(await searchParams);
  if (!parsed.success) notFound();
  const search = parsed.data;
  const event = await getEvent(slug);
  const selection = await getEventSelection(
    event,
    search.schedule,
    search.session,
  );
  if (!selection) notFound();
  if (selection.redirectScheduleId) {
    const target = eventHref(slug, search.session, selection.redirectScheduleId);
    redirect(`${target}&page=${search.page}`);
  }
  const { session, schedule } = selection;
  const poster = schedule?.poster_url ? schedule : event;
  const displayed = session ?? poster;
  const location = session?.location ?? schedule?.location ?? event.location;

  return (
    <main className="max-w-5xl mx-auto p-6">
      <CTALink href="/events">
        ← Back to events
      </CTALink>
      <h1 className="text-3xl my-6">{event.title}</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <EventPoster
          src={displayed.poster_url || "/wmcc-black.png"}
          alt={displayed.poster_alt ?? event.title}
          height={700}
          width={800}
          className="rounded-xl object-contain"
        />
        <div>
          <p className="text-xl whitespace-pre-wrap">{event.description}</p>
          <EventLocation location={location} />
          {event.call_to_action_link && (
            <CTALink href={event.call_to_action_link}>
              {event.call_to_action_caption || "Learn more"}
            </CTALink>
          )}
        </div>
      </div>
      {schedule && (
        <section className="pt-8" aria-labelledby="selected-schedule-heading">
          <h2 id="selected-schedule-heading" className="text-2xl mb-4">
            Selected schedule
          </h2>
          {schedule.label && <p className="text-xl mb-4">{schedule.label}</p>}
          {schedule.cancelled && (
            <output className="block mb-4">
              This schedule has been cancelled.
            </output>
          )}
          {session && <SessionDetails session={session} />}
          {!session && (
            <div>
              <p>
                First session:{" "}
                <time dateTime={schedule.start_at}>
                  {formatEventTime(schedule.start_at)}
                </time>
              </p>
              <p>
                Ends{" "}
                <time dateTime={schedule.end_at}>
                  {formatEventTime(schedule.end_at)}
                </time>
              </p>
            </div>
          )}
          <Suspense
            key={session?.id ?? schedule.id}
            fallback={
              <Loading inline label="Loading next occurrence…" />
            }
          >
            <EventSelectedSchedule schedule={schedule} session={session} />
          </Suspense>
        </section>
      )}
      {!schedule && (
        <output className="block py-8">No upcoming sessions scheduled.</output>
      )}
      {event.gallery_url && (
        <Suspense fallback={<Loading inline label="Loading gallery…" />}>
          <EventGallery url={event.gallery_url} />
        </Suspense>
      )}
    </main>
  );
}
