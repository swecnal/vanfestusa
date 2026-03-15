"use client";

import { useState } from "react";
import type { SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";

interface SponsorItem {
  name: string;
  logo: string;
  websiteUrl?: string;
  description?: string;
  category?: string;
  events?: string[];
  darkBg?: boolean;
}

interface SponsorListSectionData {
  heading?: { title: string; subtitle?: string; light?: boolean };
  displayMode: "accordion" | "grid" | "carousel";
  sponsors: SponsorItem[];
  eventFilter?: string;
  showExpandAll?: boolean;
}

const tierLabels: Record<string, { label: string; color: string; sortOrder: number }> = {
  presenting_partner: { label: "Presenting Partner", color: "#8ef5fd", sortOrder: 1 },
  premier_sponsor: { label: "Premier Sponsor", color: "#a4c2f4", sortOrder: 2 },
  feature_sponsor: { label: "Feature Sponsor", color: "#b6d7a8", sortOrder: 3 },
  official_sponsor: { label: "Official Sponsor", color: "#f9cb9c", sortOrder: 4 },
  digital_sponsor: { label: "Digital Sponsor", color: "#ea9999", sortOrder: 5 },
  exhibiting_vendor: { label: "Exhibiting Vendor", color: "#efefef", sortOrder: 6 },
  community_partner: { label: "Community Partner", color: "#d9d2e9", sortOrder: 7 },
};

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function SponsorListSection({ data, settings }: Props) {
  const d = data as unknown as SponsorListSectionData;
  const sponsors = d.sponsors || [];
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());

  // Group sponsors by category
  const grouped = sponsors.reduce<Record<string, SponsorItem[]>>((acc, s) => {
    const cat = s.category || "official_sponsor";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  // Sort tiers by sortOrder
  const sortedTiers = Object.keys(grouped).sort(
    (a, b) => (tierLabels[a]?.sortOrder ?? 99) - (tierLabels[b]?.sortOrder ?? 99)
  );

  const toggleTier = (tier: string) => {
    setExpandedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const expandAll = () => setExpandedTiers(new Set(sortedTiers));
  const collapseAll = () => setExpandedTiers(new Set());

  return (
    <section style={sectionSpacingStyles(settings)} className={`px-4 ${settings.customClasses || ""}`}>
      <div className={`mx-auto ${settings.maxWidth || "max-w-5xl"}`}>
        {d.heading && (
          <div className="text-center mb-10">
            <h2 className={`font-display font-black text-3xl sm:text-4xl mb-3 ${d.heading.light ? "text-white" : "text-charcoal"}`}>
              {d.heading.title}
            </h2>
            {d.heading.subtitle && (
              <p className={`text-lg ${d.heading.light ? "text-white/60" : "text-charcoal/60"}`}>
                {d.heading.subtitle}
              </p>
            )}
          </div>
        )}

        {d.showExpandAll !== false && sortedTiers.length > 1 && (
          <div className="flex justify-end gap-2 mb-4">
            <button onClick={expandAll} className="text-sm text-teal hover:text-teal-dark">Expand All</button>
            <span className="text-gray-300">|</span>
            <button onClick={collapseAll} className="text-sm text-teal hover:text-teal-dark">Collapse All</button>
          </div>
        )}

        <div className="space-y-3">
          {sortedTiers.map((tier) => {
            const tierInfo = tierLabels[tier] || { label: tier, color: "#ccc" };
            const isOpen = expandedTiers.has(tier);
            const tierSponsors = grouped[tier];

            return (
              <div key={tier} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleTier(tier)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tierInfo.color }}
                    />
                    <span className="font-display font-semibold text-charcoal">
                      {tierInfo.label}
                    </span>
                    <span className="text-sm text-gray-400">({tierSponsors.length})</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tierSponsors.map((sponsor) => (
                      <a
                        key={sponsor.name}
                        href={sponsor.websiteUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-teal/30 hover:shadow-sm transition-all"
                      >
                        <div className={`flex-shrink-0 w-16 h-16 rounded-lg flex items-center justify-center ${sponsor.darkBg ? "bg-charcoal" : "bg-gray-50"}`}>
                          <img
                            src={sponsor.logo}
                            alt={sponsor.name}
                            className="max-w-[48px] max-h-[48px] object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-charcoal text-sm">{sponsor.name}</p>
                          {sponsor.description && (
                            <p className="text-xs text-gray-500 line-clamp-2">{sponsor.description}</p>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
