"use client";

import SectionHeading from "@/components/SectionHeading";
import SponsorCarousel from "@/components/SponsorCarousel";

export default function EventsPage() {
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
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
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
              <a
                href="https://vanfest.fieldpass.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-teal hover:bg-teal-dark text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get Escape to the Cape Tickets
              </a>
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
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
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
