import CarouselComponent from "../components/Carousel";
import MasjidboxWidget from "../components/Masjidbox";
import EventPill from "../components/eventPill";
import Image from "next/image";
import { createClient } from "../utils/supabase/server";

export interface Slide {
  id: number;
  posterurl: string;
  registrationlink: string;
  caption: string;
  posteralt: string;
  buttoncaption: string;
}
export interface UpcomingEvent {
  id: number;
  posterurl: string;
  posteralt: string;
  title: string;
  startdate: string;
  location: string;
}
export default async function Home() {
  const supabase = await createClient();
  const { data: slides } = await supabase
    .from("events")
    .select("id,posterurl,registrationlink,caption,posteralt,buttoncaption")
    .eq("featureinslideshow", true);

  const { data: currentEvents } = await supabase
    .from("events")
    .select("id, posterurl,posteralt,title,startdate, location")
    .gte("startdate", new Date().toISOString())
    .order("startdate", { ascending: true });

  return (
    <div>
      <section>
        <CarouselComponent
          content={(slides as Slide[]) || []}
        ></CarouselComponent>
      </section>
      <section>
        <MasjidboxWidget />
      </section>
      <section>
        <div className="border-t-4 p-8 bg-[var(--main-colour-blue)] text-white">
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
                guided by the teachings of the Qur’an and Sunnah.
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
        <div className="border-t-4 w-full p-6">
          <h1 className="text-4xl">Current and upcoming events</h1>
          {currentEvents.length ? (
            <div className="flex overflow-x-scroll py-10">
              {currentEvents?.map((upcomingEvent) => (
                <div key={upcomingEvent.id} className="mx-2">
                  <EventPill upcomingEvent={upcomingEvent}></EventPill>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center py-10">
              <div className="bg-[var(--warning-colour)] flex items-center px-5 py-10 border-t-slate-400 rounded-2xl">
                <img
                  src="wmcc-black.png"
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
              src="https://app.irm.io/wmcc.ca/operations"
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
