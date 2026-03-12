export type SponsorCategory =
  | "presenting_partner"
  | "premier_sponsor"
  | "feature_sponsor"
  | "official_sponsor"
  | "digital_sponsor"
  | "exhibiting_vendor"
  | "community_partner";

export interface Sponsor {
  /** Display name */
  name: string;
  /** Absolute path to the logo file in /public */
  logo: string;
  /** Company website URL */
  websiteUrl: string;
  /** Short description of the company */
  description: string;
  /** Sponsorship tier / category */
  category: SponsorCategory;
  /** Which VanFest events this sponsor is associated with */
  events: ("escape_to_the_cape" | "liftoff" | "all")[];
  /** Optional dark background for logos that are white/light */
  darkBg?: boolean;
}

/**
 * All sponsors sourced from vanfestusa.com, anescapetothecape.com,
 * and liftoffgathering.com as of March 2026.
 *
 * NOTE: Sponsor website links on vanfestusa.com currently point to
 * placeholder URLs (google.com). The URLs below are the real company
 * websites, sourced from the individual event pages.
 */
export const sponsors: Sponsor[] = [
  {
    name: "LiTime",
    logo: "/images/sponsors/litime.png",
    websiteUrl: "https://www.litime.com",
    description:
      "Lithium battery manufacturer specializing in LiFePO4 batteries for RVs, campervans, and off-grid solar systems.",
    category: "feature_sponsor",
    events: ["all"],
  },
  {
    name: "Boujee Builds",
    logo: "/images/sponsors/boujee-builds.png",
    websiteUrl: "https://www.boujeebuilds.com",
    description:
      "Custom campervan conversion company building high-end adventure vans.",
    category: "feature_sponsor",
    events: ["escape_to_the_cape", "liftoff"],
  },
  {
    name: "CompoCloset",
    logo: "/images/sponsors/compocloset.png",
    websiteUrl: "https://compocloset.com",
    description:
      "Composting toilet solutions for vanlife, RVs, tiny homes, and off-grid living.",
    category: "feature_sponsor",
    events: ["escape_to_the_cape", "liftoff"],
  },
  {
    name: "Embassy RV",
    logo: "/images/sponsors/embassy-rv.png",
    websiteUrl: "https://embassyrv.com",
    description:
      "RV and campervan parts, accessories, and conversion components.",
    category: "official_sponsor",
    events: ["escape_to_the_cape", "liftoff"],
  },
  {
    name: "Happy Elephant",
    logo: "/images/sponsors/happy-elephant.png",
    websiteUrl: "https://www.happyelephant.com",
    description:
      "Eco-friendly cleaning and personal care products for sustainable living.",
    category: "official_sponsor",
    events: ["liftoff"],
    darkBg: true,
  },
  {
    name: "Brevard Humane Society",
    logo: "/images/sponsors/brevard-humane-society.png",
    websiteUrl: "https://brevardhumanesociety.org",
    description:
      "Animal welfare nonprofit serving Brevard County, FL since 1952. Hosts meet-and-greet adoption events at VanFest: LIFTOFF.",
    category: "community_partner",
    events: ["liftoff"],
  },
  {
    name: "Groove Vans",
    logo: "/images/sponsors/groove-vans.png",
    websiteUrl: "https://www.groovevans.net",
    description: "Custom campervan builds and conversion services.",
    category: "official_sponsor",
    events: ["liftoff"],
  },
  {
    name: "AEONrv",
    logo: "/images/sponsors/aeonrv.svg",
    websiteUrl: "https://www.aeonrv.com",
    description:
      "Modern adventure vehicle manufacturer building innovative RVs and campervans.",
    category: "official_sponsor",
    events: ["liftoff"],
  },
  {
    name: "Open Road Mobile",
    logo: "/images/sponsors/open-road-mobile.png",
    websiteUrl: "https://openroadmobile.com",
    description:
      "Mobile connectivity solutions for RVs and campervans -- internet and networking on the road.",
    category: "official_sponsor",
    events: ["liftoff"],
  },
  {
    name: "CLIP",
    logo: "/images/sponsors/clip.png",
    websiteUrl: "https://clip.bike",
    description:
      "Electric bike conversion kit that clips onto any bicycle, ideal for vanlifers and campers.",
    category: "official_sponsor",
    events: ["escape_to_the_cape"],
  },
  {
    name: "Viewpoint Campervans",
    logo: "/images/sponsors/viewpoint-campervans.png",
    websiteUrl: "https://viewpointcampervans.com",
    description: "Campervan rental and conversion company.",
    category: "official_sponsor",
    events: ["escape_to_the_cape"],
  },
];

/** Sponsorship tier metadata for display */
export const sponsorTiers: Record<
  SponsorCategory,
  { label: string; color: string; sortOrder: number }
> = {
  presenting_partner: {
    label: "Presenting Partner",
    color: "#8ef5fd",
    sortOrder: 1,
  },
  premier_sponsor: {
    label: "Premier Sponsor",
    color: "#a4c2f4",
    sortOrder: 2,
  },
  feature_sponsor: {
    label: "Feature Sponsor",
    color: "#b6d7a8",
    sortOrder: 3,
  },
  official_sponsor: {
    label: "Official Sponsor",
    color: "#f9cb9c",
    sortOrder: 4,
  },
  digital_sponsor: {
    label: "Digital Sponsor",
    color: "#ea9999",
    sortOrder: 5,
  },
  exhibiting_vendor: {
    label: "Exhibiting Vendor",
    color: "#efefef",
    sortOrder: 6,
  },
  community_partner: {
    label: "Community Partner",
    color: "#d9d2e9",
    sortOrder: 7,
  },
};
