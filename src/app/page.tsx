import CarouselComponent from "../components/Carousel";
import MasjidboxWidget from "../components/Masjidbox";
import EventPill from "../components/eventPill";
import Image from "next/image";
import { createClient } from "../utils/supabase/server";
import { headers } from "next/headers";
import { RRule, Weekday } from "rrule";

const FREQ_MAP: Record<string, number> = {
  DAILY: RRule.DAILY,
  WEEKLY: RRule.WEEKLY,
  MONTHLY: RRule.MONTHLY,
  YEARLY: RRule.YEARLY,
};

const WEEKDAY_MAP: Record<string, Weekday> = {
  MO: RRule.MO,
  TU: RRule.TU,
  WE: RRule.WE,
  TH: RRule.TH,
  FR: RRule.FR,
  SA: RRule.SA,
  SU: RRule.SU,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNextOccurrences(event: any, now: Date, limit = 5): Date[] {
  try {
    const rule = Array.isArray(event.recurrence_rule)
      ? event.recurrence_rule[0]
      : event.recurrence_rule;
    if (!rule) return [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: Record<string, any> = {
      freq: FREQ_MAP[rule.frequency.toUpperCase()] ?? RRule.WEEKLY,
      dtstart: new Date(event.start_date as string),
      tzid: "America/Toronto",
    };
    if (rule.interval && rule.interval > 1) options.interval = rule.interval;
    if (rule.by_weekdays?.length) {
      options.byweekday = rule.by_weekdays
        .map((d: string) => WEEKDAY_MAP[d.toUpperCase()])
        .filter(Boolean);
    }
    if (rule.by_month_day) options.bymonthday = rule.by_month_day;
    if (rule.by_set_position?.length) options.bysetpos = rule.by_set_position;
    if (rule.until) options.until = new Date(rule.until);
    if (rule.count) options.count = rule.count;

    const r = new RRule(options);
    const results: Date[] = [];
    let cursor = now;
    let inclusive = true;
    for (let i = 0; i < limit; i++) {
      const next = r.after(cursor, inclusive);
      if (!next) break;
      results.push(next);
      cursor = next;
      inclusive = false;
    }
    return results;
  } catch {
    return [];
  }
}

export interface Announcement {
  id: number;
  title: string;
  description: string;
  poster_url: string;
  call_to_action_link: string;
  poster_alt: string;
  call_to_action_caption: string;
}
export interface UpcomingEvent {
  id: number;
  poster_url: string;
  poster_alt: string;
  title: string;
  start_date: string;
  location: string;
  call_to_action_caption: string;
  call_to_action_link: string;
}
export default async function Home() {
  const xnonceHeader = (await headers()).get("x-nonce") || "";
  const supabase = await createClient();
  const today = new Date();
  let slides: Announcement[] = [];
  let currentEvents: UpcomingEvent[] = [];
  try {
    const [announcementsRes, nonRecurringRes, recurringRes] = await Promise.all(
      [
        supabase
          .from("announcements")
          .select(
            "id,title,description,poster_url,call_to_action_link,poster_alt,call_to_action_caption",
          )
          .gt("expires_at", today.toISOString()),
        supabase
          .from("events")
          .select(
            "id, poster_url, poster_alt, title, start_date, location, call_to_action_caption, call_to_action_link",
          )
          .is("recurrence_rule_id", null)
          .gte("start_date", today.toISOString())
          .order("start_date", { ascending: true }),
        supabase
          .from("events")
          .select(
            "id, poster_url, poster_alt, title, start_date, location, call_to_action_caption, call_to_action_link, recurrence_rule_id, recurrence_rule(frequency, interval, by_weekdays, by_month_day, by_set_position, until, count)",
          )
          .not("recurrence_rule_id", "is", null),
      ],
    );

    slides = announcementsRes.data || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recurringUpcoming: UpcomingEvent[] = (recurringRes.data ?? ([] as any[]))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .flatMap((event: any) =>
        getNextOccurrences(event, today, 5).map((next) => ({
          id: event.id,
          poster_url: event.poster_url,
          poster_alt: event.poster_alt,
          title: event.title,
          start_date: next.toISOString(),
          location: event.location,
          call_to_action_caption: event.call_to_action_caption,
          call_to_action_link: event.call_to_action_link,
        })),
      );

    currentEvents = [...(nonRecurringRes.data ?? []), ...recurringUpcoming]
      .sort(
        (a, b) =>
          new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
      )
      .slice(0, 5);
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      <section>
        <CarouselComponent content={slides}></CarouselComponent>
      </section>
      <section>
        <MasjidboxWidget xnonceHeader={xnonceHeader} />
      </section>
      <section>
        <div className="border-t-4 px-8 py-14 bg-[var(--main-colour-blue)] text-white">
          <h1 className="text-4xl pb-8">About Us</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="md:col-span-1 col-span-2 ">
              <Image
                className="object-cover rounded-2xl"
                src={"/community-dua.jpg"}
                alt="About us"
                height={700}
                width={700}
              />
            </div>
            <div className="md:col-span-1 col-span-2">
              <p className="text-md md:text-2xl">
                The Waterdown Muslim Community Centre (WMCC) is a registered
                charitable organization devoted to uplifting and connecting
                Muslim families in Waterdown, Hamilton, and neighbouring areas.
              </p>
              <p className="text-md md:text-2xl my-3">
                Rooted in the values of inclusivity, unity, and collaboration,
                WMCC offers charitable, educational, spiritual, and social
                programs designed to nurture personal growth, strengthen
                families, and build a vibrant, faith-centered community—all
                guided by the teachings of the Qur'an and Sunnah.
              </p>
              <p className="text-md md:text-2xl">
                We believe in the power of togetherness. By fostering meaningful
                engagement, joyful experiences, and a strong sense of belonging,
                WMCC strives to create enriching opportunities that celebrate
                the beauty and purpose of living a balanced Islamic life.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="border-t-4 w-full px-8 py-14 ">
          <h1 className="text-4xl">Current and upcoming events</h1>
          {currentEvents?.length ? (
            <div className="flex flex-col sm:flex-row sm:overflow-x-scroll py-10">
              {currentEvents?.map((upcomingEvent) => (
                <div key={`${upcomingEvent.id}-${upcomingEvent.start_date}`} className="m-2">
                  <EventPill upcomingEvent={upcomingEvent}></EventPill>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-10">
              <div className="bg-[var(--warning-colour)] flex items-center px-5 py-10 border-t-slate-400 rounded-2xl">
                <Image
                  src="/wmcc-black.png"
                  alt="wmcc white logo"
                  height="80"
                  width="80"
                />
                <h2 className="text-2xl px-5">
                  There are no upcoming events at this time, but stay tuned!
                </h2>
              </div>
            </div>
          )}
        </div>
      </section>
      <section>
        <div className="border-t-4 bg-[var(--main-colour-blue)] text-white">
          <div className="p-8">
            <h1 className="text-4xl">
              Help support the WMCC and donate today!
            </h1>
          </div>
          <div className="sm:p-8 flex items-center justify-center">
            <iframe
              // src="https://app.irm.io/wmcc.ca/operations"
              src="https://www.zeffy.com/en-CA/donation-form/donate-to-support-our-community-centre"
              width={850}
              height={600}
              title="WMCC Operations Donation"
              sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
              referrerPolicy="strict-origin"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
