"use client";

import { useState, useEffect, useCallback } from "react";

interface BuildsCarouselProps {
  images: Array<{ src: string; alt: string }>;
  autoplayInterval?: number;
}

export default function BuildsCarousel({ images, autoplayInterval = 4000 }: BuildsCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning],
  );

  const next = useCallback(() => {
    goToSlide((current + 1) % images.length);
  }, [current, goToSlide, images.length]);

  const prev = useCallback(() => {
    goToSlide((current - 1 + images.length) % images.length);
  }, [current, goToSlide, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(next, autoplayInterval);
    return () => clearInterval(timer);
  }, [next, images.length, autoplayInterval]);

  if (!images.length) return null;

  // Show 4 on desktop, 2 on tablet, 1 on mobile — via CSS
  const getVisibleIndices = (count: number) => {
    const indices: number[] = [];
    for (let i = 0; i < count; i++) {
      indices.push((current + i) % images.length);
    }
    return indices;
  };

  const visible = getVisibleIndices(Math.min(4, images.length));

  return (
    <div className="relative">
      {/* Arrow buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {visible.map((idx, i) => (
          <div
            key={`${idx}-${i}`}
            className={`rounded-xl overflow-hidden ${i >= 2 ? "hidden md:block" : ""} ${i >= 1 ? "hidden sm:block" : ""}`}
          >
            <img
              src={images[idx].src}
              alt={images[idx].alt}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
              decoding="async"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-teal"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
