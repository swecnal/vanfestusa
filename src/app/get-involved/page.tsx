"use client";

import SectionHeading from "@/components/SectionHeading";

const sponsorTiers = [
  {
    name: "Presenting Partner",
    price: "$6,500",
    frontage: "40' Frontage",
    summary:
      "The highest, top-tier sponsorship with exclusivity, deep brand integration across ALL aspects of the event, and premium on-site visibility. Includes entire event branding (ex: \"VanFest: LIFTOFF! is presented by YOUR BRAND\"), significant social media exposure, premium branding on all digital and physical event collateral, stage/workshop branding, inclusion in all press features, dedicated digital communications, and full integration into all event-specific communication and branding. Limited to one per event.",
    categories: [
      {
        heading: "Digital Exposure",
        items: [
          "Social media tags/mentions a minimum of 2x per week.",
          "Emphasized presence in all event-specific promotional videos, press releases, digital communications, e-tickets, VanFest & event websites.",
          "Branded ticket discount codes & 10 ticket giveaways via social media.",
        ],
      },
      {
        heading: "Direct Communication",
        items: [
          "Dedicated email to 3200+ organic subscribers.",
          "Dedicated social media post to 9500+ organic followers.",
        ],
      },
      {
        heading: "Event Presence & Visibility",
        items: [
          "10\u2019x40\u2019 Placement in high-traffic area.",
          "Complete event co-branding including stage and workshop tents (\u201CThe YOUR BRAND stage\u201D).",
          "Large banner placement at entrance, on stage, and throughout event (you must provide).",
          "Logo/brand on Photo Booth photos (if there is one). Large logo on all wristbands. Full-color, single-sided, full-page welcome packet inclusion (you design, VanFest will print).",
          "Logo on printed schedules and event signage.",
          "Prominent logo on event t-shirts.",
        ],
      },
      {
        heading: "Branding & Engagement",
        items: [
          "First \u201Cdibs\u201D on speaking opportunities / running workshops.",
          "Sponsored on-site giveaways of your products/services.",
          "Participation in VanFest raffles and contests is required.",
          "Sponsors must provide one raffle item (minimum $200 retail value) and at least one contest prize ($20\u2013$100 retail value).",
        ],
      },
      {
        heading: "On-Site Amenities & Access",
        items: [
          "Includes camping (10) & GA tickets (50) for your family/friends/giveaways.",
          "Dedicated VanFest volunteer (during setup/teardown and GA hours).",
          "Unlimited staff access badges.",
          "Expansive custom site dimensions with premium high-traffic placement.",
          "Includes camping in rigs at your booth location or in general camping area.",
        ],
      },
      {
        heading: "Post-Event Value",
        items: [
          "Dedicated post-event email.",
          "Prominently featured in summary event recap email.",
          "Post-event data & analytics.",
          "Continued social media tags on all event recap-related posts.",
        ],
      },
    ],
  },
  {
    name: "Premier Sponsor",
    price: "$3,500",
    frontage: "25' Frontage",
    summary:
      "High-impact sponsorship with branded presence across all digital, on-site, and media channels. Includes press features, stage/banner branding, giveaways, and full integration into VanFest communications and giveaways. Limited to 2 per event.",
    categories: [
      {
        heading: "Digital Exposure",
        items: [
          "Social media tags/mentions bi-weekly.",
          "Logo in all event-specific promotional videos, press releases, digital communications, e-tickets, VanFest & event websites.",
          "Branded ticket discount codes & 5 ticket giveaways via social media.",
        ],
      },
      {
        heading: "Direct Communication",
        items: [
          "Dedicated email to 3200+ organic subscribers.",
          "Dedicated social media post to 9500+ organic followers.",
        ],
      },
      {
        heading: "Event Presence & Visibility",
        items: [
          "10\u2019x25\u2019 Placement in high-traffic area.",
          "Small banner placement at entrance, on stage, and throughout event (you must provide). Large logo on all wristbands.",
          "Full-color, single-sided, half-page welcome packet inclusion (you design, VanFest will print).",
          "Large logo on event t-shirts.",
        ],
      },
      {
        heading: "Branding & Engagement",
        items: [
          "Includes speaking opportunities / running workshops.",
          "Sponsored on-site giveaways of your products/services.",
          "Participation in VanFest raffles and contests is required.",
          "Sponsors must provide one raffle item (minimum $200 retail value) and at least one contest prize ($20\u2013$100 retail value).",
        ],
      },
      {
        heading: "On-Site Amenities & Access",
        items: [
          "Includes camping (5) & GA tickets (25) for your family/friends/giveaways.",
          "15 staff access badges. Large site dimensions (5\u20136 vans + tents) with high-traffic placement.",
          "Includes camping in rigs at your booth location or in general camping area.",
        ],
      },
      {
        heading: "Post-Event Value",
        items: [
          "Includes in event recap email.",
          "Post-event data & analytics.",
          "Continued social media tags on all event recap-related posts.",
        ],
      },
    ],
  },
  {
    name: "Feature Sponsor",
    price: "$1,850",
    frontage: "15' Frontage",
    summary:
      "A robust promotional tier with significant branding across the website, tickets, wristbands, and giveaways. Includes speaking opportunities, contests, and moderate site footprint.",
    categories: [
      {
        heading: "Digital Exposure",
        items: [
          "Social media tags/mentions bi-weekly.",
          "Logo in all event-specific email communications, and on VanFest & event websites.",
          "Branded ticket discount codes & 3 ticket giveaways via social media.",
          "Brand included in event recap email.",
        ],
      },
      {
        heading: "Direct Communication",
        items: [
          "Dedicated social media post to 9500+ organic followers.",
        ],
      },
      {
        heading: "Event Presence & Visibility",
        items: [
          "10\u2019x15\u2019 Placement in high-traffic area.",
          "Small banner placement at stage and throughout event (you must provide). Full-color, single-sided, quarter-page welcome packet inclusion (you design, VanFest will print).",
          "Logo on VanFest welcome packet collateral.",
          "Small logo on event t-shirts.",
        ],
      },
      {
        heading: "Branding & Engagement",
        items: [
          "Includes speaking opportunities / running workshops.",
          "Sponsored on-site giveaways of your products/services.",
          "Participation in VanFest raffles and contests is required.",
          "Sponsors must provide one raffle item (minimum $200 retail value) and at least one contest prize ($20\u2013$100 retail value).",
        ],
      },
      {
        heading: "On-Site Amenities & Access",
        items: [
          "Includes camping (3) & GA tickets (15) for your family/friends/giveaways.",
          "10 staff access badges.",
          "Medium site dimensions (3\u20134 vans + tents) with high-traffic placement.",
          "Includes camping in rigs at your booth location or in general camping area.",
        ],
      },
      {
        heading: "Post-Event Value",
        items: [
          "Includes in event recap email.",
          "Optional social media tags on select recap-related posts.",
        ],
      },
    ],
  },
  {
    name: "Official Sponsor",
    price: "$1,000",
    frontage: "10' Frontage",
    summary:
      "Recognized as an official supporter of VanFest, this tier offers solid visibility through website placement, branded discount codes, staff access, and on-site space for two vans. Ideal for custom builders and brands ready to show up, engage, and grow within the vanlife community.",
    categories: [
      {
        heading: "Digital Exposure",
        items: [
          "Social media tags/mentions once per week.",
          "Logo in all event-specific email communications, and on VanFest & event websites.",
          "Branded ticket discount codes & 1 ticket giveaway via social media.",
        ],
      },
      {
        heading: "Direct Communication",
        items: [
          "Dedicated social media post to 9500+ organic followers.",
        ],
      },
      {
        heading: "Event Presence & Visibility",
        items: [
          "10\u2019x10\u2019 Placement in high-traffic area.",
          "Small banner placement throughout event (you must provide).",
          "Logo on VanFest welcome packet collateral.",
        ],
      },
      {
        heading: "Branding & Engagement",
        items: [
          "Includes speaking opportunities / running workshops as space allows.",
          "Sponsored on-site giveaways of your products/services.",
          "Participation in VanFest raffles and contests is required.",
          "Sponsors must provide one raffle item (minimum $200 retail value) and at least one contest prize ($20\u2013$100 retail value).",
        ],
      },
      {
        heading: "On-Site Amenities & Access",
        items: [
          "Includes camping (1) & GA tickets (5) for your family/friends/giveaways.",
          "3 staff access badges. Small site dimensions (1\u20132 vans + tent) with high-traffic placement.",
          "Includes camping in rig(s) at your booth location or in general camping area.",
        ],
      },
      {
        heading: "Post-Event Value",
        items: [
          "Includes in event recap email as space allows.",
        ],
      },
    ],
  },
  {
    name: "Digital Sponsor",
    price: "30% off above tiers",
    frontage: null,
    summary:
      "All sponsorship tiers are available as digital-only if you do not plan to attend the event in person. Digital-only sponsors receive all tier benefits except on-site amenities and physical presence (booths, banners, camping, etc.) at 30% off the listed price.",
    categories: [
      {
        heading: "Optional Add-Ons",
        items: [
          "On-site banner placement (you ship the banner, we hang it).",
          "Inclusion of your promotional items in the welcome packet (you send the design, we handle printing).",
          "Pre-recorded workshop or session content included in the official event schedule or recap archive.",
        ],
      },
    ],
  },
  {
    name: "Exhibiting Vendor",
    price: "$375",
    frontage: null,
    summary:
      "Standard exhibiting package with a 10\u2019x10\u2019 booth, website presence, and light perks like ticket discounts and giveaway inclusion. Perfect for small businesses or first-time VanFest participants.",
    categories: [
      {
        heading: "Digital Exposure",
        items: [
          "Logo with link on VanFest & event website.",
          "Branded ticket discount codes & printed event flyers.",
        ],
      },
      {
        heading: "Event Presence & Visibility",
        items: [
          "10\u2019x10\u2019 Placement in high-traffic vendor area of event.",
        ],
      },
      {
        heading: "Branding & Engagement",
        items: [
          "On-site giveaways of your products/services for various prizes.",
        ],
      },
      {
        heading: "On-Site Amenities & Access",
        items: [
          "Includes free GA tickets (10) for your family/friends/giveaways.",
          "Two staff access badges.",
          "Camping on site (not at booth location).",
        ],
      },
    ],
  },
  {
    name: "Local Artisan",
    price: "$150",
    frontage: null,
    summary:
      "A low cost-of-entry vendor spot for local crafters, artisans, and merchants. Includes space for a pop-up tent and table.",
    categories: [
      {
        heading: "Digital Exposure",
        items: [
          "Logo with link on VanFest & event website.",
          "Branded ticket discount codes & printed event flyers.",
        ],
      },
      {
        heading: "Event Presence & Visibility",
        items: [
          "10\u2019x10\u2019 Placement in high-traffic vendor area of event.",
        ],
      },
      {
        heading: "Branding & Engagement",
        items: [
          "On-site giveaways of your products/services for various prizes.",
        ],
      },
      {
        heading: "On-Site Amenities & Access",
        items: [
          "Includes free GA tickets (10) for your family/friends/giveaways.",
          "Two staff access badges.",
        ],
      },
    ],
  },
];

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
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full border border-white/20 transition-colors text-sm"
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
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full border border-white/20 transition-colors text-sm"
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
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-2.5 rounded-full border border-white/20 transition-colors text-sm"
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
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-full transition-colors"
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
                        {tier.frontage}
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
              className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-full transition-colors"
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
            className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-full transition-colors"
          >
            Apply Now
          </a>
        </div>
      </section>
    </>
  );
}
