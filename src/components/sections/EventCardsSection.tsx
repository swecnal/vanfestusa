"use client";

import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import BounceCTA from "@/components/BounceCTA";
import type { EventCardsData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function EventCardsSection({ data, settings }: Props) {
  const d = data as unknown as EventCardsData;

  return (
    <section
      className={`${settings.paddingY || "py-20"} px-4 ${
        settings.bgColor === "sand" ? "bg-sand" : "bg-white"
      } ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-6xl"}`}>
        {d.heading && (
          <SectionHeading title={d.heading.title} subtitle={d.heading.subtitle} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {d.events.map((ev) => (
            <div
              key={ev.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 flex flex-col"
            >
              <Link
                href={ev.href}
                className={`relative bg-gradient-to-r ${ev.gradient} p-10 text-white overflow-hidden block`}
              >
                {ev.image && (
                  <img
                    src={ev.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                  />
                )}
                <div className="relative">
                  <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">
                    {ev.tag}
                  </span>
                  <h3
                    className={`font-display font-black text-3xl mb-1 ${
                      ev.fontOverride ? `font-[${ev.fontOverride}]` : ""
                    }`}
                    style={ev.fontOverride ? { fontFamily: ev.fontOverride } : undefined}
                  >
                    {ev.name}
                  </h3>
                  {ev.location && (
                    <p className="text-white/80 text-sm">{ev.location}</p>
                  )}
                  <p className="text-white/80 text-sm font-semibold mt-1">
                    {ev.dates}
                  </p>
                </div>
              </Link>
              <div className="p-8 flex flex-col flex-grow">
                <p className="text-charcoal/70 text-sm leading-relaxed mb-6 flex-grow">
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
          ))}
        </div>
      </div>
    </section>
  );
}
