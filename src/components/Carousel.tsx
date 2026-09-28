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
      <div className="min-h-64 bg-main-blue text-white p-12">
        <output className="text-3xl text-center">
          There are no announcements just yet. But stay tuned!
        </output>
      </div>
    );

  return (
    <section
      aria-label="Announcements"
      aria-roledescription="carousel"
      className="relative min-h-[calc(100dvh-120px)] bg-gradient-to-r from-dark-navy to-main-blue pb-20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
    >
      <div className="min-h-[65dvh]" aria-live={paused ? "polite" : "off"}>
        <AnnouncementSlide slide={content[index]} />
      </div>
      {content.length > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-4 text-white px-4">
          <button
            type="button"
            onClick={() => move(-1)}
            className="btn-primary"
            aria-label="Previous announcement"
          >
            Previous
          </button>
          <p>
            {index + 1} of {content.length}
          </p>
          <button
            type="button"
            onClick={() => move(1)}
            className="btn-primary"
            aria-label="Next announcement"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            className="btn-primary"
          >
            {paused ? "Play slideshow" : "Pause slideshow"}
          </button>
        </div>
      )}
    </section>
  );
}
