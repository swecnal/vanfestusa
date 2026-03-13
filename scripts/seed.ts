/**
 * VanFest CMS Seed Script
 * Run: npx tsx scripts/seed.ts
 *
 * Seeds the database with:
 * 1. Owner admin user
 * 2. All 15 pages with metadata
 * 3. All sections per page with actual content
 * 4. Global settings
 */

import { createClient } from "@supabase/supabase-js";
import { hash } from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.replace(/\r/g, "").split("\n")) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}
console.log("Loaded env from:", envPath);
console.log("Supabase URL:", env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗");

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Import data files
import { faqs } from "../src/data/faqs.js";
import { escapeSchedule } from "../src/data/escape-schedule.js";
import { sponsorTiers } from "../src/data/sponsor-tiers.js";
import { sponsors } from "../src/data/sponsors.js";

// ─── Types ────────────────────────────────────────────────────────────────

interface PageDef {
  slug: string;
  title: string;
  description: string;
  og_image?: string;
}

interface SectionDef {
  section_type: string;
  data: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

// ─── Pages ────────────────────────────────────────────────────────────────

const pages: PageDef[] = [
  { slug: "/", title: "VanFest — The Ultimate Vanlife Experience", description: "Part festival, part expo, and ALL focused around showcasing and celebrating the amazing vanlife / nomadic community." },
  { slug: "/events", title: "Events | VanFest", description: "Upcoming VanFest events" },
  { slug: "/events/escape", title: "Escape to the Cape | VanFest", description: "The biggest vanlife celebration in New England! August 20-24, 2026 at Cape Cod Fairgrounds." },
  { slug: "/events/liftoff", title: "LIFTOFF! | VanFest", description: "VanFest LIFTOFF! — Details to be announced." },
  { slug: "/about", title: "About | VanFest", description: "Learn about VanFest, the ultimate vanlife experience" },
  { slug: "/faq", title: "FAQ | VanFest", description: "Frequently asked questions about VanFest events" },
  { slug: "/contact", title: "Contact | VanFest", description: "Get in touch with VanFest" },
  { slug: "/sponsors", title: "Sponsors | VanFest", description: "The incredible brands and partners that make VanFest possible" },
  { slug: "/get-involved", title: "Get Involved | VanFest", description: "Exhibit your rig, become a sponsor or vendor, or join our team" },
  { slug: "/media", title: "Media | VanFest", description: "Relive the moments from past VanFest events" },
  { slug: "/terms", title: "Terms & Conduct | VanFest", description: "VanFest terms of service, code of conduct, and community guidelines" },
  { slug: "/privacy", title: "Privacy Policy | VanFest", description: "VanFest privacy policy — how we collect, use, and protect your data" },
  { slug: "/magnet", title: "Found a Magnet? | VanFest", description: "You found a VanFest magnet! Here's what to do." },
  { slug: "/merch", title: "Merch | VanFest", description: "Official VanFest merchandise" },
  { slug: "/map", title: "Event Map | VanFest", description: "Find your way around VanFest" },
];

// ─── Section Definitions Per Page ─────────────────────────────────────────

const sponsorMarqueeSponsors = sponsors.map((s) => ({
  name: s.name,
  logo: s.logo,
  websiteUrl: s.websiteUrl,
}));

const faqItems = faqs.map((f) => ({ question: f.q, answer: f.a }));

const scheduleDays = escapeSchedule.map((d) => ({
  day: d.day,
  tag: d.tag,
  tagColor: d.color,
  items: d.items.map((i) => ({
    time: i.time,
    location: i.location,
    activity: i.activity,
    description: i.desc,
  })),
}));

const sponsorTierData = sponsorTiers.map((t) => ({
  name: t.name,
  price: t.price,
  summary: t.summary,
  categories: t.categories,
}));

const sponsorListData = sponsors.map((s) => ({
  name: s.name,
  logo: s.logo,
  websiteUrl: s.websiteUrl,
  description: s.description,
  category: s.category,
  events: s.events,
  darkBg: s.darkBg,
}));

// ─── Feature Icons (SVG paths) ────────────────────────────────────────────

const featureIcons = {
  workshops: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
  vendors: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
  tours: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>',
  community: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
  inspiration: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
  music: '<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>',
};

// ─── Section Definitions Map ──────────────────────────────────────────────

function getSections(slug: string): SectionDef[] {
  switch (slug) {
    // ══════════════════════════════════════════════════════════════════════
    // HOMEPAGE
    // ══════════════════════════════════════════════════════════════════════
    case "/":
      return [
        {
          section_type: "hero_carousel",
          data: {
            slides: [
              { image: "/images/image127.jpg", alt: "VanFest gathering at Cape Cod" },
              { image: "/images/image153.jpg", alt: "VanFest community event" },
              { image: "/images/image154.jpg", alt: "VanFest vans lined up" },
              { image: "/images/image155.jpg", alt: "VanFest sunset gathering" },
              { image: "/images/image156.jpg", alt: "VanFest festival scene" },
            ],
            overlay: {
              eventName: "Escape to the Cape",
              tagline: "The biggest vanlife celebration in New England!",
              location: "Cape Cod Fairgrounds — East Falmouth, MA",
              locationUrl: "https://www.google.com/maps/place/Cape+Cod+Fairgrounds/data=!4m2!3m1!1s0x89e4d7e5b8f3b8a7:0x4b3b8b8b8b8b8b8b",
              dates: "August 20th - 24th, 2026",
              primaryCta: { text: "Get Tickets", href: "https://vanfest.ticketspice.com/escape2026" },
              secondaryCta: { text: "Event Details", href: "/events/escape" },
            },
            autoplayInterval: 5000,
          },
        },
        {
          section_type: "vehicle_convoy",
          data: { seed: 42, count: 6, reverse: false },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-3xl md:text-4xl text-charcoal text-center mb-2">What is VanFest?</h2>
<p class="text-gray-500 text-center mb-8 max-w-2xl mx-auto">Part festival, part expo, and ALL focused around showcasing and celebrating the amazing vanlife / nomadic community.</p>
<p class="text-gray-600 text-center max-w-3xl mx-auto">VanFest gathers hundreds of converted vans, buses, and everything in-between for music, games, learning, and memories. This long-weekend event brings together the entire nomadic community for four days and nights of connection, celebration, and inspiration.</p>`,
            alignment: "center",
            prose: true,
          },
        },
        {
          section_type: "two_column_cards",
          data: {
            cards: [
              {
                title: "Camping & Festival",
                body: "Open to everyone — whether you're in a van, bus, car/SUV, or just bringing a tent. Four unforgettable days and nights of live music, dance parties, epic potlucks, workshops, yoga, and more!",
              },
              {
                title: "Public Expo & Tours",
                body: "Van curious? Join us for unlimited tours of dozens of converted vans & buses, live music, local food trucks, workshops, lifestyle influencers, and industry-leading vendors. Kids are free!",
              },
            ],
          },
        },
        {
          section_type: "feature_grid",
          data: {
            columns: 3,
            items: [
              { iconSvg: featureIcons.workshops, title: "Workshops & Classes", description: "Expert-led sessions, panels, and hands-on demos to help you hit the road the RIGHT way." },
              { iconSvg: featureIcons.vendors, title: "Amazing Vendors", description: "Industry-leading vanlife vendors and sponsors showcasing the latest gear and builds." },
              { iconSvg: featureIcons.tours, title: "Van & Rig Tours", description: "Dozens of amazing, unique conversions open for tours at every event." },
              { iconSvg: featureIcons.community, title: "Community", description: "Connect with hundreds of like-minded vanlifers, nomads, and travelers." },
              { iconSvg: featureIcons.inspiration, title: "Inspiration", description: "Get inspired for YOUR nomadic adventure from seasoned travelers and first-timers alike." },
              { iconSvg: featureIcons.music, title: "Live Music", description: "Live performances, dance parties, and unforgettable nights under the stars." },
            ],
          },
          settings: { sectionId: "features" },
        },
        {
          section_type: "wave_divider",
          data: { fromColor: "white", toColor: "#1a1a1a" },
        },
        {
          section_type: "vehicle_convoy",
          data: { seed: 99, count: 5, reverse: true, marginTop: "0px" },
          settings: { bgColor: "#1a1a1a" },
        },
        {
          section_type: "event_cards",
          data: {
            heading: "Upcoming Events",
            events: [
              {
                name: "Escape to the Cape",
                location: "Cape Cod Fairgrounds, East Falmouth, MA",
                dates: "August 20 - 24, 2026",
                description: "Let's Escape (back to) the Cape this summer! We'll be on picturesque Cape Cod for the second annual largest vanlife and nomadic celebration in New England!",
                gradient: "from-blue-600 to-teal",
                tag: "Early Bird Tickets On Sale!",
                image: "/images/image127.jpg",
                href: "/events/escape",
                ticketUrl: "https://vanfest.ticketspice.com/escape2026",
              },
              {
                name: "LIFTOFF!",
                location: "",
                dates: "Details to be Announced",
                description: "Details coming soon for our Florida event! Stay tuned for what promises to be an unforgettable experience.",
                gradient: "from-purple-600 to-pink-500",
                tag: "Coming Soon",
                image: "/images/image157.jpg",
                href: "/events/liftoff",
                ticketUrl: "https://tickets.vanfestusa.com",
              },
            ],
          },
          settings: { bgColor: "#1a1a1a", paddingY: "py-16" },
        },
        {
          section_type: "cta_cards",
          data: {
            heading: "Get Involved!",
            subheading: "Want to be a part of the ultimate vanlife experience?",
            columns: 3,
            cards: [
              { title: "Exhibit Your Rig", description: "Open your doors and inspire the next generation of nomads.", href: "/get-involved#exhibit" },
              { title: "Sponsors & Vendors", description: "Showcase your brand to the vanlife community.", href: "/get-involved#sponsors" },
              { title: "Jobs @ VanFest", description: "Volunteer or join our team at the next event.", href: "/get-involved#jobs" },
            ],
          },
        },
        {
          section_type: "sponsor_marquee",
          data: { sponsors: sponsorMarqueeSponsors, speed: 30 },
        },
        {
          section_type: "image_carousel",
          data: {
            heading: "Check Out These Builds!",
            subheading: "VanFest has dozens of amazing, unique conversions open for tours at each event.",
            images: [
              { src: "/images/image07.jpg", alt: "Van build" },
              { src: "/images/image12.jpg", alt: "Van interior" },
              { src: "/images/image14.jpg", alt: "Van conversion" },
              { src: "/images/image19.jpg", alt: "Van touring" },
              { src: "/images/image10.jpg", alt: "Custom build" },
              { src: "/images/image09.jpg", alt: "Festival van" },
              { src: "/images/image25.jpg", alt: "VanFest rigs" },
              { src: "/images/image21.jpg", alt: "VanFest vendors" },
            ],
            ctaButtons: [
              { text: "View Gallery", href: "/media", variant: "primary" },
              { text: "Exhibit My Rig!", href: "/get-involved#exhibit", variant: "outline" },
            ],
            bgImage: "/images/image24.jpg",
            autoplayInterval: 4000,
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // EVENTS
    // ══════════════════════════════════════════════════════════════════════
    case "/events":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "VanFest Events",
            subtitle: "Building community through connection and experiences.",
            bgImage: "/images/image01.jpg",
            light: true,
          },
        },
        {
          section_type: "photo_strip",
          data: {
            images: [
              { src: "/images/image08.jpg", alt: "VanFest" },
              { src: "/images/image09.jpg", alt: "VanFest" },
              { src: "/images/image10.jpg", alt: "VanFest" },
              { src: "/images/image06.jpg", alt: "VanFest" },
            ],
          },
        },
        {
          section_type: "event_cards",
          data: {
            events: [
              {
                name: "Escape to the Cape",
                location: "Cape Cod Fairgrounds, East Falmouth, MA",
                dates: "August 20 - 24, 2026",
                description: "Let's Escape (back to) the Cape this summer! We'll be on picturesque Cape Cod for the second annual largest vanlife and nomadic celebration in New England!",
                gradient: "from-blue-600 to-teal",
                tag: "Early Bird Tickets On Sale!",
                image: "/images/image127.jpg",
                href: "/events/escape",
                ticketUrl: "https://vanfest.ticketspice.com/escape2026",
              },
              {
                name: "LIFTOFF!",
                location: "",
                dates: "Details to be Announced",
                description: "Details coming soon for our Florida event! Stay tuned for what promises to be an unforgettable experience.",
                gradient: "from-purple-600 to-pink-500",
                tag: "Coming Soon",
                image: "/images/image157.jpg",
                href: "/events/liftoff",
                ticketUrl: "https://tickets.vanfestusa.com",
              },
            ],
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // ESCAPE TO THE CAPE
    // ══════════════════════════════════════════════════════════════════════
    case "/events/escape":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Escape to the Cape",
            subtitle: "Cape Cod Fairgrounds — 1220 Nathan Ellis Hwy, East Falmouth, MA 02536\nAugust 20 - 24, 2026",
            bgImage: "/images/image127.jpg",
            light: true,
            tag: "Early Bird Tickets On Sale!",
            gradient: "from-blue-600 to-teal",
          },
        },
        {
          section_type: "photo_strip",
          data: {
            images: [
              { src: "/images/image08.jpg", alt: "VanFest" },
              { src: "/images/image09.jpg", alt: "VanFest" },
              { src: "/images/image10.jpg", alt: "VanFest" },
              { src: "/images/image06.jpg", alt: "VanFest" },
            ],
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<p>Let's Escape (back to) the Cape this summer! We'll be on picturesque Cape Cod for the second annual largest vanlife and nomadic celebration in New England!</p>
<p>Join us for four days/nights of community, connection, and celebration. This event will gather hundreds of converted vans, buses, and everything in-between coming together for music, games, learning, and memories.</p>`,
            alignment: "center",
            prose: true,
          },
        },
        {
          section_type: "two_column_cards",
          data: {
            cards: [
              {
                title: "Camping & Festival",
                subtitle: "Thursday 8/20 to Monday 8/24",
                body: "Camping is open to everyone, whether you're in a van, bus, car/SUV, or just bringing a tent. Join us for four unforgettable days and nights filled with live music, dance parties, epic potlucks, hands-on workshops, expert-led classes, group fitness, yoga, and more!",
              },
              {
                title: "Public Expo & Tours",
                subtitle: "Sat 8/22 & Sun 8/23 — 11am to 5pm",
                body: "Van curious? Join us for unlimited tours of dozens of converted vans & buses, live music, local food trucks, workshops, discussion panels, lifestyle influencers, industry-leading vendors, and everything else you need for YOUR nomadic adventure! Kids are free!",
              },
            ],
          },
        },
        {
          section_type: "cta_section",
          data: {
            title: "",
            buttons: [
              { text: "Get Escape to the Cape Tickets", href: "https://vanfest.ticketspice.com/escape2026", variant: "primary" },
            ],
          },
        },
        {
          section_type: "schedule_accordion",
          data: {
            heading: "Event Schedule",
            disclaimer: "Schedule is tentative and subject to change. Detailed schedule with specific performers and workshop topics coming soon!",
            showExpandAll: true,
            days: scheduleDays,
          },
          settings: { sectionId: "schedule" },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-2xl text-charcoal mb-4">Sponsors & Vendors</h2>
<p>VanFest partners with industry-leading vanlife brands, local businesses, and community organizations to create the best possible experience for attendees.</p>
<p><em>We intentionally limit the number of sponsors to ensure maximum visibility and authentic engagement. We only work with brands run by people who care and who stand behind what they offer.</em></p>`,
            prose: true,
          },
          settings: { sectionId: "sponsors" },
        },
        {
          section_type: "sponsor_tiers",
          data: {
            tiers: sponsorTierData,
            contactEmail: "hello@vanfestusa.com",
            contactSubject: "Escape to the Cape — Sponsorship / Vendor Inquiry",
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<div class="flex flex-col md:flex-row gap-8 items-start">
<div class="md:w-1/2"><img src="/images/image12.jpg" alt="Van builds on display at VanFest" class="rounded-xl w-full" /></div>
<div class="md:w-1/2">
<h2 class="font-display font-black text-2xl text-charcoal mb-4">Exhibit Your Rig</h2>
<p>On the Saturday and Sunday of the event, we encourage everyone to open their doors to the public (as well as other nomads) during certain hours to make new friends and help others get a glimpse into what a nomadic life is all about.</p>
<h3 class="font-semibold mt-4 mb-2">Exhibitor Benefits</h3>
<ul>
<li>First come, first placed parking closest to the action</li>
<li>Shoutouts on social media</li>
<li>Free raffle ticket (one per rig) for vanlife-related prizes</li>
<li>Option to enter Best in Show contest (multiple categories)</li>
<li>Professional photos (digital copies) for your own use</li>
<li>Early bird registration for future VanFest events</li>
</ul>
<a href="https://vanfest.ticketspice.com/escape2026" class="inline-block mt-4 bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Camp & Exhibit at Escape to the Cape</a>
</div></div>`,
            prose: true,
          },
          settings: { sectionId: "exhibit" },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-2xl text-charcoal mb-4">Jobs & Volunteers</h2>
<p>We have open roles at every event — volunteers and a small number of paid positions available that involve working two or three 8-hour shifts. You'll receive an hourly wage (paid as a 1099 contractor), a free t-shirt and other swag, a free camping spot (and a discount to another VanFest event), and one extra free night of camping before the event for training.</p>
<h3 class="font-semibold mt-4 mb-2">Available Paid Positions</h3>
<ul>
<li>A/V & Tech</li>
<li>Merch Booth</li>
<li>Security Lead</li>
<li>And more — reach out for details!</li>
</ul>
<a href="mailto:hello@vanfestusa.com?subject=Escape%20to%20the%20Cape%20%E2%80%93%20Jobs%20Inquiry" class="inline-block mt-4 bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Apply Now</a>`,
            prose: true,
          },
          settings: { sectionId: "jobs" },
        },
        {
          section_type: "faq_accordion",
          data: { showExpandAll: true, items: faqItems },
          settings: { sectionId: "faq" },
        },
        {
          section_type: "sponsor_marquee",
          data: { sponsors: sponsorMarqueeSponsors, speed: 30 },
        },
        {
          section_type: "cta_section",
          data: {
            title: "Ready for an Unforgettable Weekend?",
            subtitle: "Grab your tickets and join us on Cape Cod this August!",
            buttons: [
              { text: "Get Tickets Now", href: "https://vanfest.ticketspice.com/escape2026", variant: "primary" },
            ],
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // LIFTOFF!
    // ══════════════════════════════════════════════════════════════════════
    case "/events/liftoff":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "LIFTOFF!",
            subtitle: "Details to be Announced",
            bgImage: "/images/image157.jpg",
            light: true,
            tag: "Coming Soon",
            gradient: "from-purple-600 to-pink-500",
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<p>Get ready for LIFTOFF! — VanFest's next big event. Details are coming soon for what promises to be an unforgettable experience.</p>
<p>Follow <a href="https://instagram.com/vanfestusa" target="_blank" rel="noopener noreferrer">@vanfestusa</a> on Instagram for announcements.</p>`,
            alignment: "center",
            prose: true,
          },
        },
        {
          section_type: "cta_section",
          data: {
            title: "",
            buttons: [
              { text: "Get LIFTOFF! Tickets", href: "https://tickets.vanfestusa.com", variant: "primary" },
            ],
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-2xl text-charcoal mb-4">Event Schedule</h2>
<h3 class="text-xl font-semibold text-gray-500 mb-2">Schedule Coming Soon!</h3>
<p>The official LIFTOFF! schedule is still being finalized. Check back soon for the full lineup of workshops, performances, and activities.</p>`,
            prose: true,
          },
          settings: { sectionId: "schedule" },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-2xl text-charcoal mb-4">Sponsors & Vendors</h2>
<p>VanFest partners with industry-leading vanlife brands, local businesses, and community organizations to create the best possible experience for attendees.</p>
<p><em>We intentionally limit the number of sponsors to ensure maximum visibility and authentic engagement. We only work with brands run by people who care and who stand behind what they offer.</em></p>`,
            prose: true,
          },
          settings: { sectionId: "sponsors" },
        },
        {
          section_type: "sponsor_tiers",
          data: {
            tiers: sponsorTierData,
            contactEmail: "hello@vanfestusa.com",
            contactSubject: "LIFTOFF! — Sponsorship / Vendor Inquiry",
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<div class="flex flex-col md:flex-row gap-8 items-start">
<div class="md:w-1/2"><img src="/images/image12.jpg" alt="Van builds on display at VanFest" class="rounded-xl w-full" /></div>
<div class="md:w-1/2">
<h2 class="font-display font-black text-2xl text-charcoal mb-4">Exhibit Your Rig</h2>
<p>On the Saturday and Sunday of the event, we encourage everyone to open their doors to the public (as well as other nomads) during certain hours to make new friends and help others get a glimpse into what a nomadic life is all about.</p>
<h3 class="font-semibold mt-4 mb-2">Exhibitor Benefits</h3>
<ul>
<li>First come, first placed parking closest to the action</li>
<li>Shoutouts on social media</li>
<li>Free raffle ticket (one per rig) for vanlife-related prizes</li>
<li>Option to enter Best in Show contest (multiple categories)</li>
<li>Professional photos (digital copies) for your own use</li>
<li>Early bird registration for future VanFest events</li>
</ul>
<a href="https://tickets.vanfestusa.com" class="inline-block mt-4 bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Camp & Exhibit at LIFTOFF!</a>
</div></div>`,
            prose: true,
          },
          settings: { sectionId: "exhibit" },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-2xl text-charcoal mb-4">Jobs & Volunteers</h2>
<p>We have open roles at every event — volunteers and a small number of paid positions available that involve working two or three 8-hour shifts. You'll receive an hourly wage (paid as a 1099 contractor), a free t-shirt and other swag, a free camping spot (and a discount to another VanFest event), and one extra free night of camping before the event for training.</p>
<h3 class="font-semibold mt-4 mb-2">Available Paid Positions</h3>
<ul>
<li>A/V & Tech</li>
<li>Merch Booth</li>
<li>Security Lead</li>
<li>And more — reach out for details!</li>
</ul>
<a href="mailto:hello@vanfestusa.com?subject=LIFTOFF!%20%E2%80%93%20Jobs%20Inquiry" class="inline-block mt-4 bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Apply Now</a>`,
            prose: true,
          },
          settings: { sectionId: "jobs" },
        },
        {
          section_type: "faq_accordion",
          data: { showExpandAll: true, items: faqItems },
          settings: { sectionId: "faq" },
        },
        {
          section_type: "sponsor_marquee",
          data: { sponsors: sponsorMarqueeSponsors, speed: 30 },
        },
        {
          section_type: "cta_section",
          data: {
            title: "Ready for LIFTOFF?",
            subtitle: "Stay tuned for an unforgettable experience!",
            buttons: [
              { text: "Get Tickets Now", href: "https://tickets.vanfestusa.com", variant: "primary" },
            ],
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // ABOUT
    // ══════════════════════════════════════════════════════════════════════
    case "/about":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "About VanFest",
            subtitle: "The story behind the ultimate vanlife experience.",
            bgImage: "/images/image21.jpg",
            light: true,
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<div class="flex flex-col md:flex-row gap-12 items-center">
<div class="md:w-1/2">
<p>VanFest is the <strong>ultimate vanlife experience</strong> — a nomadic event series that brings together hundreds of converted vans, buses, and alternative dwellings for an unforgettable celebration of community, creativity, and the open road.</p>
<p>Each VanFest event is part festival, part expo, and ALL focused around showcasing and celebrating the amazing vanlife and nomadic community. From live music and dance parties to expert workshops and van tours, every event is designed to inspire, connect, and create memories that last a lifetime.</p>
<p>Whether you're a seasoned traveler or new to vanlife, there's something for everyone at VanFest. Our events bring together people from all walks of life who share a love for adventure, freedom, and the nomadic lifestyle.</p>
</div>
<div class="md:w-1/2"><img src="/images/image23.jpg" alt="VanFest community gathering" class="rounded-xl shadow-lg" /></div>
</div>
<blockquote class="text-center text-2xl font-display font-black text-teal mt-12">"miles · moments · music · memories"</blockquote>`,
            prose: true,
          },
        },
        {
          section_type: "cta_cards",
          data: {
            columns: 2,
            cards: [
              { title: "Found a Magnet?", description: "Learn about our NICE RIG! magnet program.", href: "/magnet" },
              { title: "Terms & Conduct", description: "Read our terms, conditions, and code of conduct.", href: "/terms" },
            ],
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // FAQ
    // ══════════════════════════════════════════════════════════════════════
    case "/faq":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Frequently Asked Questions",
            subtitle: "Everything you need to know about VanFest.",
            bgImage: "/images/image109.jpg",
            light: true,
          },
        },
        {
          section_type: "faq_accordion",
          data: { showExpandAll: true, items: faqItems },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // CONTACT
    // ══════════════════════════════════════════════════════════════════════
    case "/contact":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Get in Touch!",
            subtitle: "We'd love to hear from you.",
            bgImage: "/images/image34.jpg",
            light: true,
          },
        },
        {
          section_type: "contact_form",
          data: {
            recipientEmail: "hello@vanfestusa.com",
            heading: "Send Us a Message",
            intro: "We're here to help and answer any question you might have about VanFest. Whether you're curious about music line-ups, have questions about tickets, or just want to share your excitement about the festival, we'd love to hear from you!",
            contactCards: [
              { icon: "email", title: "Email Us", value: "hello@vanfestusa.com", href: "mailto:hello@vanfestusa.com" },
              { icon: "phone", title: "Call Us", value: "805.826.3378", href: "tel:8058263378" },
            ],
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // SPONSORS
    // ══════════════════════════════════════════════════════════════════════
    case "/sponsors":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Our Sponsors",
            subtitle: "The incredible brands and partners that make VanFest possible.",
            bgImage: "/images/image26.jpg",
            light: true,
          },
        },
        {
          section_type: "sponsor_list",
          data: {
            displayMode: "accordion",
            sponsors: sponsorListData,
            eventFilter: "all",
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // GET INVOLVED
    // ══════════════════════════════════════════════════════════════════════
    case "/get-involved":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Get Involved!",
            subtitle: "Want to be a part of the ultimate vanlife experience? There are many ways to contribute.",
            bgImage: "/images/image25.jpg",
            light: true,
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<div class="flex flex-col md:flex-row gap-8 items-start">
<div class="md:w-1/2"><img src="/images/image12.jpg" alt="Van builds on display at VanFest" class="rounded-xl w-full" /></div>
<div class="md:w-1/2">
<h2 class="font-display font-black text-2xl text-charcoal mb-4">Exhibit Your Rig</h2>
<p>On the Saturday and Sunday of a VanFest event, we encourage everyone to open their doors to the public (as well as other nomads) during certain hours to make new friends and help others get a glimpse into what a nomadic life is all about. You'll get to teach others about your rig, share stories from the road, and inspire the next generation of nomads and vanlifers.</p>
<p>Exhibitors make VanFest the amazing event that it is, and we wouldn't be here without you!</p>
<h3 class="font-semibold mt-4 mb-2">Exhibitor Benefits</h3>
<ul>
<li>First come, first placed parking closest to the action</li>
<li>Shoutouts on social media</li>
<li>Free raffle ticket (one per rig) for vanlife-related prizes</li>
<li>Option to enter Best in Show contest (multiple categories)</li>
<li>Professional photos (digital copies) for your own use</li>
<li>Early bird registration for future VanFest events</li>
</ul>
<a href="https://tickets.vanfestusa.com" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Camp & Exhibit at VanFest</a>
</div></div>`,
            prose: true,
          },
          settings: { sectionId: "exhibit" },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-2xl text-charcoal mb-4">Sponsors & Vendors</h2>
<p>VanFest partners with industry-leading vanlife brands, local businesses, and community organizations to create the best possible experience for attendees. Whether you're a major brand or a local food truck, there's a sponsorship or vendor opportunity for you.</p>
<p>All individuals, companies, or dealerships who would like to solicit their vehicle building services should reach out to discuss vendor and sponsorship opportunities.</p>
<p><em>We intentionally limit the number of sponsors to ensure maximum visibility and authentic engagement. We also price our sponsorship packages to stay accessible — because we believe meaningful connection shouldn't come with a premium price tag. We only work with brands run by people who care and who stand behind what they offer. If that sounds like you, you'll feel right at home.</em></p>
<a href="mailto:hello@vanfestusa.com?subject=Sponsorship%20%2F%20Vendor%20Inquiry" class="inline-block mt-4 bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Contact Us About Sponsorship</a>`,
            prose: true,
          },
          settings: { sectionId: "sponsors" },
        },
        {
          section_type: "sponsor_tiers",
          data: { tiers: sponsorTierData },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="font-display font-black text-2xl text-charcoal mb-4">Jobs @ VanFest</h2>
<p>We have open roles at every event — volunteers and a small number of paid positions available that involve working two or three 8-hour shifts. You'll receive an hourly wage (paid as a 1099 contractor), a free t-shirt and other swag, a free camping spot (and a discount to another VanFest event), and one extra free night of camping before the event for training.</p>
<h3 class="font-semibold mt-4 mb-2">Available Paid Positions</h3>
<ul>
<li>A/V & Tech</li>
<li>Merch Booth</li>
<li>Security Lead</li>
<li>And more — check each event page for details!</li>
</ul>
<a href="mailto:hello@vanfestusa.com?subject=Jobs%20Inquiry" class="inline-block mt-4 bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Apply Now</a>`,
            prose: true,
          },
          settings: { sectionId: "jobs" },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // MEDIA
    // ══════════════════════════════════════════════════════════════════════
    case "/media":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Media",
            subtitle: "Relive the moments from past VanFest events.",
            bgImage: "/images/image37.jpg",
            light: true,
          },
        },
        {
          section_type: "image_gallery",
          data: {
            heading: "Gallery",
            columns: 3,
            enableLightbox: true,
            images: [
              { src: "/images/gallery-73b0e325.jpg", alt: "VanFest gallery - community gathering" },
              { src: "/images/image06.jpg", alt: "VanFest vans on display" },
              { src: "/images/gallery-ad0b2066.jpg", alt: "VanFest gallery - sunset" },
              { src: "/images/image01.jpg", alt: "VanFest event photo" },
              { src: "/images/gallery-a1a9921b.jpg", alt: "VanFest gallery - van tours" },
              { src: "/images/image22.jpg", alt: "VanFest music" },
              { src: "/images/image08.jpg", alt: "VanFest workshops" },
              { src: "/images/gallery-9439939c.jpg", alt: "VanFest gallery - live music" },
              { src: "/images/image24.jpg", alt: "VanFest community event" },
              { src: "/images/image09.jpg", alt: "VanFest festival scene" },
              { src: "/images/gallery-82803eff.jpg", alt: "VanFest gallery - camping" },
              { src: "/images/image25.jpg", alt: "VanFest rigs" },
              { src: "/images/image07.jpg", alt: "VanFest community" },
              { src: "/images/image14.jpg", alt: "VanFest sunset" },
              { src: "/images/image10.jpg", alt: "VanFest builds" },
              { src: "/images/image19.jpg", alt: "VanFest camping area" },
              { src: "/images/image12.jpg", alt: "VanFest van interiors" },
              { src: "/images/image23.jpg", alt: "VanFest experience" },
              { src: "/images/image26.jpg", alt: "VanFest gathering" },
              { src: "/images/image21.jpg", alt: "VanFest vendors" },
              { src: "/images/image37.jpg", alt: "VanFest panoramic" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9180.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9182.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9189.jpg", alt: "VanFest Cape Cod setup" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9193.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9200.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9206.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9208.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9213.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9216.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9219.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9223.jpg", alt: "VanFest Cape Cod" },
              { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9229.jpg", alt: "VanFest Cape Cod potluck" },
              { src: "/images/drive2/IMG_0119.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_0133.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_1925.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_1928.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_1932.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_1936.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_1938.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_1941.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/IMG_1943.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/19c95c60-a94c-422b-a1d8-863df833d276.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/64085c0e-0817-4ea3-bf76-92ca0cba46d2.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/81246df8-166f-450d-bb25-94cb4182c8f4.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/c1bae530-e590-47f7-844f-86921fbef3e9.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/c384f429-093d-48f1-9f06-e38f5db4b5b3.jpeg", alt: "VanFest community photo" },
              { src: "/images/drive2/c408226c-bc92-4d26-b7df-b46913b2e8fc.jpeg", alt: "VanFest community photo" },
            ],
          },
          settings: { sectionId: "gallery" },
        },
        {
          section_type: "html_block",
          data: {
            html: `<div class="max-w-4xl mx-auto">
<h2 class="font-display font-black text-3xl text-charcoal mb-6">VanFest Community Media Program</h2>
<p>VanFest believes that sharing is caring, and we want to create a space where everyone can celebrate and relive the incredible experiences that make our events so special.</p>
<p>This initiative is designed to bring the VanFest community closer by making it easy to share event moments, inspiring others to embrace the vanlife movement and experience the magic of life on the road.</p>
<h3 class="font-display font-bold text-xl mt-8 mb-3">How It Works</h3>
<p>Through this program, anyone who attends VanFest can upload their pictures and videos to our Community Media Folder, where they will be freely available for others in the community to use for:</p>
<ul class="list-disc pl-6 space-y-1 mb-4"><li>Social media posts that showcase the VanFest experience</li><li>Event recaps to highlight key moments and memories</li><li>VanFest-specific promotions that help grow and strengthen our community</li></ul>
<h3 class="font-display font-bold text-xl mt-8 mb-3">Why Participate?</h3>
<p>The VanFest community is built on connection and collaboration. By contributing, you're helping to create an ever-growing archive of vanlife adventures that inspire and connect both newcomers and seasoned nomads alike.</p>
<div class="flex flex-wrap gap-4 mt-6">
<a href="https://driveuploader.com/upload/gBGqZuXflO/embed/" target="_blank" rel="noopener noreferrer" class="bg-teal text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-dark transition-colors">Upload Your Photos</a>
<a href="https://drive.google.com/drive/folders/1CgsbfH8Z1EsRhwevaCC6fzoRf-mXl8rW?usp=drive_link" target="_blank" rel="noopener noreferrer" class="border-2 border-teal text-teal px-6 py-3 rounded-xl font-semibold hover:bg-teal/5 transition-colors">View Community Gallery</a>
</div>
<p class="mt-6">You can also tag us on social media with <strong>#VanFestUSA</strong></p>
<div class="flex gap-4 mt-2">
<a href="https://instagram.com/vanfestusa" target="_blank" rel="noopener noreferrer" class="text-teal hover:underline">Follow on Instagram</a>
<a href="https://facebook.com/vanfestusa" target="_blank" rel="noopener noreferrer" class="text-teal hover:underline">Follow on Facebook</a>
</div>
</div>`,
          },
          settings: { sectionId: "community" },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // MAGNET
    // ══════════════════════════════════════════════════════════════════════
    case "/magnet":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "WOAH — you got a MAGNET?!",
            subtitle: "Lucky you! Here's the deal.",
            light: false,
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<h2 class="text-xl font-bold mb-3">Why did I get a magnet?</h2>
<p>It's our little way of saying "hello"! While we're traveling, we always have vans and other rigs catch our eye. Since we don't always have time to say "hello," we like to leave something so the owners can reach out if they'd like.</p>
<p>Stickers were, of course, the easiest idea. But let's face it — it's kind of rude to put a sticker on someone's van! So, we went with magnets. Easy to leave on a rig, doesn't harm the paint, and is re-usable!</p>
<div class="bg-teal/10 rounded-xl p-6 mt-6">
<h3 class="font-bold text-lg mb-2">So, what do I do?</h3>
<p>Well, you don't have to do anything! You can just enjoy the free magnet.</p>
<p><strong>BUT</strong> if you'd like a 100% free camping ticket to any VanFest event, then you're in luck!</p>
<p>Just throw up a post on your social media channel of choice (we prefer <a href="https://instagram.com/vanfestusa" target="_blank" rel="noopener noreferrer" class="text-teal font-semibold">Instagram</a>, but we're also on <a href="https://facebook.com/vanfestusa" target="_blank" rel="noopener noreferrer" class="text-teal font-semibold">Facebook</a>) of you with your NICE RIG! magnet. Get creative with it! Just make sure to mention us and tag @vanfestusa. We'll reach out with your free ticket!</p>
</div>
<p class="text-sm text-gray-400 mt-4">We are not on Twitter/X or TikTok.</p>`,
            prose: true,
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // MERCH
    // ══════════════════════════════════════════════════════════════════════
    case "/merch":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Merch!",
            subtitle: "Rep the VanFest brand wherever your adventures take you.",
            light: false,
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<div class="text-center">
<h2 class="text-2xl font-bold mb-4">Coming Soon!</h2>
<p>Our official merch store is being set up. T-shirts, hoodies, stickers, magnets, and more will be available here soon. In the meantime, merch is available for purchase at every VanFest event!</p>
<p>Follow <a href="https://instagram.com/vanfestusa" target="_blank" rel="noopener noreferrer" class="text-teal font-semibold">@vanfestusa</a> for announcements.</p>
</div>`,
            alignment: "center",
            prose: true,
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // MAP
    // ══════════════════════════════════════════════════════════════════════
    case "/map":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Event Map",
            subtitle: "Find your way around VanFest.",
            bgImage: "/images/image10.jpg",
            light: true,
          },
        },
        {
          section_type: "text_block",
          data: {
            html: `<div class="text-center">
<h2 class="text-2xl font-bold mb-4">Official Event Map Coming Soon!</h2>
<p>We're putting the finishing touches on an interactive map for each VanFest event. Check back closer to the event date for camping areas, vendor locations, stages, food trucks, and more.</p>
<p>Maps will be available for download and on-site at check-in.</p>
</div>`,
            alignment: "center",
            prose: true,
          },
        },
      ];

    // ══════════════════════════════════════════════════════════════════════
    // TERMS & PRIVACY — stored in separate file for brevity
    // ══════════════════════════════════════════════════════════════════════
    case "/terms":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Terms, Conditions, & Code of Conduct",
            subtitle: "VanFest is a safe, respectful, inclusive, and creative environment for everyone to enjoy.",
            light: false,
          },
        },
        {
          section_type: "html_block",
          data: { html: getTermsHtml() },
        },
      ];

    case "/privacy":
      return [
        {
          section_type: "hero_simple",
          data: {
            title: "Privacy Policy",
            subtitle: "How we collect, use, and protect your information.",
            light: false,
          },
        },
        {
          section_type: "html_block",
          data: { html: getPrivacyHtml() },
        },
      ];

    default:
      return [];
  }
}

// ─── Legal Page HTML ──────────────────────────────────────────────────────

function getTermsHtml(): string {
  return `<div class="max-w-4xl mx-auto prose prose-charcoal">
<p class="text-sm text-gray-500 mb-6">These Terms, Conditions, and Code of Conduct apply to everyone at the event and who participate in our social media channels. Guests, staff, volunteers, vendors, sponsors, and press will be held to the same standards. We reserve the right to remove or ban any person who does not adhere to the Code of Conduct.</p>
<div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6"><p class="font-semibold text-red-700">You are responsible for reading this before buying a ticket. Not reading it is not an excuse to violate anything here.</p><p class="text-red-600 text-sm">If you ever need to contact VanFest for an emergency at our events, call us at <a href="tel:8058263378">805.826.3378</a>.</p></div>
<p>By purchasing a ticket to VanFest, you are agreeing to the following terms and conditions. Please read these terms carefully before completing your purchase.</p>

<h2>Safety, Conduct, and Zero Tolerance</h2>
<p>VanFest strives to create a safe space for everyone, regardless of gender, race, sexual orientation, political beliefs, or any other of the myriad of things that divide us in this world. If at any time during a VanFest event you do not feel safe, or you observe someone else exhibiting behavior that they may not feel safe, say something. Find a VanFest staff member or volunteer. Call us directly at <a href="tel:8058263378">805.826.3378</a>. If you see something, say something.</p>
<p>Making anyone feel unsafe through words or actions is unacceptable. Anyone found doing so will be removed from the event and no longer allowed at future events without exception.</p>
<p>We do not tolerate harassment of any kind, including but not limited to:</p>
<ul><li>Intimidation or threats of any nature</li><li>Inappropriate disruption of events</li><li>Intentionally hurtful language</li><li>Physical assault of any type</li><li>Inappropriate physical contact</li><li>Unwanted sexual attention</li><li>Unwanted photography or video recording</li><li>Bullying or stalking</li></ul>

<h2>Security & Weapons</h2>
<p>For the safety and security of all attendees, weapons are not permitted at VanFest. Bags may be searched at the discretion of VanFest. Fireworks and other explosive devices are strictly prohibited.</p>

<h2>Dogs / Pets</h2>
<p>We love dogs! However, we have a strict on-leash dog policy at all events. No dog should ever run around unleashed at VanFest. Owners with dogs displaying aggressive behavior will be asked to put their dog inside their rig and may be asked to leave. You are responsible for your pet(s) and must ensure they do not cause harm or disturbance.</p>

<h2>Media Agreement</h2>
<p>By attending VanFest, you grant VanFest the irrevocable right to use, reproduce, distribute, and display any photographs, video, audio, or other media that captures your likeness, voice, or participation in the event, without payment or compensation.</p>

<h2>Brand Use</h2>
<p>If you wish to use VanFest logos/media/etc, please contact us at <a href="mailto:media@vanfestusa.com">media@vanfestusa.com</a> ahead of time.</p>

<h2>Cancellations, Credits, Transfers, and Refunds</h2>
<div class="bg-sand rounded-xl p-4 mb-4"><p class="text-sm"><strong>Please Note:</strong> We're a small, bootstrapped event. The costs for each event are paid from tickets sold. We kindly ask that you strongly consider a future credit to any future VanFest event in lieu of a refund.</p></div>
<h3>Credits</h3>
<p>VanFest tickets are fully cancellable for a full credit to any future VanFest event at any time. Cancellations for future credit are always approved.</p>
<h3>Transfers</h3>
<p>Tickets are transferable between individuals, as well as exchangeable for another VanFest event. Transfer requests are always approved.</p>
<h3>Refunds</h3>
<p>VanFest tickets are cancellable and fully refundable within 48 hours of the initial purchase. After the 48-hour window, tickets become non-refundable unless VanFest cancels the event. Within 30 days of the event, approved cancellations are eligible for a partial refund of 50%.</p>

<h2>Accessibility</h2>
<p>VanFest is committed to providing a welcoming and accessible event for all attendees. If you require accommodations due to a disability, please <a href="mailto:hello@vanfestusa.com">contact the event organizers</a> at least thirty (30) days prior to the event.</p>

<h2>No Liability</h2>
<p>You acknowledge that VanFest shall not be held liable for any loss, injury, or damage to persons or property occurring during the event. You agree to indemnify and hold harmless VanFest from any claims arising from your attendance.</p>

<h2>COVID-19</h2>
<p>By purchasing a ticket you agree that you will not attend the event if you are displaying COVID symptoms. You agree to practice hand washing and respect the wishes of others when it comes to COVID precautions.</p>

<h2>Smoking</h2>
<p>VanFest is a tobacco-free event. If you must consume tobacco products, it needs to be smokeless (vape, dip, etc.).</p>

<h2>What isn't allowed?</h2>
<ul><li>Discriminative or divisive symbols, and inappropriate imagery</li><li>Political-fueled riffraff of any kind</li><li>Weapons such as guns, knives, pepper spray, etc.</li><li>Tobacco smoking inside the venue</li><li>Drones (unless operated by our licensed & insured media partners)</li><li>Aggressive or disruptive behavior</li><li>Excessive noise during quiet hours (11pm — 7am)</li></ul>

<h2>Vendors and Sponsors</h2>
<p>Payment must be made within 5 business days. Benefits are as outlined in your selected package. There are no guarantees of sales or leads. If VanFest cancels the event, you will be entitled to a 100% refund or an equivalent slot. You shall provide insurance confirming General Liability coverage with limits no less than $1,000,000 per event / $2,000,000 general aggregate, no later than one month before the event.</p>

<h2>VanFest SMS Terms & Conditions</h2>
<p>By opting in, you agree to receive recurring SMS/MMS messages from VanFest. Message frequency varies (up to 10/month, up to 5/day during events). Message and data rates may apply. Opt out anytime by texting STOP. For help, text HELP or contact <a href="mailto:hello@vanfestusa.com">hello@vanfestusa.com</a> or <a href="tel:8058263378">805.826.3378</a>. Your phone number will not be sold or shared with third parties. See our <a href="/privacy">Privacy Policy</a>.</p>

<div class="bg-sand rounded-xl p-4 mt-8"><p class="text-sm">VanFest is committed to providing a safe, inclusive, and welcoming environment for everyone. We do not tolerate harassment of event participants in any form.</p></div>
<p class="text-sm text-gray-400 mt-6">VanFest is a nomadic event series brand run by Ever Onward LLC, a Massachusetts-based Limited Liability Company. Questions? Contact us at <a href="mailto:hello@vanfestusa.com">hello@vanfestusa.com</a></p>
</div>`;
}

function getPrivacyHtml(): string {
  return `<div class="max-w-4xl mx-auto prose prose-charcoal">
<p class="text-sm text-gray-500 mb-6">Effective Date: March 13, 2026 · Last Updated: March 13, 2026</p>
<p>VanFest is a nomadic event series brand operated by Ever Onward LLC, a Massachusetts-based Limited Liability Company. This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website (vanfestusa.com), purchase tickets, opt in to our SMS messaging program, or otherwise interact with us.</p>

<h2>Information We Collect</h2>
<h3>Information You Provide Directly</h3>
<ul><li><strong>Contact information</strong> — name, email address, phone number, and mailing address when you purchase tickets, register for events, or contact us.</li>
<li><strong>Payment information</strong> — credit/debit card details processed securely through Stripe. We do not store your full card number.</li>
<li><strong>Phone number for SMS</strong> — when you opt in to receive text messages during ticket checkout.</li>
<li><strong>Communications</strong> — any information you provide when you email us, fill out a contact form, or interact with us on social media.</li></ul>
<h3>Information Collected Automatically</h3>
<ul><li><strong>Usage data</strong> — pages visited, time on site, browser type, device type, and IP address.</li>
<li><strong>Cookies</strong> — we may use cookies for site functionality and analytics.</li></ul>

<h2>How We Use Your Information</h2>
<ul><li>To process ticket purchases and event registrations</li>
<li>To send transactional communications (order confirmations, ticket delivery, event updates)</li>
<li>To send SMS messages to opted-in participants</li>
<li>To respond to your inquiries and provide customer support</li>
<li>To improve our website, events, and services</li>
<li>To comply with legal obligations</li></ul>

<h2>SMS Messaging Program</h2>
<p>When you opt in to receive SMS messages from VanFest, you consent to receive text messages related to VanFest events.</p>
<div class="bg-sand rounded-xl p-4 my-4"><p class="text-sm font-semibold">Your phone number and personal information will not be sold, rented, or shared with third parties for their own marketing purposes.</p><p class="text-sm">We only share your phone number with Twilio solely for message delivery.</p></div>
<p>You can opt out at any time by replying STOP. For help, reply HELP or contact <a href="mailto:hello@vanfestusa.com">hello@vanfestusa.com</a> or <a href="tel:8058263378">805.826.3378</a>.</p>

<h2>Sharing Your Information</h2>
<p>We do not sell your personal information. We may share it only with:</p>
<ul><li><strong>Service providers</strong> — Stripe (payments), Resend (email), Twilio (SMS), Vercel (hosting).</li>
<li><strong>Legal compliance</strong> — when required by law.</li>
<li><strong>Safety</strong> — if necessary to protect attendees, staff, or the public.</li></ul>

<h2>Data Security</h2>
<p>We implement reasonable safeguards to protect your personal information. Payment information is processed through PCI-compliant processors and is never stored on our servers.</p>

<h2>Data Retention</h2>
<p>We retain your personal information for as long as necessary to fulfill the purposes described here. If you opt out of SMS, we will remove your phone number from our active messaging list promptly.</p>

<h2>Your Rights</h2>
<p>Depending on your state of residence, you may have rights including access, correction, deletion, and opt-out of SMS. To exercise these rights, contact <a href="mailto:hello@vanfestusa.com">hello@vanfestusa.com</a>. We will respond within 30 days.</p>

<h2>Children's Privacy</h2>
<p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>

<h2>Third-Party Links</h2>
<p>Our website may contain links to third-party websites. We are not responsible for their privacy practices.</p>

<h2>Changes to This Policy</h2>
<p>We may update this policy from time to time. Changes will be posted on this page with an updated "Last Updated" date.</p>

<h2>Contact Us</h2>
<p>If you have questions about this Privacy Policy:</p>
<ul><li>Email: <a href="mailto:hello@vanfestusa.com">hello@vanfestusa.com</a></li>
<li>Phone: <a href="tel:8058263378">805.826.3378</a></li>
<li>Mail: Ever Onward LLC, Massachusetts, USA</li></ul>
<p class="text-sm text-gray-400 mt-6">VanFest is a nomadic event series brand run by Ever Onward LLC, a Massachusetts-based Limited Liability Company.</p>
</div>`;
}

// ─── Main Seed Function ──────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Starting VanFest CMS seed...\n");

  // 1. Create owner user
  console.log("Creating owner user...");
  const passwordHash = await hash("VanFest2026!", 12);
  const { data: existingUser } = await supabase
    .from("cms_users")
    .select("id")
    .eq("email", "lance@vanfestusa.com")
    .single();

  let ownerId: string;
  if (existingUser) {
    ownerId = existingUser.id;
    console.log("  Owner user already exists:", ownerId);
  } else {
    const { data: user, error: userError } = await supabase
      .from("cms_users")
      .insert({
        email: "lance@vanfestusa.com",
        password_hash: passwordHash,
        display_name: "Lance",
        role: "owner",
        must_change_password: true,
      })
      .select("id")
      .single();
    if (userError) throw new Error(`Failed to create user: ${userError.message}`);
    ownerId = user!.id;
    console.log("  Created owner user:", ownerId);
  }

  // 2. Seed pages
  console.log("\nSeeding pages...");
  const pageIds: Record<string, string> = {};

  for (const page of pages) {
    const { data: existing } = await supabase
      .from("pages")
      .select("id")
      .eq("slug", page.slug)
      .single();

    if (existing) {
      pageIds[page.slug] = existing.id;
      console.log(`  Page "${page.slug}" already exists`);
      continue;
    }

    const { data: inserted, error } = await supabase
      .from("pages")
      .insert({
        slug: page.slug,
        title: page.title,
        description: page.description,
        og_image: page.og_image || null,
        is_published: true,
        updated_by: ownerId,
      })
      .select("id")
      .single();

    if (error) {
      console.error(`  Failed to insert page "${page.slug}":`, error.message);
      continue;
    }
    pageIds[page.slug] = inserted!.id;
    console.log(`  Created page "${page.slug}": ${inserted!.id}`);
  }

  // 3. Seed sections per page
  console.log("\nSeeding sections...");
  for (const page of pages) {
    const pageId = pageIds[page.slug];
    if (!pageId) continue;

    // Check if sections already exist
    const { data: existingSections } = await supabase
      .from("sections")
      .select("id")
      .eq("page_id", pageId);

    if (existingSections && existingSections.length > 0) {
      console.log(`  Page "${page.slug}" already has ${existingSections.length} sections, skipping`);
      continue;
    }

    const sections = getSections(page.slug);
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const { error } = await supabase.from("sections").insert({
        page_id: pageId,
        section_type: s.section_type,
        sort_order: i,
        data: s.data,
        settings: s.settings || {},
        is_visible: true,
      });
      if (error) {
        console.error(`  Failed to insert section ${i} for "${page.slug}":`, error.message);
      }
    }
    console.log(`  Seeded ${sections.length} sections for "${page.slug}"`);
  }

  // 4. Seed global settings
  console.log("\nSeeding global settings...");
  const globalSettings = [
    {
      key: "site_metadata",
      value: {
        title: "VanFest — The Ultimate Vanlife Experience",
        description: "Part festival, part expo, and ALL focused around showcasing and celebrating the amazing vanlife / nomadic community.",
      },
    },
    {
      key: "social_links",
      value: {
        instagram: "https://instagram.com/vanfestusa",
        facebook: "https://facebook.com/vanfestusa",
      },
    },
    {
      key: "contact",
      value: {
        email: "hello@vanfestusa.com",
        phone: "805.826.3378",
        mediaEmail: "media@vanfestusa.com",
      },
    },
    {
      key: "legal",
      value: {
        entity: "Ever Onward LLC",
        state: "Massachusetts",
        country: "USA",
      },
    },
  ];

  for (const setting of globalSettings) {
    const { error } = await supabase
      .from("global_settings")
      .upsert({ key: setting.key, value: setting.value }, { onConflict: "key" });
    if (error) {
      console.error(`  Failed to upsert setting "${setting.key}":`, error.message);
    } else {
      console.log(`  Set "${setting.key}"`);
    }
  }

  // Done
  console.log("\n✅ Seed complete!");
  console.log(`   ${Object.keys(pageIds).length} pages`);
  console.log(`   ${pages.reduce((sum, p) => sum + getSections(p.slug).length, 0)} sections`);
  console.log(`   ${globalSettings.length} global settings`);
  console.log(`\n   Owner login: lance@vanfestusa.com / VanFest2026!`);
  console.log(`   (Must change password on first login)`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
