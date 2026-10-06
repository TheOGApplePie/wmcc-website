import Loading from "../../../components/loading";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import {
  getEventsBySlug,
  getEventSelection,
  getCalendarEvents,
} from "../../../lib/public-content";
import { EventDetailParams } from "../../schemas/events";
import { eventPoster } from "../../../lib/event-poster";
import EventPoster from "../../../components/eventPoster";
import EventGallery from "../../../components/eventGallery";
import EventScheduleSummary from "../../../components/eventScheduleSummary";
import { upcomingEvents } from "../../../lib/upcoming-events";
import SessionDetails from "../../../components/sessionDetails";
import EventLocation from "../../../components/eventLocation";
import CTALink from "../../../components/CTALink";
import { eventHref, programPageHref, EVENT_TIME_ZONE } from "../../../lib/events";
import { SITE_ORIGIN } from "../../../lib/site";
import CognitoForm from "../../../components/cognitoForm";

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
  const programHref = programPageHref(slug);
  if (programHref) permanentRedirect(programHref);
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
  const programHref = programPageHref(slug);
  if (programHref) permanentRedirect(programHref);
  const parsed = EventDetailParams.safeParse(await searchParams);
  if (!parsed.success) notFound();
  const search = parsed.data;
  const event = await getEvent(slug);
  const [scheduledEvent] = await getCalendarEvents(event.id);
  if (!scheduledEvent) notFound();
  const selection =
    search.schedule || search.session
      ? await getEventSelection(event, search.schedule, search.session)
      : null;
  if ((search.schedule || search.session) && !selection) notFound();
  if (selection?.redirectScheduleId) {
    redirect(eventHref(slug, search.session, selection.redirectScheduleId));
  }
  const schedules = scheduledEvent.event_schedules
    .filter((schedule) => !schedule.cancelled)
    .sort((a, b) => Date.parse(a.start_at) - Date.parse(b.start_at));
  const next = upcomingEvents([scheduledEvent], new Date(), 1)[0];
  const nextSchedule = schedules.find(
    (schedule) => schedule.id === next?.schedule_id,
  );
  const poster = eventPoster(event, selection?.schedule);
  const timeZone = nextSchedule?.time_zone || EVENT_TIME_ZONE;
  const location = next?.location ?? event.location;
  const directions = location
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`
    : null;
  const date = (value: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  const time = (value: string) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  const calendarParams =
    next &&
    new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${new Date(next.start_at)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}/${new Date(next.end_at)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      details: `${event.description || ""}\n${SITE_ORIGIN}/events/${encodeURIComponent(slug)}`,
      location: location || "",
      ctz: timeZone,
    });

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 sm:py-12">
      <CTALink href="/events">Back to Events</CTALink>
      <h1 className="flex text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mt-8 mb-10 justify-center">
        {event.title}
      </h1>
      <section
        className="grid md:grid-cols-2 gap-8 md:gap-12 pb-12"
        aria-labelledby="next-session-heading"
      >
        <div>
          <EventPoster
            src={poster.src}
            alt={poster.alt}
            height={700}
            width={800}
            className="w-full max-h-[700px] rounded-xl object-contain object-top"
          />
        </div>
        <div className="">
          <div className="flex flex-wrap gap-3">
            {calendarParams && (
              <CTALink
                href={`https://calendar.google.com/calendar/render?${calendarParams}`}
              >
                Add to calendar
              </CTALink>
            )}
            {next && directions && (
              <CTALink href={directions}>Directions</CTALink>
            )}
            {next && event.call_to_action_link && (
              <CTALink href={event.call_to_action_link}>
                {event.call_to_action_caption}
              </CTALink>
            )}
            {next && event.cognito_form_id && (
              <a className="btn-primary" href="#sign-up-form">
                Register Now
              </a>
            )}
          </div>
          {next ? (
            <>
              <h3
                id="next-session-heading"
                className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-6"
              >
                Next session
              </h3>
              <p className="text-xl">
                <time dateTime={next.start_at}>{date(next.start_at)}</time>
              </p>
              <p className="text-xl mt-3">
                {time(next.start_at)} – {time(next.end_at)}{" "}
                {timeZone.replaceAll("_", " ")}
              </p>
            </>
          ) : (
            <>
              <section className="" aria-labelledby="schedule-heading">
                <h3
                  id="schedule-heading"
                  className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug"
                >
                  Schedule
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                  {schedules.map((schedule) => (
                    <EventScheduleSummary
                      key={schedule.id}
                      schedule={schedule}
                    />
                  ))}
                  {!schedules.length && (
                    <p className="col-span-full">
                      No active schedules at this time.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
          <section className="mt-5" aria-labelledby="about-heading">
            <h3
              id="about-heading"
              className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-5"
            >
              About
            </h3>
            <p className="text-lg leading-relaxed whitespace-pre-wrap">
              {event.description || "More details will be shared soon."}
            </p>
            <div></div>
          </section>
        </div>
      </section>
      <section className="border-t py-5" aria-labelledby="location-heading">
        <h3
          id="location-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-6"
        >
          Location
        </h3>
        <EventLocation location={location} />
      </section>
      {selection?.session && (
        <section className="border-t py-8" aria-label="Selected session">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-4">
            Selected session
          </h3>
          <SessionDetails session={selection.session} />
        </section>
      )}
      {next && event.cognito_form_id && (
        <section
          id="sign-up-form"
          className="border-t py-5"
          aria-labelledby="sign-up-heading"
        >
          <h3
            id="sign-up-heading"
            className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-6"
          >
            Register for this event today!
          </h3>
          <CognitoForm formId={event.cognito_form_id} />
        </section>
      )}
      {event.gallery_url && (
        <Suspense fallback={<Loading inline label="Loading gallery…" />}>
          <EventGallery url={event.gallery_url} />
        </Suspense>
      )}
    </main>
  );
}
