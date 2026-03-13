// ─── Database Row Types ───

export interface CmsUser {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  role: "owner" | "admin" | "editor";
  must_change_password: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsSession {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  og_image: string | null;
  is_published: boolean;
  navbar_config: NavbarConfig | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface Section {
  id: string;
  page_id: string;
  section_type: SectionType;
  sort_order: number;
  data: Record<string, unknown>;
  settings: SectionSettings;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface GlobalSetting {
  key: string;
  value: unknown;
}

// ─── Section Types ───

export type SectionType =
  | "hero_carousel"
  | "hero_simple"
  | "text_block"
  | "two_column_cards"
  | "feature_grid"
  | "event_cards"
  | "cta_cards"
  | "cta_section"
  | "faq_accordion"
  | "schedule_accordion"
  | "sponsor_tiers"
  | "sponsor_list"
  | "sponsor_marquee"
  | "image_carousel"
  | "photo_strip"
  | "image_gallery"
  | "wave_divider"
  | "vehicle_convoy"
  | "vehicle_stream"
  | "contact_form"
  | "html_block";

// ─── Section Settings (common to all) ───

export interface SectionSettings {
  bgColor?: string;
  bgImage?: string;
  bgImageOpacity?: number;
  paddingY?: string;
  paddingX?: string;
  maxWidth?: string;
  sectionId?: string;
  scrollMarginTop?: string;
  customClasses?: string;
}

// ─── Section Data Shapes ───

export interface HeroCarouselData {
  slides: Array<{ image: string; alt: string }>;
  overlay: {
    label?: string;
    eventName: string;
    tagline?: string;
    location?: string;
    locationUrl?: string;
    dates?: string;
    primaryCta?: { text: string; href: string; external?: boolean };
    secondaryCta?: { text: string; href: string; external?: boolean };
    labelStyle?: import("@/lib/styles").TextStyleConfig;
    eventNameStyle?: import("@/lib/styles").TextStyleConfig;
    taglineStyle?: import("@/lib/styles").TextStyleConfig;
    locationStyle?: import("@/lib/styles").TextStyleConfig;
    datesStyle?: import("@/lib/styles").TextStyleConfig;
  };
  autoplayInterval?: number;
}

export interface HeroSimpleData {
  title: string;
  subtitle?: string;
  light?: boolean;
  bgImage?: string;
}

export interface TextBlockData {
  html: string;
  alignment?: "left" | "center" | "right";
  prose?: boolean;
}

export interface TwoColumnCardsData {
  heading?: string;
  headingSubtitle?: string;
  columns?: 1 | 2 | 3 | 4;
  cards: Array<{
    title: string;
    subtitle?: string;
    body: string;
    bgColor?: string;
    icon?: string;
    image?: string;
    imagePosition?: "small-left" | "small-right" | "small-center" | "full-width" | "background";
    titleStyle?: import("@/lib/styles").TextStyleConfig;
    subtitleStyle?: import("@/lib/styles").TextStyleConfig;
    bodyStyle?: import("@/lib/styles").TextStyleConfig;
    button?: { text: string; href: string; external?: boolean; styleId?: string };
  }>;
  ctaButton?: { text: string; href: string; external?: boolean };
}

export interface FeatureGridData {
  heading?: { title: string; subtitle?: string; light?: boolean };
  columns?: 2 | 3 | 4;
  items: Array<{
    iconSvg?: string;
    iconImage?: string;
    title: string;
    subtitle?: string;
    description: string;
    titleStyle?: import("@/lib/styles").TextStyleConfig;
    subtitleStyle?: import("@/lib/styles").TextStyleConfig;
    descriptionStyle?: import("@/lib/styles").TextStyleConfig;
    action?: {
      type: "button" | "link";
      text: string;
      href: string;
      external?: boolean;
      styleId?: string;
    };
  }>;
}

export interface EventCardsData {
  heading?: { title: string; subtitle?: string };
  events: Array<{
    name: string;
    location: string;
    dates: string;
    description: string;
    gradient: string;
    tag: string;
    image: string;
    href: string;
    ticketUrl: string;
    fontOverride?: string;
  }>;
}

export interface CtaCardsData {
  heading?: { title: string; subtitle?: string };
  cards: Array<{
    title: string;
    description: string;
    href: string;
    image?: string;
  }>;
  columns?: 2 | 3;
}

export interface CtaSectionData {
  title: string;
  subtitle?: string;
  light?: boolean;
  bgColor?: string;
  buttons: Array<{
    text: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
    external?: boolean;
    bounce?: boolean;
  }>;
}

export interface FaqAccordionData {
  heading?: string;
  showExpandAll?: boolean;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ScheduleAccordionData {
  heading?: string;
  disclaimer?: string;
  showExpandAll?: boolean;
  days: Array<{
    day: string;
    tag: string;
    tagColor: string;
    items: Array<{
      time: string;
      location: string;
      activity: string;
      description: string;
    }>;
  }>;
}

export interface SponsorTiersData {
  heading?: string;
  introText?: string;
  disclaimerText?: string;
  wrapInOuterAccordion?: boolean;
  outerAccordionLabel?: string;
  accentColor?: string;
  emailSubject?: string;
  ctaText?: string;
  tiers: Array<{
    name: string;
    price: string;
    frontage?: string | null;
    frontageNote?: string;
    summary: string;
    categories: Array<{
      heading: string;
      items: string[];
    }>;
  }>;
}

export interface SponsorListData {
  heading?: { title: string; subtitle?: string; light?: boolean };
  showExpandAll?: boolean;
  displayMode: "accordion" | "grid" | "carousel";
  eventFilter?: string;
}

export interface SponsorMarqueeData {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  speed?: number;
  sponsors: Array<{
    name: string;
    logo: string;
    websiteUrl?: string;
    darkBg?: boolean;
  }>;
}

export interface ImageCarouselData {
  heading?: { title: string; subtitle?: string; light?: boolean };
  images: Array<{ src: string; alt: string }>;
  autoplayInterval?: number;
  ctaButtons?: Array<{
    text: string;
    href: string;
    variant: string;
    external?: boolean;
  }>;
}

export interface PhotoStripData {
  images: Array<{ src: string; alt: string }>;
  height?: string;
  columns?: number;
}

export interface ImageGalleryData {
  heading?: string;
  images: Array<{ src: string; alt: string }>;
  columns?: 1 | 2 | 3 | 4;
  enableLightbox?: boolean;
}

export interface WaveDividerData {
  fromColor: string;
  toColor: string;
  height?: number;
  svgPath?: string;
}

export interface VehicleConvoyData {
  seed?: number;
  count?: number;
  reverse?: boolean;
  marginTop?: string;
}

export interface VehicleStreamData {
  seed?: number;
  count?: number;
  signs?: string[];
}

export interface ContactFormData {
  introText?: string;
  contactCards?: Array<{
    icon: string;
    title: string;
    value: string;
    href: string;
  }>;
  formHeading?: string;
  recipientEmail: string;
  socialLinks?: Array<{ platform: string; url: string; label: string }>;
}

export interface HtmlBlockData {
  html: string;
  sandboxed?: boolean;
}

// ─── Navbar Config ───

export interface NavbarConfig {
  mode?: "default" | "escape" | "liftoff";
  links?: Array<{
    label: string;
    href: string;
    children?: Array<{ label: string; href: string }>;
  }>;
}

// ─── Page with Sections (joined) ───

export interface PageWithSections extends Page {
  sections: Section[];
}

// ─── Section type label map ───

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero_carousel: "Hero Carousel",
  hero_simple: "Hero Banner",
  text_block: "Text Block",
  two_column_cards: "Column Cards",
  feature_grid: "Feature Grid",
  event_cards: "Event Cards",
  cta_cards: "CTA Cards",
  cta_section: "CTA Section",
  faq_accordion: "FAQ Accordion",
  schedule_accordion: "Schedule",
  sponsor_tiers: "Sponsor Tiers",
  sponsor_list: "Sponsor List",
  sponsor_marquee: "Marquee",
  image_carousel: "Image Carousel",
  photo_strip: "Photo Strip",
  image_gallery: "Image Gallery",
  wave_divider: "Divider",
  vehicle_convoy: "Vehicle Convoy",
  vehicle_stream: "Vehicle Stream",
  contact_form: "Contact Form",
  html_block: "HTML Block",
};
