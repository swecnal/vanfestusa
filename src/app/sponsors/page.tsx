"use client";

import { useState, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";
import { sponsors, sponsorTiers, type Sponsor, type SponsorCategory } from "@/data/sponsors";

/** Derive a short category tag from the sponsor description. */
function getCategoryTag(description: string): string {
  const lower = description.toLowerCase();

  if (lower.includes("battery") || lower.includes("lifepo4") || lower.includes("lithium"))
    return "Batteries & Electrical";
  if (lower.includes("campervan conversion") || lower.includes("custom campervan") || lower.includes("campervan builds"))
    return "Van Conversions";
  if (lower.includes("composting toilet") || lower.includes("compost"))
    return "Composting Toilets";
  if (lower.includes("rv") && lower.includes("parts"))
    return "RV Parts & Accessories";
  if (lower.includes("adventure vehicle") || lower.includes("innovative rvs"))
    return "Adventure Vehicles";
  if (lower.includes("cleaning") || lower.includes("personal care") || lower.includes("eco-friendly"))
    return "Eco-Friendly Products";
  if (lower.includes("animal welfare") || lower.includes("humane") || lower.includes("adoption"))
    return "Animal Welfare";
  if (lower.includes("campervan rental"))
    return "Van Rentals & Conversions";
  if (lower.includes("mobile connectivity") || lower.includes("internet") || lower.includes("networking"))
    return "Mobile Connectivity";
  if (lower.includes("electric bike") || lower.includes("bicycle"))
    return "E-Bikes & Mobility";

  return "Vanlife Partner";
}

/** Group sponsors by category sorted by tier sort order. */
function groupSponsorsByTier(): { category: SponsorCategory; label: string; sponsors: Sponsor[] }[] {
  const groups: Partial<Record<SponsorCategory, Sponsor[]>> = {};

  for (const sponsor of sponsors) {
    if (!groups[sponsor.category]) {
      groups[sponsor.category] = [];
    }
    groups[sponsor.category]!.push(sponsor);
  }

  return (Object.keys(groups) as SponsorCategory[])
    .sort((a, b) => sponsorTiers[a].sortOrder - sponsorTiers[b].sortOrder)
    .map((cat) => ({
      category: cat,
      label: sponsorTiers[cat].label,
      sponsors: groups[cat]!,
    }));
}

export default function SponsorsPage() {
  const [allOpen, setAllOpen] = useState(false);
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  const toggleAll = () => {
    const newState = !allOpen;
    setAllOpen(newState);
    detailsRefs.current.forEach((el) => {
      if (el) el.open = newState;
    });
  };

  const tierGroups = groupSponsorsByTier();

  // Build a flat index so refs line up across all tier groups
  let flatIndex = 0;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image26.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="Our Sponsors"
            subtitle="The incredible brands and partners that make VanFest possible."
            light
          />
        </div>
      </section>

      {/* Sponsor Accordions */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl">
          {/* Expand / Collapse All */}
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${allOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {allOpen ? "Collapse All" : "Expand All"}
            </button>
          </div>

          {/* Tier groups */}
          <div className="space-y-12">
            {tierGroups.map((group) => (
              <div key={group.category}>
                {/* Tier heading */}
                <h3 className="font-display font-bold text-xl md:text-2xl text-charcoal mb-4 flex items-center gap-3">
                  <span
                    className="inline-block w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: sponsorTiers[group.category].color }}
                  />
                  {group.label}
                </h3>

                <div className="space-y-4">
                  {group.sponsors.map((sponsor) => {
                    const idx = flatIndex++;
                    const tag = getCategoryTag(sponsor.description);

                    return (
                      <details
                        key={sponsor.name}
                        ref={(el) => { detailsRefs.current[idx] = el; }}
                        className="group bg-sand rounded-2xl overflow-hidden"
                      >
                        {/* Collapsed summary */}
                        <summary className="flex items-center gap-4 cursor-pointer p-5 list-none">
                          {/* Logo */}
                          <div className="bg-white rounded-xl p-4 flex-shrink-0 w-16 h-16 flex items-center justify-center">
                            <img
                              src={sponsor.logo}
                              alt={`${sponsor.name} logo`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>

                          {/* Name + tag */}
                          <div className="flex-1 min-w-0">
                            <a
                              href={sponsor.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-display font-semibold text-charcoal hover:text-teal transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {sponsor.name}
                            </a>
                            <span className="block text-xs text-charcoal/50 mt-0.5">{tag}</span>
                          </div>

                          {/* Chevron */}
                          <svg
                            className="w-5 h-5 text-teal flex-shrink-0 ml-auto group-open:rotate-180 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </summary>

                        {/* Expanded content */}
                        <div className="px-5 pb-6">
                          <div className="border-t border-charcoal/10 pt-5">
                            {/* Larger logo + details */}
                            <div className="flex flex-col sm:flex-row gap-6">
                              <div className="bg-white rounded-xl p-6 flex-shrink-0 w-28 h-28 flex items-center justify-center self-start">
                                <img
                                  src={sponsor.logo}
                                  alt={`${sponsor.name} logo`}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <a
                                  href={sponsor.websiteUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-display font-bold text-lg text-charcoal hover:text-teal transition-colors"
                                >
                                  {sponsor.name}
                                </a>
                                <span className="inline-block ml-3 text-xs font-medium text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>

                                <p className="mt-3 text-charcoal/70 leading-relaxed text-sm">
                                  {sponsor.description}
                                </p>

                                {/* Events placeholder */}
                                <div className="mt-4 pt-4 border-t border-charcoal/10">
                                  <h4 className="font-display font-semibold text-sm text-charcoal mb-1">
                                    Which events
                                  </h4>
                                  <p className="text-charcoal/50 text-sm italic">
                                    Event details coming soon
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
