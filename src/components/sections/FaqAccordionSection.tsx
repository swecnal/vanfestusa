"use client";

import { useState, useRef, useEffect } from "react";
import type { FaqAccordionData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";
import type { SiteStyles } from "@/lib/styles";
import { resolveButtonStylesInHtml, EMPTY_SITE_STYLES } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

export default function FaqAccordionSection({ data, settings, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as FaqAccordionData;
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [allOpen, setAllOpen] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, d.items.length);
  }, [d.items.length]);

  const toggleItem = (i: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(d.items.map((_, i) => i)));
    }
    setAllOpen(!allOpen);
  };

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${
        settings.bgColor === "sand" ? "bg-sand" : "bg-white"
      } ${settings.customClasses || ""}`}
      id={settings.sectionId}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"}`}>
        {d.heading && (
          <h2 className="font-display font-black text-3xl md:text-4xl text-charcoal mb-8 text-center">
            {d.heading}
          </h2>
        )}
        {d.showExpandAll && (
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleAll}
              className="text-teal hover:text-teal-dark text-sm font-semibold transition-colors"
            >
              {allOpen ? "Collapse All" : "Expand All"}
            </button>
          </div>
        )}
        <div className="space-y-3">
          {d.items.map((item, i) => (
            <div key={i} className="border border-charcoal/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-sand/50 transition-colors"
              >
                <span className="font-display font-semibold text-charcoal">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-teal flex-shrink-0 transition-transform ${
                    openItems.has(i) ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                ref={(el) => { refs.current[i] = el; }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openItems.has(i) ? refs.current[i]?.scrollHeight : 0,
                }}
              >
                <div className="px-6 pb-4 text-charcoal/70 text-sm leading-relaxed site-html-content">
                  <div dangerouslySetInnerHTML={{ __html: resolveButtonStylesInHtml(item.answer, siteStyles) }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
