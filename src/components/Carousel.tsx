"use client";
import { Slide } from "../app/page";
import { useState, useCallback, useEffect } from "react";

interface SlideshowProps {
  content: Slide[];
}

export default function CarouselComponent({ content }: SlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Filter out slides without valid poster URLs
  const validSlides = content.filter(
    (slide) => slide.posterurl && slide.posterurl.trim() !== "",
  );

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection("right");
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % validSlides.length);
      setIsTransitioning(false);
    }, 100);
  };

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection("left");
    setTimeout(() => {
      setCurrentSlide(
        (prev) => (prev - 1 + validSlides.length) % validSlides.length,
      );
      setIsTransitioning(false);
    }, 100);
  }, [isTransitioning, validSlides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setDirection("right");
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 100);
    },
    [isTransitioning, currentSlide],
  );

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return !content || content.length === 0 ? (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">No slides to display</p>
    </div>
  ) : validSlides.length === 0 ? (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">No valid slides to display</p>
    </div>
  ) : (
    <div className="relative h-[calc(100dvh-120px)] overflow-hidden bg-gradient-to-r from-[#08101a] via-37% to-[#1e3a5f]">
      {/* Slides */}
      {validSlides.map((slide, index) => (
        <div
          key={index}
          className={`grid grid-cols-1 sm:grid-cols-2 absolute inset-0 transition-all duration-500 ease-out ${
            index === currentSlide
              ? "opacity-100 transform translate-x-0"
              : index < currentSlide
                ? "opacity-0 transform -translate-x-full"
                : "opacity-0 transform translate-x-full"
          }`}
        >
          {/* Caption - Left side, centered */}
          <div className="col-span-1 hidden sm:flex sm:flex-col sm:items-center sm:justify-center p-8">
            <div className="text-center max-w-md mb-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                {slide.caption}
              </h2>
            </div>
            {slide.registrationlink && slide.buttoncaption && (
              <a href={slide.registrationlink} className="inline-block">
                <button className="bg-[var(--main-colour-blue)] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
                  {slide.buttoncaption}
                </button>
              </a>
            )}
          </div>

          {/* Image - Right side, centered */}
          <div className="col-span-1 flex flex-col sm:flex-row items-center justify-center p-8">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={slide.posterurl}
                alt={slide.posteralt || `Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  console.error(`Failed to load image: ${slide.posterurl}`);
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            {slide.registrationlink && slide.buttoncaption && (
              <a
                href={slide.registrationlink}
                className="inline-block sm:hidden"
              >
                <button className="bg-[var(--main-colour-blue)] hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg">
                  {slide.buttoncaption}
                </button>
              </a>
            )}
          </div>
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
        {validSlides.map((_, index) => (
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

      {/* Transition overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none" />
      )}
    </div>
  );
}
