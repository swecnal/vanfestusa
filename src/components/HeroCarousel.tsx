"use client";

import { useState, useEffect, useCallback } from "react";

interface HeroSlide {
  image: string;
  alt: string;
}

const slides: HeroSlide[] = [
  { image: "https://vanfestusa.com/assets/images/slideshow01.jpg", alt: "VanFest gathering" },
  { image: "https://vanfestusa.com/assets/images/slideshow02.jpg", alt: "VanFest community" },
  { image: "https://vanfestusa.com/assets/images/slideshow03.jpg", alt: "VanFest sunset" },
  { image: "https://vanfestusa.com/assets/images/slideshow04.jpg", alt: "VanFest vans" },
  { image: "https://vanfestusa.com/assets/images/slideshow05.jpg", alt: "VanFest event" },
];

interface EventOverlay {
  eventName: string;
  tagline: string;
  location: string;
  dates: string;
}

const nextEvent: EventOverlay = {
  eventName: "Escape to the Cape",
  tagline: "The biggest vanlife celebration in New England!",
  location: "Cape Cod Fairgrounds — East Falmouth, MA",
  dates: "August 20 - 24, 2026",
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((current + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current, goToSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Event overlay content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <p className="text-teal-light font-display font-semibold tracking-[0.3em] uppercase text-sm md:text-base mb-4 animate-fade-in">
            Next Event
          </p>
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl mb-4 leading-tight drop-shadow-2xl">
            {nextEvent.eventName}
          </h1>
          <p className="font-accent text-xl md:text-2xl text-white/90 mb-6 italic">
            {nextEvent.tagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm md:text-base mb-8">
            <span className="flex items-center gap-2 text-white/80">
              <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {nextEvent.location}
            </span>
            <span className="hidden sm:block text-white/40">|</span>
            <span className="flex items-center gap-2 text-white/80">
              <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {nextEvent.dates}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://vanfest.fieldpass.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Tickets
            </a>
            <a
              href="/events"
              className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3 rounded-full text-lg transition-all hover:bg-white/10"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "w-8 bg-teal"
                : "w-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
