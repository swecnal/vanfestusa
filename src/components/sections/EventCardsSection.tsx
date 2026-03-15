"use client";

import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import BounceCTA from "@/components/BounceCTA";
import type { EventCardsData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

export default function EventCardsSection({ data, settings }: Props) {
  const d = data as unknown as EventCardsData;
  const headingTitleStyle = (data as Record<string, unknown>).headingTitleStyle as TextStyleConfig | undefined;
  const headingSubtitleStyle = (data as Record<string, unknown>).headingSubtitleStyle as TextStyleConfig | undefined;
  const cols = d.columns || 2;
  const isFeatured = d.layout === "featured";
  const featuredIdx = d.featuredIndex ?? 0;

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${
        settings.bgColor === "sand" ? "bg-sand" : "bg-white"
      } ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-6xl"}`}>
        {d.heading && (
          <SectionHeading title={d.heading.title} subtitle={d.heading.subtitle} titleStyle={headingTitleStyle ? textStyleConfigToCSS(headingTitleStyle) : undefined} subtitleStyle={headingSubtitleStyle ? textStyleConfigToCSS(headingSubtitleStyle) : undefined} />
        )}
        <div className={`grid ${GRID_COLS[cols] || GRID_COLS[2]} gap-8`}>
          {d.events.map((ev, i) => {
            const isFeatureCard = isFeatured && i === featuredIdx;

            return (
              <div
                key={ev.name + i}
                className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col ${
                  isFeatureCard && cols > 1 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <Link
                  href={ev.href}
                  className={`relative bg-gradient-to-r ${ev.gradient} ${isFeatureCard ? "p-14" : "p-10"} text-white overflow-hidden block`}
                >
                  {ev.image && (
                    <img
                      src={ev.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                    />
                  )}
                  {ev.overlayColor && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: ev.overlayColor,
                        opacity: (ev.overlayOpacity ?? 30) / 100,
                      }}
                    />
                  )}
                  <div className="relative">
                    <span
                      className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4"
                      style={textStyleConfigToCSS(d.tagStyle || {})}
                    >
                      {ev.tag}
                    </span>
                    <h3
                      className={`font-display font-black ${isFeatureCard ? "text-4xl md:text-5xl" : "text-3xl"} mb-1`}
                      style={{
                        ...(ev.fontOverride ? { fontFamily: ev.fontOverride } : {}),
                        ...textStyleConfigToCSS(d.titleStyle || {}),
                      }}
                    >
                      {ev.name}
                    </h3>
                    {ev.location && (
                      <p
                        className="text-white/80 text-sm"
                        style={textStyleConfigToCSS(d.locationStyle || {})}
                      >
                        {ev.location}
                      </p>
                    )}
                    <p
                      className="text-white/80 text-sm font-semibold mt-1"
                      style={textStyleConfigToCSS(d.dateStyle || {})}
                    >
                      {ev.dates}
                    </p>
                  </div>
                </Link>
                <div className="p-8 flex flex-col flex-grow">
                  <p
                    className="text-charcoal/70 text-sm leading-relaxed mb-6 flex-grow"
                    style={textStyleConfigToCSS(d.descriptionStyle || {})}
                  >
                    {ev.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={ev.href}
                      className="text-teal hover:text-teal-dark font-semibold text-sm transition-colors"
                    >
                      Event Details &rarr;
                    </Link>
                    <BounceCTA
                      href={ev.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal hover:bg-teal-dark text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
                    >
                      Get Tickets
                    </BounceCTA>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
