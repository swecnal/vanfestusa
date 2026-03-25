"use client";

import { useState, useEffect, useCallback } from "react";
import SectionRenderer from "@/components/sections/SectionRenderer";
import Navbar from "@/components/Navbar";
import FooterDivider from "@/components/FooterDivider";
import Footer from "@/components/Footer";
import type { Section, SectionSettings, FooterBuilderConfig, NavbarBuilderConfig, SavedNavbar } from "@/lib/types";
import type { SiteStyles } from "@/lib/styles";
import type { VehicleStreamConfig } from "@/components/VehicleStream";

interface Props {
  initialSections: Section[];
  siteStyles: SiteStyles;
  navbarConfig?: unknown;
  navbarBuilderConfig?: unknown;
  footerConfig?: unknown;
  footerBuilderConfig?: unknown;
  vehicleStreamConfig?: unknown;
  pageSlug?: string;
  navbars?: SavedNavbar[];
}

export default function PreviewShell({
  initialSections,
  siteStyles,
  navbarConfig,
  navbarBuilderConfig,
  footerConfig,
  footerBuilderConfig,
  vehicleStreamConfig,
  navbars,
}: Props) {
  const [sections, setSections] = useState(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [globalSelected, setGlobalSelected] = useState<"navbar" | "footer" | null>(null);
  const [liveNavbarConfig, setLiveNavbarConfig] = useState<NavbarBuilderConfig | null>(
    (navbarBuilderConfig as NavbarBuilderConfig | null) ?? null
  );
  const [liveFooterConfig, setLiveFooterConfig] = useState<FooterBuilderConfig | null>(
    (footerBuilderConfig as FooterBuilderConfig | null) ?? null
  );

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
        setGlobalSelected(null);
      }

      if (msg.type === "preview-deselect") {
        setSelectedId(null);
        setGlobalSelected(null);
      }

      if (msg.type === "preview-select-global" && msg.target) {
        setGlobalSelected(msg.target);
        setSelectedId(null);
      }

      if (msg.type === "preview-deselect-global") {
        setGlobalSelected(null);
      }

      if (msg.type === "preview-update-navbar" && msg.config) {
        setLiveNavbarConfig(msg.config as NavbarBuilderConfig);
      }

      if (msg.type === "preview-update-footer" && msg.config) {
        setLiveFooterConfig(msg.config as FooterBuilderConfig);
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
      if (el.id === "preview-navbar") {
        e.preventDefault();
        e.stopPropagation();
        setGlobalSelected("navbar");
        setSelectedId(null);
        window.parent.postMessage({ type: "preview-select-global", target: "navbar" }, "*");
        return;
      }
      if (el.id === "preview-footer" || el.id === "preview-divider") {
        e.preventDefault();
        e.stopPropagation();
        setGlobalSelected("footer");
        setSelectedId(null);
        window.parent.postMessage({ type: "preview-select-global", target: "footer" }, "*");
        return;
      }
      if (el.id && el.id.startsWith("section-")) {
        e.preventDefault();
        e.stopPropagation();
        const sectionId = el.id.replace("section-", "");
        setSelectedId(sectionId);
        setGlobalSelected(null);
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
  const [hoveredGlobal, setHoveredGlobal] = useState<"navbar" | "footer" | null>(null);

  const handleMouseOver = useCallback((e: React.MouseEvent) => {
    let el = e.target as HTMLElement | null;
    while (el) {
      if (el.id === "preview-navbar") {
        setHoveredGlobal("navbar");
        setHoveredId(null);
        return;
      }
      if (el.id === "preview-footer" || el.id === "preview-divider") {
        setHoveredGlobal("footer");
        setHoveredId(null);
        return;
      }
      if (el.id && el.id.startsWith("section-")) {
        setHoveredId(el.id.replace("section-", ""));
        setHoveredGlobal(null);
        return;
      }
      el = el.parentElement;
    }
    setHoveredId(null);
    setHoveredGlobal(null);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null);
    setHoveredGlobal(null);
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={handleClick}
      onClickCapture={handleLinkClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {/* Navbar — hidden when a page has its own navbar section */}
      {!sections.some((s) => s.section_type === "navbar") && (
      <div id="preview-navbar" className="relative cursor-pointer">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Navbar config={navbarConfig as any} builderConfig={liveNavbarConfig} embedded />
        {hoveredGlobal === "navbar" && globalSelected !== "navbar" && (
          <div className="absolute inset-0 z-[60] pointer-events-none ring-1 ring-gray-400 ring-inset">
            <span className="absolute bottom-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-charcoal/70 text-white">
              Navbar
            </span>
          </div>
        )}
        {globalSelected === "navbar" && (
          <div className="absolute inset-0 z-[60] pointer-events-none ring-2 ring-teal ring-inset shadow-lg shadow-teal/10">
            <span className="absolute bottom-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal text-white">
              Navbar
            </span>
          </div>
        )}
      </div>
      )}

      {/* Navbar sections always render first */}
      {sections.filter((s) => s.section_type === "navbar").map((section) => (
        <div key={section.id} className="relative">
          <SectionRenderer section={section} siteStyles={siteStyles} navbars={navbars} />
          {hoveredId === section.id && selectedId !== section.id && (
            <div className="absolute inset-0 z-20 pointer-events-none ring-1 ring-gray-400 ring-inset">
              <span className="absolute top-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-charcoal/70 text-white">
                {section.section_type.replace(/_/g, " ")}
              </span>
            </div>
          )}
          {selectedId === section.id && (
            <div className="absolute inset-0 z-20 pointer-events-none ring-2 ring-teal ring-inset shadow-lg shadow-teal/10">
              <span className="absolute top-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal text-white">
                {section.section_type.replace(/_/g, " ")}
              </span>
            </div>
          )}
        </div>
      ))}

      {/* Content sections */}
      {sections.filter((s) => s.section_type !== "navbar").map((section) => (
        <div key={section.id} className="relative">
          <SectionRenderer section={section} siteStyles={siteStyles} navbars={navbars} />

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

      {/* Footer separator */}
      <div className="relative my-2">
        <div className="border-t-2 border-dashed border-gray-300 mx-4" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
          Footer
        </span>
      </div>

      {/* Footer Divider (only shown for v1 footer) */}
      {!liveFooterConfig?.version && (
        <div id="preview-divider" className="relative cursor-pointer">
          <FooterDivider config={vehicleStreamConfig as VehicleStreamConfig | null} />
        </div>
      )}

      {/* Footer */}
      <div id="preview-footer" className="relative cursor-pointer">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Footer config={footerConfig as any} builderConfig={liveFooterConfig} />
        {hoveredGlobal === "footer" && globalSelected !== "footer" && (
          <div className="absolute inset-0 z-[60] pointer-events-none ring-1 ring-gray-400 ring-inset">
            <span className="absolute top-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-charcoal/70 text-white">
              Footer
            </span>
          </div>
        )}
        {globalSelected === "footer" && (
          <div className="absolute inset-0 z-[60] pointer-events-none ring-2 ring-teal ring-inset shadow-lg shadow-teal/10">
            <span className="absolute top-1 left-1 text-[8px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal text-white">
              Footer
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
