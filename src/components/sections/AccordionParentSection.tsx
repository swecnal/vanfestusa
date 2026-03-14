"use client";

import { useState, useRef, useEffect } from "react";
import type { AccordionParentData, SectionSettings, SectionType } from "@/lib/types";
import { type TextStyleConfig, textStyleConfigToCSS, EMPTY_SITE_STYLES } from "@/lib/styles";
import SectionRenderer from "./SectionRenderer";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function AccordionParentSection({ data, settings }: Props) {
  const d = data as unknown as AccordionParentData;
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [allOpen, setAllOpen] = useState(false);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, d.children.length);
  }, [d.children.length]);

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
      setOpenItems(new Set(d.children.map((_, i) => i)));
    }
    setAllOpen(!allOpen);
  };

  const imgPos = d.imagePosition || "full-width";
  const hasImage = !!d.image;
  const isBackground = imgPos === "background" && hasImage;

  return (
    <section
      className={`${settings.paddingY || "py-16"} px-4 ${
        settings.bgColor === "sand" ? "bg-sand" : "bg-white"
      } ${settings.customClasses || ""}`}
      id={settings.sectionId}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"}`}>
        {/* Parent header */}
        {(d.title || hasImage || d.description) && (
          <div
            className={`mb-8 ${
              isBackground ? "relative rounded-xl overflow-hidden p-8" : ""
            } ${
              hasImage && (imgPos === "small-left" || imgPos === "small-right")
                ? "flex items-start gap-6"
                : ""
            } ${
              hasImage && imgPos === "small-right" ? "flex-row-reverse" : ""
            }`}
          >
            {/* Background image */}
            {isBackground && (
              <>
                <img
                  src={d.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/60" />
              </>
            )}

            {/* Small image */}
            {hasImage && (imgPos === "small-left" || imgPos === "small-right") && (
              <img
                src={d.image}
                alt=""
                className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
              />
            )}

            {/* Full-width image */}
            {hasImage && imgPos === "full-width" && (
              <img
                src={d.image}
                alt=""
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
            )}

            <div className={isBackground ? "relative z-10" : ""}>
              {d.title && (
                <h2
                  className={`font-display font-black text-3xl md:text-4xl mb-3 ${
                    isBackground ? "text-white" : "text-charcoal"
                  }`}
                  style={textStyleConfigToCSS((d.titleStyle as TextStyleConfig) || {})}
                >
                  {d.title}
                </h2>
              )}
              {d.description && (
                <p
                  className={`text-base leading-relaxed ${
                    isBackground ? "text-white/80" : "text-charcoal/70"
                  }`}
                  style={textStyleConfigToCSS((d.descriptionStyle as TextStyleConfig) || {})}
                >
                  {d.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Expand/Collapse all */}
        {d.showExpandAll && d.children.length > 1 && (
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleAll}
              className="text-teal hover:text-teal-dark text-sm font-semibold transition-colors"
            >
              {allOpen ? "Collapse All" : "Expand All"}
            </button>
          </div>
        )}

        {/* Accordion items */}
        <div className="space-y-3">
          {d.children.map((child, i) => (
            <div key={i} className="border border-charcoal/10 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleItem(i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-sand/50 transition-colors"
              >
                <span className="font-display font-semibold text-charcoal">
                  {child.title}
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
                {child.sectionType ? (
                  <div className="pb-2">
                    <SectionRenderer
                      section={{
                        id: `accordion-child-${i}`,
                        page_id: "",
                        section_type: child.sectionType as SectionType,
                        data: child.sectionData || {},
                        settings: {
                          ...(child.sectionSettings || {}),
                          paddingY: (child.sectionSettings?.paddingY as string) || "py-4",
                        } as SectionSettings,
                        sort_order: i,
                        is_visible: true,
                        created_at: "",
                        updated_at: "",
                      }}
                      siteStyles={EMPTY_SITE_STYLES}
                    />
                  </div>
                ) : (
                  <div className="px-6 pb-4 text-charcoal/70 text-sm leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: child.body }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
