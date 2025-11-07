"use client";
import { Announcement } from "../app/page";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SlideshowProps {
  content: Announcement[];
}

export default function CarouselComponent({ content }: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning || content.length < 2) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % content.length);
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning, content.length]);

  const prevSlide = useCallback(() => {
    if (isTransitioning || content.length < 2) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + content.length) % content.length);
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning, content.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 100);
    },
    [isTransitioning, currentSlide]
  );

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      if (content.length > 1) nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  if (content?.length) {
    return (
      <div className="relative h-[calc(100dvh-120px)] overflow-hidden bg-gradient-to-r from-[#08101a] to-[#1e3a5f]">
        {/* Slides */}
        {content.map((slide, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 ${
              slide.poster_url ? "sm:grid-cols-2" : ""
            } absolute inset-0 transition-all duration-500 ease-out transform ${
              index === currentSlide
                ? "opacity-100 translate-x-0"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            {slide.poster_url ? (
              <>
                <div
                  className={`${
                    slide.poster_url ? "hidden sm:flex" : "flex"
                  } col-span-1 flex-col items-center justify-center p-8`}
                >
                  <div className="text-center max-w-md mb-6">
                    <h1 className="text-5xl font-bold text-white mb-4">
                      {slide.title}
                    </h1>
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {slide.description}
                    </h2>
                  </div>
                  {slide.call_to_action_link && (
                    <button className="bg-[var(--main-colour-blue)] hover:bg-[var(--secondary-colour-green)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
                      <Link
                        href={slide.call_to_action_link}
                        className="inline-block"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {slide.call_to_action_caption}
                      </Link>
                    </button>
                  )}
                </div>

                <div className="col-span-1 flex flex-col sm:flex-row items-center justify-center p-8">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={slide.poster_url}
                      alt={slide.poster_alt || `Slide ${index + 1}`}
                      fill={true}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        console.error(
                          `Failed to load image: ${slide.poster_url}`
                        );
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                  {slide.call_to_action_link && (
                    <button className="inline-block sm:hidden bg-[var(--main-colour-blue)] hover:bg-[var(--secondary-colour-green-light)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
                      <Link href={slide.call_to_action_link}>
                        {slide.call_to_action_caption}
                      </Link>
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="text-center max-w-md mb-6">
                  <h2 className="text-5xl font-bold text-white mb-4">
                    {slide.title}
                  </h2>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {slide.description}
                  </h2>
                </div>
                {slide.call_to_action_link && slide.call_to_action_caption && (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={slide.call_to_action_link}
                    className="inline-block"
                  >
                    <button className="bg-[var(--main-colour-blue)] hover:bg-[var(--secondary-colour-green)] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
                      {slide.call_to_action_caption}
                    </button>
                  </a>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {content.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              } ${isTransitioning ? "cursor-not-allowed" : "cursor-pointer"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-[calc(100dvh-120px)] overflow-hidden bg-gradient-to-r from-[#08101a] to-[#1e3a5f] flex items-center justify-center">
        <p className="text-white text-4xl">
          There are no announcements just yet. But stay tuned!
        </p>
      </div>
    );
  }
}
