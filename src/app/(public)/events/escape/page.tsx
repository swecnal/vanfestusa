"use client";

import { useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import SponsorCarousel from "@/components/SponsorCarousel";
import BounceCTA from "@/components/BounceCTA";
import { escapeSchedule } from "@/data/escape-schedule";
import { sponsorTiers } from "@/data/sponsor-tiers";
import { faqs } from "@/data/faqs";

export default function EscapePage() {
  const [allScheduleOpen, setAllScheduleOpen] = useState(false);
  const scheduleRefs = useRef<(HTMLDetailsElement | null)[]>([]);
  const [allFaqOpen, setAllFaqOpen] = useState(false);
  const faqRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  const toggleSchedule = () => {
    const newState = !allScheduleOpen;
    setAllScheduleOpen(newState);
    scheduleRefs.current.forEach((el) => {
      if (el) el.open = newState;
    });
  };

  const toggleFaq = () => {
    const newState = !allFaqOpen;
    setAllFaqOpen(newState);
    faqRefs.current.forEach((el) => {
      if (el) el.open = newState;
    });
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image127.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-blue-600 to-teal rounded-3xl p-8 md:p-12 text-white">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">
              Early Bird Tickets On Sale!
            </span>
            <h1 className="font-display font-black text-4xl md:text-5xl mb-2">
              Escape to the Cape
            </h1>
            <p className="text-white/80 text-lg">
              Cape Cod Fairgrounds &mdash; 1220 Nathan Ellis Hwy, East
              Falmouth, MA 02536
            </p>
            <p className="text-white/90 text-xl font-semibold mt-2">
              August 20 - 24, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Event photo strip */}
      <div className="grid grid-cols-4 h-48 overflow-hidden">
        <img src="/images/image08.jpg" alt="VanFest" className="w-full h-full object-cover" />
        <img src="/images/image09.jpg" alt="VanFest" className="w-full h-full object-cover" />
        <img src="/images/image10.jpg" alt="VanFest" className="w-full h-full object-cover" />
        <img src="/images/image06.jpg" alt="VanFest" className="w-full h-full object-cover" />
      </div>

      {/* About */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
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
                href="https://vanfest.ticketspice.com/escape2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get Escape to the Cape Tickets
              </BounceCTA>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-20 px-4 bg-sand scroll-mt-20">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-2xl text-charcoal">
              Event Schedule
            </h2>
            <button
              onClick={toggleSchedule}
              className="flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${allScheduleOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {allScheduleOpen ? "Collapse All" : "Expand All"}
            </button>
          </div>
          <p className="text-charcoal/50 text-sm mb-6 italic">
            Schedule is tentative and subject to change. Detailed schedule with specific performers and workshop topics coming soon!
          </p>
          <div className="space-y-3">
            {escapeSchedule.map((day, i) => (
              <details
                key={day.day}
                ref={(el) => { scheduleRefs.current[i] = el; }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm"
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
                    {/* Column headers */}
                    <div className="flex gap-4 mb-3 pb-2 border-b border-charcoal/5">
                      <div className="w-24 flex-shrink-0 text-xs font-bold text-charcoal/40 uppercase tracking-wider">
                        Start Time
                      </div>
                      <div className="w-32 flex-shrink-0 text-xs font-bold text-charcoal/40 uppercase tracking-wider hidden sm:block">
                        Location
                      </div>
                      <div className="flex-1 text-xs font-bold text-charcoal/40 uppercase tracking-wider">
                        Event
                      </div>
                    </div>
                    <div className="space-y-3">
                      {day.items.map((item) => (
                        <div key={item.time + item.activity} className="flex gap-4">
                          <div className="w-24 flex-shrink-0 text-sm font-semibold text-teal-dark pt-0.5">
                            {item.time}
                          </div>
                          <div className="w-32 flex-shrink-0 text-sm text-charcoal/50 pt-0.5 hidden sm:block">
                            {item.location}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-semibold text-charcoal text-sm">
                              {item.activity}
                            </p>
                            <p className="text-charcoal/60 text-xs mt-0.5">
                              {item.desc}
                            </p>
                            <p className="text-charcoal/40 text-xs mt-0.5 sm:hidden">
                              {item.location}
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
      </section>

      {/* Sponsors & Vendors */}
      <section id="sponsors" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-black text-3xl text-charcoal mb-6">
            Sponsors & Vendors
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            VanFest partners with industry-leading vanlife brands, local
            businesses, and community organizations to create the best possible
            experience for attendees.
          </p>
          <p className="text-charcoal/70 leading-relaxed italic text-sm mb-10">
            We intentionally limit the number of sponsors to ensure maximum
            visibility and authentic engagement. We only work with brands run by
            people who care and who stand behind what they offer.
          </p>

          <details className="group/outer rounded-2xl border border-teal/20 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-6 py-5 bg-teal/5 hover:bg-teal/10 transition-colors list-none [&::-webkit-details-marker]:hidden">
              <span className="font-display font-bold text-lg text-teal-dark">
                Expand to learn more about Sponsorship
              </span>
              <span className="text-teal transition-transform group-open/outer:rotate-180">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </summary>
            <div className="px-6 pb-6 pt-4 space-y-4">
              {sponsorTiers.map((tier, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-charcoal/10 overflow-hidden"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 bg-sand hover:bg-sand/80 transition-colors list-none [&::-webkit-details-marker]:hidden">
                    <div>
                      <span className="font-display font-bold text-lg text-charcoal">
                        {tier.name}
                      </span>
                      {tier.frontage && (
                        <span className="text-charcoal/50 text-sm ml-3">
                          {tier.frontage}{tier.frontageNote && <span className="text-xs ml-1">({tier.frontageNote})</span>}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-black text-teal text-lg">
                        {tier.price}
                      </span>
                      <span className="text-charcoal/40 transition-transform group-open:rotate-180">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </summary>
                  <div className="px-6 py-6 bg-white">
                    <p className="text-charcoal/70 leading-relaxed mb-6 text-sm">
                      {tier.summary}
                    </p>
                    {tier.categories.map((cat, cIdx) => (
                      <div key={cIdx} className="mb-5 last:mb-0">
                        <h4 className="font-display font-bold text-sm text-teal-dark mb-2">
                          {cat.heading}
                        </h4>
                        <ul className="space-y-1.5">
                          {cat.items.map((item, iIdx) => (
                            <li key={iIdx} className="flex gap-2 text-charcoal/70 text-sm leading-relaxed">
                              <span className="text-teal font-bold shrink-0">&bull;</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </details>

          <div className="mt-10">
            <a
              href="mailto:hello@vanfestusa.com?subject=Escape%20to%20the%20Cape%20%E2%80%93%20Sponsorship%20%2F%20Vendor%20Inquiry"
              className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Contact Us About Sponsorship
            </a>
          </div>
        </div>
      </section>

      <div className="bg-sand py-1" />

      {/* Exhibit Your Rig */}
      <section id="exhibit" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl overflow-hidden mb-8">
            <img
              src="/images/image12.jpg"
              alt="Van builds on display at VanFest"
              className="w-full h-48 md:h-64 object-cover"
            />
          </div>
          <h2 className="font-display font-black text-3xl text-charcoal mb-6">
            Exhibit Your Rig
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            On the Saturday and Sunday of the event, we encourage everyone to
            open their doors to the public (as well as other nomads) during
            certain hours to make new friends and help others get a glimpse
            into what a nomadic life is all about.
          </p>

          <div className="bg-sand rounded-2xl p-6 mb-8">
            <h3 className="font-display font-bold text-lg text-teal-dark mb-4">
              Exhibitor Benefits
            </h3>
            <ul className="space-y-2 text-charcoal/70 text-sm">
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                First come, first placed parking closest to the action
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Shoutouts on social media
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Free raffle ticket (one per rig) for vanlife-related prizes
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Option to enter Best in Show contest (multiple categories)
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Professional photos (digital copies) for your own use
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Early bird registration for future VanFest events
              </li>
            </ul>
          </div>

          <a
            href="https://vanfest.ticketspice.com/escape2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Camp & Exhibit at Escape to the Cape
          </a>
        </div>
      </section>

      <div className="bg-sand py-1" />

      {/* Jobs & Volunteers */}
      <section id="jobs" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-black text-3xl text-charcoal mb-6">
            Jobs & Volunteers
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            We have open roles at every event &mdash; volunteers and a small
            number of paid positions available that involve working two or three
            8-hour shifts. You&apos;ll receive an hourly wage (paid as a 1099
            contractor), a free t-shirt and other swag, a free camping spot (and
            a discount to another VanFest event), and one extra free night of
            camping before the event for training.
          </p>

          <div className="bg-sand rounded-2xl p-6 mb-8">
            <h3 className="font-display font-bold text-lg text-teal-dark mb-4">
              Available Paid Positions
            </h3>
            <ul className="space-y-2 text-charcoal/70 text-sm">
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                A/V & Tech
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Merch Booth
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Security Lead
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                And more &mdash; reach out for details!
              </li>
            </ul>
          </div>

          <a
            href="mailto:hello@vanfestusa.com?subject=Escape%20to%20the%20Cape%20%E2%80%93%20Jobs%20Inquiry"
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>

      <div className="bg-sand py-1" />

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-black text-3xl text-charcoal">
              FAQ
            </h2>
            <button
              onClick={toggleFaq}
              className="flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${allFaqOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {allFaqOpen ? "Collapse All" : "Expand All"}
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                ref={(el) => { faqRefs.current[i] = el; }}
                className="group bg-sand rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-display font-semibold text-charcoal hover:text-teal transition-colors list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-teal flex-shrink-0 ml-4 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-charcoal/70 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Carousel */}
      <section className="py-16 px-4 bg-sand">
        <div className="mx-auto max-w-5xl">
          <h3 className="font-display font-bold text-xl text-charcoal/80 text-center mb-4">
            Proudly Sponsored By
          </h3>
          <SponsorCarousel eventFilter="escape_to_the_cape" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-charcoal text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-black text-3xl text-white mb-4">
            Ready for an Unforgettable Weekend?
          </h2>
          <p className="text-white/60 mb-8">
            Grab your tickets and join us on Cape Cod this August!
          </p>
          <BounceCTA
            href="https://vanfest.ticketspice.com/escape2026"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Get Tickets Now
          </BounceCTA>
        </div>
      </section>
    </>
  );
}
