"use client";

import { useState, useEffect, useCallback } from "react";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { Section, SectionSettings } from "@/lib/types";
import type { SiteStyles } from "@/lib/styles";

interface Props {
  initialSections: Section[];
  siteStyles: SiteStyles;
}

export default function PreviewShell({ initialSections, siteStyles }: Props) {
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sync if initialSections change (e.g. iframe reload)
  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  // Listen for messages from the parent editor
  useEffect(() => {
    if (window === window.parent) return;

    const handleMessage = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg?.type) return;

      if (msg.type === "preview-update-section" && msg.sectionId) {
        setSections((prev) =>
          prev.map((s) => {
            if (s.id !== msg.sectionId) return s;
            return {
              ...s,
              data: msg.data ?? s.data,
              settings: (msg.settings ?? s.settings) as SectionSettings,
            };
          })
        );
      }

      if (msg.type === "preview-select" && msg.sectionId) {
        setSelectedId(msg.sectionId);
      }

      if (msg.type === "preview-deselect") {
        setSelectedId(null);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Handle clicks — send to parent
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (window === window.parent) return;
    let el = e.target as HTMLElement | null;
    while (el) {
      if (el.id && el.id.startsWith("section-")) {
        e.preventDefault();
        e.stopPropagation();
        const sectionId = el.id.replace("section-", "");
        setSelectedId(sectionId);
        window.parent.postMessage({ type: "preview-select-section", sectionId }, "*");
        return;
      }
      el = el.parentElement;
    }
  }, []);

  // Block link navigation
  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("a")) {
      e.preventDefault();
    }
  }, []);

  // Handle hover — highlight section
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    let el = e.target as HTMLElement | null;
    while (el) {
      if (el.id && el.id.startsWith("section-")) {
        setHoveredId(el.id.replace("section-", ""));
        return;
      }
      el = el.parentElement;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={handleClick}
      onClickCapture={handleLinkClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {sections.map((section) => (
        <div key={section.id} className="relative">
          <SectionRenderer section={section} siteStyles={siteStyles} />

          {/* Hover outline */}
          {hoveredId === section.id && selectedId !== section.id && (
            <div className="absolute inset-0 z-20 pointer-events-none ring-1 ring-gray-400 ring-inset">
              <span className="absolute top-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-charcoal/70 text-white">
                {section.section_type.replace(/_/g, " ")}
              </span>
            </div>
          )}

          {/* Selected outline */}
          {selectedId === section.id && (
            <div className="absolute inset-0 z-20 pointer-events-none ring-2 ring-teal ring-inset shadow-lg shadow-teal/10">
              <span className="absolute top-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal text-white">
                {section.section_type.replace(/_/g, " ")}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
