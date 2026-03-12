"use client";

import { useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import SponsorCarousel from "@/components/SponsorCarousel";
import BounceCTA from "@/components/BounceCTA";

const escapeSchedule = [
  {
    day: "Thursday, August 20",
    tag: "Camping Only",
    color: "bg-teal/10 text-teal-dark",
    items: [
      { time: "10:00 AM", activity: "Camping Check-In Opens", desc: "Show your ticket, get wristbands, site map, and raffle tickets" },
      { time: "12:00 PM", activity: "Welcome & Setup", desc: "Get settled in, meet your neighbors, explore the grounds" },
      { time: "5:00 PM", activity: "Community Potluck", desc: "Bring a dish to share! Grills and communal tables provided" },
      { time: "7:00 PM", activity: "Bonfire & Games", desc: "Campfire hangout with lawn games, cornhole tournament, and good vibes" },
      { time: "9:00 PM", activity: "Acoustic Jam Session", desc: "Bring your instruments for an informal music circle" },
    ],
  },
  {
    day: "Friday, August 21",
    tag: "Camping Only",
    color: "bg-blue-50 text-blue-700",
    items: [
      { time: "8:00 AM", activity: "Morning Yoga & Stretch", desc: "Start the day with a group yoga session on the lawn" },
      { time: "10:00 AM", activity: "Workshops & Classes", desc: "Solar 101, electrical systems, van build Q&A, and more" },
      { time: "12:00 PM", activity: "Food Trucks Open", desc: "Local food vendors serving lunch through the afternoon" },
      { time: "2:00 PM", activity: "Van Build Showcase Setup", desc: "Exhibitors prep their rigs for Saturday's expo" },
      { time: "4:00 PM", activity: "Field Day Games", desc: "Kickball, tug-of-war, relay races — get competitive!" },
      { time: "6:00 PM", activity: "Community Potluck #2", desc: "Another epic shared meal with your new vanlife family" },
      { time: "8:00 PM", activity: "Live Music & Dance Party", desc: "Live performances on the main stage" },
    ],
  },
  {
    day: "Saturday, August 22",
    tag: "Expo Day — 11AM to 5PM",
    color: "bg-amber-50 text-amber-700",
    items: [
      { time: "8:00 AM", activity: "Morning Fitness", desc: "Group workout or yoga for campers" },
      { time: "10:00 AM", activity: "Exhibitor Setup", desc: "Final prep before the public arrives" },
      { time: "11:00 AM", activity: "Public Expo Opens", desc: "Gates open for general admission — van tours, vendors, workshops" },
      { time: "12:00 PM", activity: "Workshops & Panels", desc: "Expert-led sessions on vanlife topics, Q&A panels" },
      { time: "1:00 PM", activity: "Live Music Begins", desc: "Performances on the main stage throughout the afternoon" },
      { time: "3:00 PM", activity: "Best in Show Judging", desc: "Judges tour exhibiting rigs for awards" },
      { time: "5:00 PM", activity: "Expo Closes to Public", desc: "GA visitors head out, campers continue the fun" },
      { time: "7:00 PM", activity: "Saturday Night Live Music", desc: "Headliner performance and dance party under the stars" },
    ],
  },
  {
    day: "Sunday, August 23",
    tag: "Expo Day — 11AM to 5PM",
    color: "bg-amber-50 text-amber-700",
    items: [
      { time: "8:00 AM", activity: "Morning Yoga", desc: "Relaxed stretch session to start the day" },
      { time: "11:00 AM", activity: "Public Expo Opens", desc: "Day two of tours, vendors, food trucks, and workshops" },
      { time: "12:00 PM", activity: "Workshops & Panels", desc: "More expert sessions — vanlife for beginners, nomad finances, and more" },
      { time: "2:00 PM", activity: "Raffle & Giveaways", desc: "Prize drawings from our amazing sponsors" },
      { time: "3:00 PM", activity: "Best in Show Awards", desc: "Winners announced on the main stage" },
      { time: "5:00 PM", activity: "Expo Closes to Public", desc: "Last call for GA visitors" },
      { time: "7:00 PM", activity: "Closing Night Celebration", desc: "Final night of live music, dancing, and memories" },
    ],
  },
  {
    day: "Monday, August 24",
    tag: "Departure",
    color: "bg-gray-100 text-gray-600",
    items: [
      { time: "8:00 AM", activity: "Farewell Breakfast", desc: "Coffee and light bites before hitting the road" },
      { time: "11:00 AM", activity: "Check-Out", desc: "Pack up and head out — see you at the next VanFest!" },
    ],
  },
];

export default function EventsPage() {
  const [allOpen, setAllOpen] = useState(false);
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  const toggleAll = () => {
    const newState = !allOpen;
    setAllOpen(newState);
    detailsRefs.current.forEach((el) => {
      if (el) el.open = newState;
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image01.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="VanFest Events"
            subtitle="Building community through connection and experiences."
            light
          />
        </div>
      </section>

      {/* Event photo strip */}
      <div className="grid grid-cols-4 h-48 overflow-hidden">
        <img src="/images/image08.jpg" alt="VanFest" className="w-full h-full object-cover" />
        <img src="/images/image09.jpg" alt="VanFest" className="w-full h-full object-cover" />
        <img src="/images/image10.jpg" alt="VanFest" className="w-full h-full object-cover" />
        <img src="/images/image06.jpg" alt="VanFest" className="w-full h-full object-cover" />
      </div>

      {/* Escape to the Cape */}
      <section id="escape" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-blue-600 to-teal rounded-3xl p-8 md:p-12 text-white mb-10">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">
              Early Bird Tickets On Sale!
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl mb-2">
              Escape to the Cape
            </h2>
            <p className="text-white/80 text-lg">
              Cape Cod Fairgrounds &mdash; 1220 Nathan Ellis Hwy, East
              Falmouth, MA 02536
            </p>
            <p className="text-white/90 text-xl font-semibold mt-2">
              August 20 - 24, 2026
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
              Let&apos;s Escape (back to) the Cape this summer! We&apos;ll be on
              picturesque Cape Cod for the second annual largest vanlife and
              nomadic celebration in New England!
            </p>
            <p className="text-charcoal/70 leading-relaxed mb-8">
              Join us for four days/nights of community, connection, and
              celebration. This event will gather hundreds of converted vans,
              buses, and everything in-between coming together for music, games,
              learning, and memories.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-sand rounded-2xl p-6">
                <h3 className="font-display font-bold text-xl text-teal-dark mb-3">
                  Camping & Festival
                </h3>
                <p className="text-sm font-semibold text-charcoal/50 mb-3">
                  Thursday 8/20 to Monday 8/24
                </p>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Camping is open to everyone, whether you&apos;re in a van,
                  bus, car/SUV, or just bringing a tent. Join us for four
                  unforgettable days and nights filled with live music, dance
                  parties, epic potlucks, hands-on workshops, expert-led
                  classes, group fitness, yoga, and more!
                </p>
              </div>
              <div className="bg-sand rounded-2xl p-6">
                <h3 className="font-display font-bold text-xl text-teal-dark mb-3">
                  Public Expo & Tours
                </h3>
                <p className="text-sm font-semibold text-charcoal/50 mb-3">
                  Sat 8/22 & Sun 8/23 &mdash; 11am to 5pm
                </p>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Van curious? Join us for unlimited tours of dozens of
                  converted vans & buses, live music, local food trucks,
                  workshops, discussion panels, lifestyle influencers,
                  industry-leading vendors, and everything else you need for
                  YOUR nomadic adventure! Kids are free!
                </p>
              </div>
            </div>

            <div className="text-center">
              <BounceCTA
                href="https://vanfest.fieldpass.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get Escape to the Cape Tickets
              </BounceCTA>
            </div>
          </div>

          {/* Schedule Accordion */}
          <div id="escape-schedule" className="mt-14 scroll-mt-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-2xl text-charcoal">
                Event Schedule
              </h3>
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
            <p className="text-charcoal/50 text-sm mb-6 italic">
              Schedule is tentative and subject to change. Detailed schedule with specific performers and workshop topics coming soon!
            </p>
            <div className="space-y-3">
              {escapeSchedule.map((day, i) => (
                <details
                  key={day.day}
                  ref={(el) => { detailsRefs.current[i] = el; }}
                  className="group bg-sand rounded-2xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-5 list-none">
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-teal flex-shrink-0 group-open:rotate-90 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="font-display font-bold text-lg text-charcoal">
                        {day.day}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${day.color}`}>
                      {day.tag}
                    </span>
                  </summary>
                  <div className="px-5 pb-5">
                    <div className="border-t border-charcoal/10 pt-4">
                      <div className="space-y-3">
                        {day.items.map((item) => (
                          <div key={item.time + item.activity} className="flex gap-4">
                            <div className="w-24 flex-shrink-0 text-sm font-semibold text-teal-dark pt-0.5">
                              {item.time}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-display font-semibold text-charcoal text-sm">
                                {item.activity}
                              </p>
                              <p className="text-charcoal/60 text-xs mt-0.5">
                                {item.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Sponsors */}
          <div className="mt-14">
            <h3 className="font-display font-bold text-xl text-charcoal/80 text-center mb-4">
              Proudly Sponsored By
            </h3>
            <SponsorCarousel eventFilter="escape_to_the_cape" />
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-sand py-1" />

      {/* LIFTOFF! */}
      <section id="liftoff" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-white mb-10">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">
              Coming Soon
            </span>
            <h2
              className="font-black text-4xl md:text-5xl mb-2"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              LIFTOFF!
            </h2>
            <p className="text-white/80 text-lg">Melbourne, FL</p>
            <p className="text-white/90 text-xl font-semibold mt-2">
              February 4 - 8, 2027
            </p>
          </div>

          <div className="text-center">
            <p className="text-charcoal/70 text-xl mb-6">
              Details coming soon for our Florida event! Stay tuned for what
              promises to be an unforgettable experience.
            </p>
            <p className="text-charcoal/50 text-sm">
              Follow{" "}
              <a
                href="https://instagram.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:text-teal-dark transition-colors font-semibold"
              >
                @vanfestusa
              </a>{" "}
              on Instagram for announcements.
            </p>
          </div>

          {/* Sponsors */}
          <div className="mt-14">
            <h3 className="font-display font-bold text-xl text-charcoal/80 text-center mb-4">
              Proudly Sponsored By
            </h3>
            <SponsorCarousel eventFilter="liftoff" />
          </div>
        </div>
      </section>
    </>
  );
}
