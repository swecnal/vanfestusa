"use client";

import { useState, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";
import SponsorCarousel from "@/components/SponsorCarousel";
import BounceCTA from "@/components/BounceCTA";
import { sponsorTiers } from "@/data/sponsor-tiers";
import { faqs } from "@/data/faqs";

export default function LiftoffPage() {
  const [allFaqOpen, setAllFaqOpen] = useState(false);
  const faqRefs = useRef<(HTMLDetailsElement | null)[]>([]);

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
          src="/images/image157.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 md:p-12 text-white">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">
              Coming Soon
            </span>
            <h1
              className="font-black text-4xl md:text-5xl mb-2"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              LIFTOFF!
            </h1>
            <p className="text-white/90 text-xl font-semibold mt-2">
              Details to be Announced
            </p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="prose prose-lg max-w-none text-center">
            <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
              Get ready for LIFTOFF! &mdash; VanFest&apos;s next big event.
              Details are coming soon for what promises to be an unforgettable
              experience.
            </p>
            <p className="text-charcoal/50 mb-8">
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
            <BounceCTA
              href="https://tickets.vanfestusa.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get LIFTOFF! Tickets
            </BounceCTA>
          </div>
        </div>
      </section>

      {/* Schedule - Coming Soon */}
      <section id="schedule" className="py-20 px-4 bg-sand scroll-mt-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display font-bold text-2xl text-charcoal mb-4">
            Event Schedule
          </h2>
          <div className="bg-white rounded-3xl p-12 shadow-sm">
            <svg
              className="w-12 h-12 text-purple-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="font-display font-bold text-xl text-charcoal mb-2">
              Schedule Coming Soon!
            </h3>
            <p className="text-charcoal/50 text-sm">
              The official LIFTOFF! schedule is still being finalized. Check
              back soon for the full lineup of workshops, performances, and
              activities.
            </p>
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

          <details className="group/outer rounded-2xl border border-purple-500/20 overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer px-6 py-5 bg-purple-500/5 hover:bg-purple-500/10 transition-colors list-none [&::-webkit-details-marker]:hidden">
              <span className="font-display font-bold text-lg text-purple-700">
                Expand to learn more about Sponsorship
              </span>
              <span className="text-purple-500 transition-transform group-open/outer:rotate-180">
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
              href="mailto:hello@vanfestusa.com?subject=LIFTOFF!%20%E2%80%93%20Sponsorship%20%2F%20Vendor%20Inquiry"
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
            href="https://tickets.vanfestusa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Camp & Exhibit at LIFTOFF!
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
            href="mailto:hello@vanfestusa.com?subject=LIFTOFF!%20%E2%80%93%20Jobs%20Inquiry"
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
          <SponsorCarousel eventFilter="liftoff" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-charcoal text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-black text-3xl text-white mb-4">
            Ready for LIFTOFF?
          </h2>
          <p className="text-white/60 mb-8">
            Stay tuned for an unforgettable experience!
          </p>
          <BounceCTA
            href="https://tickets.vanfestusa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Get Tickets Now
          </BounceCTA>
        </div>
      </section>
    </>
  );
}
