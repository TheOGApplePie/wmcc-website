"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

export default function GalleryViewer({
  images,
}: Readonly<{ images: GalleryImage[] }>) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      else if (e.key === "ArrowRight")
        setActiveIndex((i) => ((i ?? 0) + 1) % images.length);
      else if (e.key === "ArrowLeft")
        setActiveIndex((i) => (((i ?? 0) - 1) + images.length) % images.length);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, images.length]);

  const goNext = () =>
    setActiveIndex((i) => ((i ?? 0) + 1) % images.length);
  const goPrev = () =>
    setActiveIndex((i) => (((i ?? 0) - 1) + images.length) % images.length);

  return (
    <>
      <div className="flex items-start gap-4 overflow-x-scroll">
        {images.map((img, index) => (
          <button
            key={img.src}
            type="button"
            className="shrink-0 cursor-pointer"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              src={img.src}
              alt={img.alt}
              height={400}
              width={400}
              className="max-h-72"
            />
          </button>
        ))}
      </div>

      {isOpen && activeIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setActiveIndex(null)}
            aria-label="Close"
          />
          <div className="relative w-full h-full px-16 pt-14 pb-4 pointer-events-none z-10">
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-4xl leading-none hover:text-gray-300 transition-colors z-20"
            onClick={() => setActiveIndex(null)}
            aria-label="Close image"
          >
            &times;
          </button>
          <button
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-6xl leading-none hover:text-gray-300 transition-colors z-20"
            onClick={goPrev}
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <button
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-6xl leading-none hover:text-gray-300 transition-colors z-20"
            onClick={goNext}
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}
