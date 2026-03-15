"use client";

import { useState } from "react";
import type { SponsorTiersData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function SponsorTiersSection({ data, settings }: Props) {
  const d = data as unknown as SponsorTiersData;
  const [openTiers, setOpenTiers] = useState<Set<number>>(new Set());
  const [outerOpen, setOuterOpen] = useState(false);

  const toggleTier = (i: number) => {
    setOpenTiers((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const accentColor = d.accentColor || "teal";

  const tiersContent = (
    <div className="space-y-3">
      {d.introText && (
        <p className="text-charcoal/70 text-sm leading-relaxed mb-6">{d.introText}</p>
      )}
      {d.tiers.map((tier, i) => (
        <div key={i} className="border border-charcoal/10 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleTier(i)}
            className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-sand/50 transition-colors"
          >
            <div>
              <span className="font-display font-bold text-charcoal">{tier.name}</span>
              <span className={`ml-3 text-${accentColor} font-semibold text-sm`}>{tier.price}</span>
            </div>
            <svg
              className={`w-5 h-5 text-${accentColor} flex-shrink-0 transition-transform ${openTiers.has(i) ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openTiers.has(i) && (
            <div className="px-6 pb-4">
              {tier.frontage && (
                <p className="text-charcoal/50 text-sm mb-2">
                  Frontage: {tier.frontage}
                  {tier.frontageNote && <span className="text-xs ml-1">({tier.frontageNote})</span>}
                </p>
              )}
              <p className="text-charcoal/70 text-sm mb-4">{tier.summary}</p>
              {tier.categories.map((cat, j) => (
                <div key={j} className="mb-3">
                  <h4 className="font-display font-semibold text-sm text-charcoal mb-1">{cat.heading}</h4>
                  <ul className="text-charcoal/60 text-xs space-y-0.5">
                    {cat.items.map((item, k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className={`text-${accentColor} mt-0.5`}>&#x2713;</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {d.disclaimerText && (
        <p className="text-charcoal/40 text-xs italic mt-4">{d.disclaimerText}</p>
      )}
      {d.ctaText && (
        <div className="text-center mt-6">
          <a
            href={`mailto:hello@vanfestusa.com${d.emailSubject ? `?subject=${encodeURIComponent(d.emailSubject)}` : ""}`}
            className={`inline-block bg-${accentColor} hover:opacity-90 text-white font-bold px-8 py-3 rounded-xl transition-opacity`}
          >
            {d.ctaText}
          </a>
        </div>
      )}
    </div>
  );

  if (d.wrapInOuterAccordion) {
    return (
      <section style={sectionSpacingStyles(settings)} className={`px-4 bg-white ${settings.customClasses || ""}`}>
        <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"}`}>
          {d.heading && (
            <h2 className="font-display font-black text-3xl text-charcoal mb-8 text-center">{d.heading}</h2>
          )}
          <div className="border border-charcoal/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setOuterOpen(!outerOpen)}
              className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-sand/50 transition-colors font-display font-bold text-charcoal"
            >
              {d.outerAccordionLabel || "Learn More"}
              <svg
                className={`w-5 h-5 text-${accentColor} flex-shrink-0 transition-transform ${outerOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {outerOpen && <div className="px-6 pb-6">{tiersContent}</div>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionSpacingStyles(settings)} className={`px-4 bg-white ${settings.customClasses || ""}`}>
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"}`}>
        {d.heading && (
          <h2 className="font-display font-black text-3xl text-charcoal mb-8 text-center">{d.heading}</h2>
        )}
        {tiersContent}
      </div>
    </section>
  );
}
