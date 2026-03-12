"use client";

import { sponsors } from "@/data/sponsors";
import Link from "next/link";

export default function SponsorMarquee() {
  // Double the sponsors array so the marquee can loop seamlessly
  const doubled = [...sponsors, ...sponsors];

  return (
    <section className="py-16 px-4 bg-sand">
      <div className="mx-auto max-w-6xl text-center mb-10">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal mb-3">
          Our Sponsors
        </h2>
        <p className="text-charcoal/60 text-lg">
          Proudly supported by these amazing brands
        </p>
      </div>

      {/* Marquee container */}
      <div className="relative overflow-hidden mx-auto max-w-6xl">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-sand to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-sand to-transparent" />

        {/* Scrolling track */}
        <div className="animate-marquee flex items-center gap-8 w-max">
          {doubled.map((sponsor, idx) => (
            <a
              key={`${sponsor.name}-${idx}`}
              href={sponsor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
              style={{ height: "70px", minWidth: "140px" }}
              title={sponsor.name}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="max-h-[50px] w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Become a Sponsor CTA */}
      <div className="text-center mt-10">
        <Link
          href="/get-involved#sponsors"
          className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-full transition-colors"
        >
          Become a Sponsor
        </Link>
      </div>
    </section>
  );
}
