"use client";

import { useState, useRef, useEffect } from "react";
import type { ScheduleAccordionData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles, sectionBgClass } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function ScheduleAccordionSection({ data, settings }: Props) {
  const d = data as unknown as ScheduleAccordionData;
  const headingStyle = (data as Record<string, unknown>).headingStyle as TextStyleConfig | undefined;
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const [allOpen, setAllOpen] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, d.days.length);
  }, [d.days.length]);

  const toggleDay = (i: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpenDays(new Set());
    } else {
      setOpenDays(new Set(d.days.map((_, i) => i)));
    }
    setAllOpen(!allOpen);
  };

  if (!d.days || d.days.length === 0) {
    return (
      <section style={sectionSpacingStyles(settings)} className={`px-4 ${sectionBgClass(settings)}`}>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display font-black text-2xl text-charcoal/40">
            Schedule Coming Soon
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${sectionBgClass(settings)} ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-5xl"}`}>
        {d.heading && (
          <h2 className="font-display font-black text-3xl md:text-4xl text-charcoal mb-4 text-center" style={headingStyle ? textStyleConfigToCSS(headingStyle) : undefined} dangerouslySetInnerHTML={{ __html: d.heading || "" }} />
        )}
        {d.disclaimer && (
          <p className="text-charcoal/50 text-center text-sm mb-8 italic">
            {d.disclaimer}
          </p>
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
        <div className="space-y-4">
          {d.days.map((day, i) => (
            <div key={i} className="border border-charcoal/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleDay(i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-sand/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-lg text-charcoal">
                    {day.day}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${day.tagColor || "bg-teal/10 text-teal"}`}>
                    {day.tag}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-teal flex-shrink-0 transition-transform ${
                    openDays.has(i) ? "rotate-180" : ""
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
                  maxHeight: openDays.has(i) ? refs.current[i]?.scrollHeight : 0,
                }}
              >
                <div className="px-6 pb-4">
                  <div className="space-y-3">
                    {day.items.map((item, j) => (
                      <div key={j} className="grid grid-cols-[100px_120px_1fr] gap-4 py-2 border-b border-charcoal/5 last:border-0">
                        <span className="text-teal font-semibold text-sm">{item.time}</span>
                        <span className="text-charcoal/50 text-sm">{item.location}</span>
                        <div>
                          <p className="font-display font-semibold text-sm text-charcoal">{item.activity}</p>
                          {item.description && (
                            <p className="text-charcoal/50 text-xs mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
