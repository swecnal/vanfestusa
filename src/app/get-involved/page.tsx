"use client";

import SectionHeading from "@/components/SectionHeading";
import { sponsorTiers } from "@/data/sponsor-tiers";

export default function GetInvolvedPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image25.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="Get Involved!"
            subtitle="Want to be a part of the ultimate vanlife experience? There are many ways to contribute."
            light
          />
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a
              href="#exhibit"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("exhibit")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-xl border border-white/20 transition-colors text-sm"
            >
              Exhibit
            </a>
            <a
              href="#sponsors"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("sponsors")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-xl border border-white/20 transition-colors text-sm"
            >
              Sponsors & Vendors
            </a>
            <a
              href="#jobs"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("jobs")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-xl border border-white/20 transition-colors text-sm"
            >
              Jobs
            </a>
          </div>
        </div>
      </section>

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
          <h2 className="font-display font-black text-3xl md:text-4xl text-charcoal mb-6">
            Exhibit Your Rig
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            On the Saturday and Sunday of a VanFest event, we encourage everyone
            to open their doors to the public (as well as other nomads) during
            certain hours to make new friends and help others get a glimpse into
            what a nomadic life is all about. You&apos;ll get to teach others
            about your rig, share stories from the road, and inspire the next
            generation of nomads and vanlifers.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            Exhibitors make VanFest the amazing event that it is, and we
            wouldn&apos;t be here without you!
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
            href="https://vanfest.fieldpass.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Camp & Exhibit at VanFest
          </a>
        </div>
      </section>

      <div className="bg-sand py-1" />

      {/* Sponsors & Vendors */}
      <section id="sponsors" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-black text-3xl md:text-4xl text-charcoal mb-6">
            Sponsors & Vendors
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            VanFest partners with industry-leading vanlife brands, local
            businesses, and community organizations to create the best possible
            experience for attendees. Whether you&apos;re a major brand or a
            local food truck, there&apos;s a sponsorship or vendor opportunity
            for you.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-4">
            All individuals, companies, or dealerships who would like to solicit
            their vehicle building services should reach out to discuss vendor
            and sponsorship opportunities.
          </p>
          <p className="text-charcoal/70 leading-relaxed italic text-sm mb-10">
            We intentionally limit the number of sponsors to ensure maximum
            visibility and authentic engagement. We also price our sponsorship
            packages to stay accessible &mdash; because we believe meaningful
            connection shouldn&apos;t come with a premium price tag. We only
            work with brands run by people who care and who stand behind what
            they offer. If that sounds like you, you&apos;ll feel right at home.
          </p>

          <div className="space-y-4">
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 7.5L10 12.5L15 7.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
                          <li
                            key={iIdx}
                            className="flex gap-2 text-charcoal/70 text-sm leading-relaxed"
                          >
                            <span className="text-teal font-bold shrink-0">
                              &bull;
                            </span>
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

          <div className="mt-10">
            <a
              href="mailto:hello@vanfestusa.com?subject=Sponsorship%20%2F%20Vendor%20Inquiry"
              className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              Contact Us About Sponsorship
            </a>
          </div>
        </div>
      </section>

      <div className="bg-sand py-1" />

      {/* Jobs */}
      <section id="jobs" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-black text-3xl md:text-4xl text-charcoal mb-6">
            Jobs @ VanFest
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
                And more &mdash; check each event page for details!
              </li>
            </ul>
          </div>

          <a
            href="mailto:hello@vanfestusa.com?subject=Jobs%20Inquiry"
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>
    </>
  );
}
