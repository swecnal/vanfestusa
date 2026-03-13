import type { SectionType } from "./types";

export const SECTION_DEFAULTS: Record<SectionType, Record<string, unknown>> = {
  hero_carousel: {
    slides: [{ image: "/images/image01.jpg", alt: "Hero slide" }],
    overlay: {
      eventName: "Event Name",
      tagline: "Tagline here",
      primaryCta: { text: "Get Tickets", href: "#" },
    },
    autoplayInterval: 5000,
  },
  hero_simple: {
    title: "Page Title",
    subtitle: "",
    light: false,
  },
  text_block: {
    html: "<p>Enter your text here...</p>",
    alignment: "left",
    prose: true,
  },
  two_column_cards: {
    cards: [
      { title: "Card 1", body: "Description for card 1." },
      { title: "Card 2", body: "Description for card 2." },
    ],
  },
  feature_grid: {
    columns: 3,
    items: [
      { title: "Feature 1", description: "Description" },
      { title: "Feature 2", description: "Description" },
      { title: "Feature 3", description: "Description" },
    ],
  },
  event_cards: {
    events: [],
  },
  cta_cards: {
    columns: 3,
    cards: [
      { title: "Card 1", description: "Description", href: "#" },
    ],
  },
  cta_section: {
    title: "Call to Action",
    buttons: [{ text: "Learn More", href: "#", variant: "primary" }],
  },
  faq_accordion: {
    showExpandAll: true,
    items: [{ question: "Question?", answer: "Answer." }],
  },
  schedule_accordion: {
    showExpandAll: true,
    days: [],
  },
  sponsor_tiers: {
    tiers: [],
  },
  sponsor_list: {
    displayMode: "accordion",
    eventFilter: "all",
  },
  sponsor_marquee: {
    sponsors: [],
    speed: 30,
  },
  image_carousel: {
    images: [],
    autoplayInterval: 4000,
  },
  photo_strip: {
    images: [],
  },
  image_gallery: {
    images: [],
    columns: 3,
    enableLightbox: true,
  },
  wave_divider: {
    dividerType: "wave",
    fromColor: "white",
    toColor: "#1a1a1a",
    height: 60,
    frequency: 2,
    intensity: 50,
  },
  vehicle_convoy: {
    seed: 42,
    count: 6,
    reverse: false,
  },
  vehicle_stream: {
    seed: 777,
    count: 14,
    signs: ["COMMUNITY", "MUSIC", "MEMORIES", "VANFEST"],
  },
  contact_form: {
    recipientEmail: "hello@vanfestusa.com",
    contactCards: [
      { icon: "email", title: "Email", value: "hello@vanfestusa.com", href: "mailto:hello@vanfestusa.com" },
      { icon: "phone", title: "Phone", value: "805.826.3378", href: "tel:8058263378" },
    ],
  },
  html_block: {
    html: "<div>Custom HTML</div>",
  },
};
