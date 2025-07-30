import Image from "next/image";
import styles from "./page.module.css";
import Carousel from "@/components/Carousel";
import MasjidboxWidget from "@/components/Masjidbox";

export default function Home() {
  const slides = [
    {
      imgUrl: "soccer.jpeg",
      imgAlt: "WMCC MusFit soccer tournament poster",
      caption: `Do you you have what it takes to be the soccer champion in the Hamilton region? Register your team and we'll see you at the tournament!`,
      buttonLink: "https://bit.ly/wmcc-soccer",
      buttonCaption: "Register Now",
    },
    // {
    //   imgUrl: "wisbbq.jpeg",
    //   imgAlt: "WIS BBQ poster poster",
    //   caption: `Join us and learn more about how the Waterdown Islamic School can bring value to your entire family`,
    //   buttonLink: "https://bit.ly/wis-open-house-2025",
    //   buttonCaption: "Register Now",
    // },
  ];
  return (
    <div>
      <section>
        <Carousel content={slides}></Carousel>
      </section>
      <section>
        <MasjidboxWidget />
      </section>
      <section>About Us</section>
      <section>Our Services</section>
    </div>
  );
}
