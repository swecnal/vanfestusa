"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { sponsors, sponsorTiers, type Sponsor } from "@/data/sponsors";

interface SponsorCarouselProps {
  eventFilter: "escape_to_the_cape" | "liftoff" | "all";
}

export default function SponsorCarousel({ eventFilter }: SponsorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const filteredSponsors = useMemo(() => {
    return sponsors
      .filter(
        (s) =>
          eventFilter === "all" ||
          s.events.includes("all") ||
          s.events.includes(eventFilter)
      )
      .sort(
        (a, b) =>
          sponsorTiers[a.category].sortOrder -
          sponsorTiers[b.category].sortOrder
      );
  }, [eventFilter]);

  const goToSponsor = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setActiveIndex(index);
      setTimeout(() => setIsTransitioning(false), 400);
    },
    [isTransitioning]
  );

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (filteredSponsors.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredSponsors.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [filteredSponsors.length]);

  // Reset index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [eventFilter]);

  if (filteredSponsors.length === 0) return null;

  const activeSponsor: Sponsor = filteredSponsors[activeIndex];
  const tier = sponsorTiers[activeSponsor.category];

  return (
    <div className="bg-sand rounded-2xl p-6 md:p-8">
      {/* Logo row */}
      <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap mb-6">
        {filteredSponsors.map((sponsor, i) => (
          <button
            key={sponsor.name}
            onClick={() => goToSponsor(i)}
            className={`relative flex items-center justify-center rounded-xl p-2 transition-all duration-300 ${
              i === activeIndex
                ? `ring-2 ring-teal shadow-[0_0_12px_rgba(28,162,136,0.35)] scale-110 ${sponsor.darkBg ? "bg-charcoal" : "bg-white"}`
                : `opacity-60 hover:opacity-90 ${sponsor.darkBg ? "bg-charcoal/50 hover:bg-charcoal" : "bg-white/50 hover:bg-white"}`
            }`}
            aria-label={`View ${sponsor.name}`}
          >
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={i === activeIndex ? 80 : 60}
              height={i === activeIndex ? 80 : 60}
              className="object-contain transition-all duration-300"
              style={{
                width: i === activeIndex ? 80 : 60,
                height: i === activeIndex ? 80 : 60,
              }}
            />
          </button>
        ))}
      </div>

      {/* Active sponsor details */}
      <div
        className={`bg-white rounded-2xl p-5 md:p-6 text-center transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <span
          className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
          style={{ backgroundColor: tier.color, color: "#1a1a1a" }}
        >
          {tier.label}
        </span>
        <h4 className="font-display font-bold text-xl text-charcoal mb-2">
          <a
            href={activeSponsor.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:text-teal-dark transition-colors"
          >
            {activeSponsor.name}
          </a>
        </h4>
        <p className="text-charcoal/70 text-sm leading-relaxed max-w-xl mx-auto">
          {activeSponsor.description}
        </p>
      </div>

      {/* Dot indicators */}
      {filteredSponsors.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {filteredSponsors.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSponsor(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-6 h-2 bg-teal"
                  : "w-2 h-2 bg-charcoal/20 hover:bg-charcoal/40"
              }`}
              aria-label={`Go to sponsor ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
