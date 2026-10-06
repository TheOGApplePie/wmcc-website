"use client";
import type { Announcement } from "../app/schemas/events";
import { useState, useCallback, useEffect } from "react";
import AnnouncementSlide from "./announcementSlide";

export default function CarouselComponent({
  content,
}: Readonly<{ content: Announcement[] }>) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const index = Math.max(
    0,
    content.findIndex((slide) => slide.id === selectedId),
  );
  const move = useCallback(
    (direction: number) => {
      if (content.length < 2) return;
      setSelectedId(
        content[(index + direction + content.length) % content.length].id,
      );
    },
    [content, index],
  );

  useEffect(() => {
    if (paused || hovered || content.length < 2) return;
    const interval = setInterval(() => move(1), 5000);
    return () => clearInterval(interval);
  }, [move, paused, hovered, content.length]);

  if (!content.length)
    return (
      <div className="h-[calc(100dvh-120px)] overflow-hidden bg-gradient-to-r from-dark-navy to-main-blue flex items-center justify-center">
        <output className="text-white text-4xl text-center">
          There are no announcements just yet. But stay tuned!
        </output>
      </div>
    );

  return (
    <section
      aria-label="Announcements"
      aria-roledescription="carousel"
      className="relative h-[calc(100dvh-120px)] overflow-hidden bg-gradient-to-r from-dark-navy to-main-blue"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="h-full" aria-live={paused ? "polite" : "off"}>
        {content.map((slide, slideIndex) => (
          <div
            key={slide.id}
            inert={slideIndex !== index}
            aria-hidden={slideIndex !== index}
            className={[
              "absolute inset-0 transition-all duration-500 ease-out transform",
              slideIndex === index && "opacity-100 translate-x-0",
              slideIndex < index && "opacity-0 -translate-x-full",
              slideIndex > index && "opacity-0 translate-x-full",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <AnnouncementSlide slide={slide} />
          </div>
        ))}
      </div>
      {content.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => move(-1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 hover:scale-110"
            aria-label="Previous announcement"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 hover:scale-110"
            aria-label="Next announcement"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-300 text-sm"
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? "▶" : "⏸"}
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {content.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setSelectedId(slide.id)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                  slideIndex === index
                    ? "bg-white"
                    : "bg-white bg-opacity-50 hover:bg-opacity-75"
                }`}
                aria-label={`Go to slide ${slideIndex + 1}`}
                aria-current={slideIndex === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
