import Image from "next/image";
import styles from "./page.module.css";
import Carousel from "@/components/Carousel";
import MasjidboxWidget from "@/components/Masjidbox";
import EventPill from "@/components/eventPill";

export default function Home() {
  const currentEvents = [
    {
      imgUrl: "soccer.jpeg",
      imgAlt: "WMCC MusFit soccer tournament poster",
      title: "WMCC Soccer Tournament",
      location: "Soccer World Hamilton",
      datetime: "2025-08-02T20:30:00",
    },
    {
      imgUrl: "soccer.jpeg",
      imgAlt: "WMCC MusFit soccer tournament poster",
      title: "WMCC Soccer Tournament",
      location: "Soccer World Hamilton",
      datetime: "2025-08-02T20:30:00",
    },
    {
      imgUrl: "soccer.jpeg",
      imgAlt: "WMCC MusFit soccer tournament poster",
      title: "WMCC Soccer Tournament",
      location: "Soccer World Hamilton",
      datetime: "2025-08-02T20:30:00",
    },
    {
      imgUrl: "soccer.jpeg",
      imgAlt: "WMCC MusFit soccer tournament poster",
      title: "WMCC Soccer Tournament",
      location: "Soccer World Hamilton",
      datetime: "2025-08-02T20:30:00",
    },
    {
      imgUrl: "soccer.jpeg",
      imgAlt: "WMCC MusFit soccer tournament poster",
      title: "WMCC Soccer Tournament",
      location: "Soccer World Hamilton",
      datetime: "2025-08-02T20:30:00",
    },
  ];
  const slides = [
    {
      imgUrl: "soccer.jpeg",
      imgAlt: "WMCC MusFit soccer tournament poster",
      caption: `Do you you have what it takes to be the soccer champion in the Hamilton region? Register your team and we'll see you at the tournament!`,
      buttonLink: "https://bit.ly/wmcc-soccer",
      buttonCaption: "Register Now",
    },
    {
      imgUrl: "wisbbq.jpeg",
      imgAlt: "WIS BBQ poster poster",
      caption: `Join us and learn more about how the Waterdown Islamic School can bring value to your entire family`,
      buttonLink: "https://bit.ly/wis-open-house-2025",
      buttonCaption: "Register Now",
    },
  ];
  return (
    <div>
      <section>
        <Carousel content={slides}></Carousel>
      </section>
      <section>
        <MasjidboxWidget />
      </section>
      <section>
        <div className="container">
          <h1>About Us</h1>
          <div className="row community-image">
            <div className="col-6 "></div>
            <div className="col-6">
              <p className="fs-4">
                The Waterdown Muslim Community Centre (WMCC) is a registered
                charitable organization devoted to uplifting and connecting
                Muslim families in Waterdown, Hamilton, and neighbouring areas.
              </p>
              <p className="fs-4">
                Rooted in the values of inclusivity, unity, and collaboration,
                WMCC offers charitable, educational, spiritual, and social
                programs designed to nurture personal growth, strengthen
                families, and build a vibrant, faith-centered community—all
                guided by the teachings of the Qur’an and Sunnah.
              </p>
              <p className="fs-4">
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
        <div className="container">
          <h1>Current and upcoming events</h1>
          <div className="d-flex overflow-x-scroll">
            {currentEvents.map((upcomingEvent, index) => (
              <div key={index} className="mx-2">
                <EventPill upcomingEvent={upcomingEvent}></EventPill>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
