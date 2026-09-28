import Image from "./eventPoster";
import type { Announcement } from "../app/schemas/events";
import CTALink from "./CTALink";

export default function AnnouncementSlide({
  slide,
}: Readonly<{ slide: Announcement }>) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 p-8 w-full h-full ${slide.poster_url ? "sm:grid-cols-2" : ""}`}
    >
      <div className="flex flex-col items-center justify-center text-center text-white gap-6">
        <h2 className="text-3xl sm:text-5xl font-bold">{slide.title}</h2>
        <p className="text-xl sm:text-2xl whitespace-pre-wrap">
          {slide.description}
        </p>
        {slide.call_to_action_link && (
          <CTALink href={slide.call_to_action_link}>
            {slide.call_to_action_caption || "Learn more"}
          </CTALink>
        )}
      </div>
      {slide.poster_url && (
        <div className="relative min-h-64">
          <Image
            src={slide.poster_url}
            alt={slide.poster_alt ?? slide.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
