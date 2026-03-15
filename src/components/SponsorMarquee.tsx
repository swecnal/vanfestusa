"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

interface Sponsor {
  name: string;
  logo: string;
  websiteUrl?: string;
  darkBg?: boolean;
}

interface SponsorMarqueeProps {
  sponsors: Sponsor[];
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  speed?: number;
  headingStyle?: CSSProperties;
  subheadingStyle?: CSSProperties;
}

export default function SponsorMarquee({
  sponsors,
  heading = "Our Sponsors",
  subheading = "Proudly supported by these amazing brands",
  ctaText = "Become a Sponsor",
  ctaHref = "/get-involved#sponsors",
  headingStyle,
  subheadingStyle,
}: SponsorMarqueeProps) {
  if (!sponsors.length) return null;

  // Double the sponsors array so the marquee can loop seamlessly
  const doubled = [...sponsors, ...sponsors];

  return (
    <section className="py-16 px-4 bg-sand">
      <div className="mx-auto max-w-6xl text-center mb-10">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-charcoal mb-3" style={headingStyle} dangerouslySetInnerHTML={{ __html: heading || "" }} />
        <p className="text-charcoal/60 text-lg" style={subheadingStyle} dangerouslySetInnerHTML={{ __html: subheading || "" }} />
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
              href={sponsor.websiteUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-shrink-0 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center ${sponsor.darkBg ? "bg-charcoal" : "bg-white"}`}
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

      {/* CTA */}
      {ctaText && ctaHref && (
        <div className="text-center mt-10">
          <Link
            href={ctaHref}
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            {ctaText}
          </Link>
        </div>
      )}
    </section>
  );
}
