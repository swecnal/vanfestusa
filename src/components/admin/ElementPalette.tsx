"use client";

import { useState } from "react";
import { usePageEditor } from "@/lib/page-editor-context";
import type { SectionType } from "@/lib/types";

interface ElementItem {
  type: SectionType;
  label: string;
}

interface ElementCategory {
  label: string;
  items: ElementItem[];
}

const ELEMENT_CATEGORIES: ElementCategory[] = [
  {
    label: "Heroes",
    items: [
      { type: "hero_carousel", label: "Hero Carousel" },
      { type: "hero_simple", label: "Hero Banner" },
    ],
  },
  {
    label: "Content",
    items: [
      { type: "text_block", label: "Text Block" },
      { type: "html_block", label: "HTML Block" },
    ],
  },
  {
    label: "Cards & Grids",
    items: [
      { type: "two_column_cards", label: "Two-Column Cards" },
      { type: "feature_grid", label: "Feature Grid" },
      { type: "event_cards", label: "Event Cards" },
      { type: "cta_cards", label: "CTA Cards" },
    ],
  },
  {
    label: "Actions",
    items: [
      { type: "cta_section", label: "CTA Section" },
      { type: "contact_form", label: "Contact Form" },
    ],
  },
  {
    label: "Accordions",
    items: [
      { type: "faq_accordion", label: "FAQ Accordion" },
      { type: "schedule_accordion", label: "Schedule" },
      { type: "sponsor_tiers", label: "Sponsor Tiers" },
      { type: "sponsor_list", label: "Sponsor List" },
    ],
  },
  {
    label: "Media",
    items: [
      { type: "image_carousel", label: "Image Carousel" },
      { type: "photo_strip", label: "Photo Strip" },
      { type: "image_gallery", label: "Image Gallery" },
      { type: "sponsor_marquee", label: "Marquee" },
    ],
  },
  {
    label: "Decorative",
    items: [
      { type: "wave_divider", label: "Wave Divider" },
      { type: "vehicle_convoy", label: "Vehicle Convoy" },
      { type: "vehicle_stream", label: "Vehicle Stream" },
    ],
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  Heroes: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z",
  Content: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12",
  "Cards & Grids": "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zm0 9.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zm9.75-9.75A2.25 2.25 0 0115.75 3.75H18a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zm0 9.75a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 15.75V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  Actions: "M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59",
  Accordions: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z",
  Media: "M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z M15 12.75a3 3 0 11-6 0 3 3 0 016 0z",
  Decorative: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
};

export default function ElementPalette({ collapsed }: { collapsed?: boolean }) {
  const { addSection } = usePageEditor();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Heroes: true,
    Content: true,
    "Cards & Grids": true,
    Actions: true,
    Accordions: true,
    Media: true,
    Decorative: true,
  });

  const isActive = addSection !== null;

  const toggleCategory = (label: string) => {
    setExpandedCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleDragStart = (e: React.DragEvent, type: SectionType) => {
    if (!isActive) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("application/section-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleClick = (type: SectionType) => {
    if (isActive && addSection) {
      addSection(type);
    }
  };

  if (collapsed) {
    return (
      <div className="px-2 py-1">
        <button
          className="w-full p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-colors"
          title="Elements"
        >
          <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {ELEMENT_CATEGORIES.map((cat) => (
        <div key={cat.label}>
          {/* Category header */}
          <button
            onClick={() => toggleCategory(cat.label)}
            className="w-full flex items-center gap-2 px-3 py-1.5 text-white/40 hover:text-white/70 transition-colors"
          >
            <svg
              className={`w-3 h-3 transition-transform flex-shrink-0 ${
                expandedCategories[cat.label] ? "rotate-90" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={CATEGORY_ICONS[cat.label] || ""} />
            </svg>
            <span className="text-[10px] uppercase tracking-wider font-semibold truncate">
              {cat.label}
            </span>
          </button>

          {/* Category items */}
          {expandedCategories[cat.label] && (
            <div className="ml-4 space-y-px">
              {cat.items.map((item) => (
                <div
                  key={item.type}
                  draggable={isActive}
                  onDragStart={(e) => handleDragStart(e, item.type)}
                  onClick={() => handleClick(item.type)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${
                    isActive
                      ? "text-white/60 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing"
                      : "text-white/20 cursor-default"
                  }`}
                  title={isActive ? `Drag or click to add ${item.label}` : "Open a page to add elements"}
                >
                  <svg className="w-3 h-3 flex-shrink-0 text-teal/60" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm-4 8a2 2 0 104 0 2 2 0 00-4 0zm12-14a2 2 0 11-4 0 2 2 0 014 0zm-4 6a2 2 0 104 0 2 2 0 00-4 0zm0 8a2 2 0 104 0 2 2 0 00-4 0z" />
                  </svg>
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {!isActive && (
        <p className="px-4 py-2 text-[10px] text-white/20 italic">
          Open a page to add elements
        </p>
      )}
    </div>
  );
}
