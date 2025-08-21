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

  console.log("Fetched slides:", slides); // Debug log

  const { data: currentEvents } = await supabase
    .from("events")
    .select("id, posterurl,posteralt,title,startdate, location")
    .gte("startdate", new Date().toISOString())
    .order("startdate", { ascending: true });

  return (
    <div className="">
      <section>
        <CarouselComponent
          content={(slides as Slide[]) || []}
        ></CarouselComponent>
      </section>
      <section>{/* <MasjidboxWidget /> */}</section>
      <section>
        <div className="mx-6">
          <h1 className="text-4xl">About Us</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="md:col-span-1 col-span-2 ">
              <Image
                className="object-cover rounded-2xl"
                src={"/community-dua.jpg"}
                alt="About us"
                height={626}
                width={626}
                // style={aboutUsImageStyle}
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
      <section className="mt-5">
        <div className="container mx-4">
          <h1 className="text-4xl">Current and upcoming events</h1>
          <div className="flex overflow-x-scroll">
            {currentEvents?.map((upcomingEvent) => (
              <div key={upcomingEvent.id} className="mx-2">
                <EventPill upcomingEvent={upcomingEvent}></EventPill>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
