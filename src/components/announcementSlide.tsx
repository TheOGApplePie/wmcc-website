import Image from "./eventPoster";
import type { Announcement } from "../app/schemas/events";
import CTALink from "./CTALink";

export default function AnnouncementSlide({
  slide,
}: Readonly<{ slide: Announcement }>) {
  return (
    <div
      className={`grid grid-cols-1 w-full h-full ${slide.poster_url ? "sm:grid-cols-2" : ""}`}
    >
      <div
        className={`${slide.poster_url ? "hidden sm:flex" : "flex"} flex-col items-center justify-center p-8 text-center text-white`}
      >
        <div className="text-center max-w-md mb-6">
          <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
          <p className="text-3xl font-bold mb-4 whitespace-pre-wrap">
            {slide.description}
          </p>
        </div>
        {slide.call_to_action_link && (
          <CTALink href={slide.call_to_action_link}>
            {slide.call_to_action_caption || "Learn more"}
          </CTALink>
        )}
      </div>
      {slide.poster_url && (
        <div className="min-h-0 flex flex-col sm:flex-row items-center justify-center p-8">
          <div className="relative w-full h-full min-h-0 flex items-center justify-center">
            <Image
              src={slide.poster_url}
              alt={slide.poster_alt ?? slide.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-contain rounded-lg"
            />
          </div>
          {slide.call_to_action_link && (
            <CTALink href={slide.call_to_action_link} className="sm:hidden shrink-0">
              {slide.call_to_action_caption || "Learn more"}
            </CTALink>
          )}
        </div>
      )}
    </div>
  );
}
