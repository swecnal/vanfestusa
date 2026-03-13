"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type SiteStyles, EMPTY_SITE_STYLES, findButtonStyle, buttonStyleToCSS } from "@/lib/styles";

interface HeroSlide {
  image: string;
  alt: string;
}

interface EventOverlay {
  label?: string;
  eventName: string;
  tagline?: string;
  location?: string;
  locationUrl?: string;
  dates?: string;
  primaryCta?: { text: string; href: string; external?: boolean; styleId?: string };
  secondaryCta?: { text: string; href: string; external?: boolean; styleId?: string };
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  overlay: EventOverlay;
  autoplayInterval?: number;
  siteStyles?: SiteStyles;
}

const textShadow = "0 2px 12px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.6), 0 4px 20px rgba(0,0,0,0.5)";

export default function HeroCarousel({ slides, overlay, autoplayInterval = 5000, siteStyles = EMPTY_SITE_STYLES }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const heroCTARef = useRef<HTMLAnchorElement>(null);

  // Randomize bounce timing
  useEffect(() => {
    if (!heroCTARef.current) return;
    heroCTARef.current.style.animationDuration = `${2 + Math.random() * 3}s`;
    heroCTARef.current.style.animationDelay = `${Math.random() * 3}s`;
  }, []);

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
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      goToSlide((current + 1) % slides.length);
    }, autoplayInterval);
    return () => clearInterval(timer);
  }, [current, goToSlide, slides.length, autoplayInterval]);

  if (!slides.length) return null;

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
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      {/* Event overlay content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6 sm:px-10 md:px-14 py-10 md:py-14 max-w-4xl bg-white/15 backdrop-blur-[2px] rounded-3xl border border-white/20">
          {overlay.label && (
            <p
              className="font-display font-semibold tracking-[0.3em] uppercase text-sm md:text-base mb-4"
              style={{ textShadow, color: "#09B593" }}
            >
              {overlay.label}
            </p>
          )}
          {!overlay.label && (
            <p
              className="font-display font-semibold tracking-[0.3em] uppercase text-sm md:text-base mb-4"
              style={{ textShadow, color: "#09B593" }}
            >
              Next Event
            </p>
          )}
          <h1
            className="font-accent font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-4 leading-tight whitespace-nowrap"
            style={{
              textShadow: `${textShadow}, 0 0 60px rgba(9,181,147,0.3)`,
              fontFamily: "'EB Garamond', serif",
              WebkitTextStroke: "1px rgba(255,255,255,0.1)",
            }}
          >
            {overlay.eventName}
          </h1>
          {overlay.tagline && (
            <p
              className="text-xl md:text-2xl lg:text-3xl mb-8 font-bold tracking-wide"
              style={{
                textShadow,
                color: "#09B593",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {overlay.tagline}
            </p>
          )}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 text-base md:text-lg lg:text-xl mb-8 font-semibold"
            style={{ textShadow }}
          >
            {overlay.location && (
              <a
                href={overlay.locationUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-teal-light transition-colors"
              >
                <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {overlay.location}
              </a>
            )}
            {overlay.location && overlay.dates && (
              <span className="hidden sm:block text-white/40">|</span>
            )}
            {overlay.dates && (
              <span className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {overlay.dates}
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {overlay.primaryCta && (() => {
              const style = overlay.primaryCta.styleId
                ? findButtonStyle(overlay.primaryCta.styleId, siteStyles)
                : null;
              return (
                <a
                  ref={heroCTARef}
                  href={overlay.primaryCta.href}
                  target={overlay.primaryCta.external !== false ? "_blank" : undefined}
                  rel={overlay.primaryCta.external !== false ? "noopener noreferrer" : undefined}
                  className={style ? "transition-all hover:scale-105" : "bg-teal hover:bg-teal-dark text-white font-bold px-10 py-4 rounded-xl text-xl shadow-[0_0_30px_rgba(9,181,147,0.5)] hover:shadow-[0_0_50px_rgba(9,181,147,0.7)] transition-all hover:scale-105 animate-pulse-subtle animate-bounce-attention"}
                  style={style ? buttonStyleToCSS(style) : undefined}
                >
                  {overlay.primaryCta.text}
                </a>
              );
            })()}
            {overlay.secondaryCta && (() => {
              const style = overlay.secondaryCta.styleId
                ? findButtonStyle(overlay.secondaryCta.styleId, siteStyles)
                : null;
              return (
                <a
                  href={overlay.secondaryCta.href}
                  target={overlay.secondaryCta.external ? "_blank" : undefined}
                  rel={overlay.secondaryCta.external ? "noopener noreferrer" : undefined}
                  className={style ? "transition-all" : "border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3 rounded-xl text-lg transition-all hover:bg-white/10"}
                  style={style ? buttonStyleToCSS(style) : undefined}
                >
                  {overlay.secondaryCta.text}
                </a>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
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
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
