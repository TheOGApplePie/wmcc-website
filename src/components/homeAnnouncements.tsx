import { getAnnouncements } from "../lib/public-content";
import CarouselComponent from "./Carousel";
import ContentError from "./contentError";

export default async function HomeAnnouncements() {
  let slides;
  try {
    slides = await getAnnouncements();
  } catch {
    return (
      <ContentError message="We couldn’t load announcements. Please try again." />
    );
  }
  return <CarouselComponent content={slides} />;
}
