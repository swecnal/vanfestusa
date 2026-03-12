import HeroCarousel from "@/components/HeroCarousel";
import VehicleConvoy from "@/components/VehicleConvoy";
import SponsorMarquee from "@/components/SponsorMarquee";
import SectionHeading from "@/components/SectionHeading";
import BounceCTA from "@/components/BounceCTA";
import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: "Workshops & Classes",
    desc: "Expert-led sessions, panels, and hands-on demos to help you hit the road the RIGHT way.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: "Amazing Vendors",
    desc: "Industry-leading vanlife vendors and sponsors showcasing the latest gear and builds.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    ),
    title: "Van & Rig Tours",
    desc: "Dozens of amazing, unique conversions open for tours at every event.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Community",
    desc: "Connect with hundreds of like-minded vanlifers, nomads, and travelers.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Inspiration",
    desc: "Get inspired for YOUR nomadic adventure from seasoned travelers and first-timers alike.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    title: "Live Music",
    desc: "Live performances, dance parties, and unforgettable nights under the stars.",
  },
];

const upcomingEvents = [
  {
    name: "Escape to the Cape",
    location: "Cape Cod Fairgrounds, East Falmouth, MA",
    dates: "August 20 - 24, 2026",
    description:
      "Let's Escape (back to) the Cape this summer! We'll be on picturesque Cape Cod for the second annual largest vanlife and nomadic celebration in New England!",
    color: "from-blue-600 to-teal",
    tag: "Early Bird Tickets On Sale!",
    image: "/images/image127.jpg",
    href: "/events/escape",
    ticketUrl: "https://vanfest.ticketspice.com/escape2026",
  },
  {
    name: "LIFTOFF!",
    location: "Melbourne, FL",
    dates: "February 4 - 8, 2027",
    description:
      "Details coming soon for our Florida event! Stay tuned for what promises to be an unforgettable experience.",
    color: "from-purple-600 to-pink-500",
    tag: "Coming Soon",
    image: "/images/image157.jpg",
    href: "/events/liftoff",
    ticketUrl: "https://vanfest.fieldpass.app",
  },
];

export default function Home() {
  return (
    <>
      <HeroCarousel />

      {/* Scrolling Vehicle Convoy */}
      <VehicleConvoy seed={42} count={6} />

      {/* What is VanFest */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            title="What is VanFest?"
            subtitle="Part festival, part expo, and ALL focused around showcasing and celebrating the amazing vanlife / nomadic community."
          />
          <p className="text-lg text-charcoal/70 leading-relaxed mb-8">
            VanFest gathers hundreds of converted vans, buses, and everything
            in-between for music, games, learning, and memories. This
            long-weekend event brings together the entire nomadic community for
            four days and nights of connection, celebration, and inspiration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-sand rounded-2xl p-6">
              <h3 className="font-display font-bold text-xl mb-2 text-teal-dark">
                Camping & Festival
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Open to everyone &mdash; whether you&apos;re in a van, bus, car/SUV, or
                just bringing a tent. Four unforgettable days and nights of live
                music, dance parties, epic potlucks, workshops, yoga, and more!
              </p>
            </div>
            <div className="bg-sand rounded-2xl p-6">
              <h3 className="font-display font-bold text-xl mb-2 text-teal-dark">
                Public Expo & Tours
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Van curious? Join us for unlimited tours of dozens of converted
                vans & buses, live music, local food trucks, workshops, lifestyle
                influencers, and industry-leading vendors. Kids are free!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider: white to charcoal */}
      <div className="relative bg-charcoal -mt-1">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block w-full h-[40px] sm:h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,0 L0,30 Q180,60 360,30 T720,30 T1080,30 T1440,30 L1440,0 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Features */}
      <section className="py-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="All VanFest Events Feature"
            light
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
              >
                <div className="text-teal mb-4 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reverse Vehicle Convoy */}
      <VehicleConvoy seed={99} count={5} reverse marginTop="0px" />

      {/* Upcoming Events */}
      <section className="py-20 px-4 bg-sand">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title="Upcoming Events" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.name}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
              >
                <div
                  className={`relative bg-gradient-to-r ${ev.color} p-8 text-white overflow-hidden`}
                >
                  <img src={ev.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
                  <div className="relative">
                    <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">
                      {ev.tag}
                    </span>
                    <h3 className="font-display font-black text-3xl mb-1">
                      {ev.name}
                    </h3>
                    <p className="text-white/80 text-sm">{ev.location}</p>
                    <p className="text-white/80 text-sm font-semibold mt-1">
                      {ev.dates}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
                    {ev.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link
                      href={ev.href}
                      className="text-teal hover:text-teal-dark font-semibold text-sm transition-colors"
                    >
                      Event Details &rarr;
                    </Link>
                    <BounceCTA
                      href={ev.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal hover:bg-teal-dark text-white font-bold px-5 py-2 rounded-xl text-sm transition-colors"
                    >
                      Get Tickets
                    </BounceCTA>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            title="Get Involved!"
            subtitle="Want to be a part of the ultimate vanlife experience?"
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/get-involved#exhibit"
              className="group bg-sand hover:bg-teal/10 rounded-2xl p-6 transition-colors border border-transparent hover:border-teal/20"
            >
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-teal transition-colors">
                Exhibit Your Rig
              </h3>
              <p className="text-charcoal/60 text-sm">
                Open your doors and inspire the next generation of nomads.
              </p>
            </Link>
            <Link
              href="/get-involved#sponsors"
              className="group bg-sand hover:bg-teal/10 rounded-2xl p-6 transition-colors border border-transparent hover:border-teal/20"
            >
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-teal transition-colors">
                Sponsors & Vendors
              </h3>
              <p className="text-charcoal/60 text-sm">
                Showcase your brand to the vanlife community.
              </p>
            </Link>
            <Link
              href="/get-involved#jobs"
              className="group bg-sand hover:bg-teal/10 rounded-2xl p-6 transition-colors border border-transparent hover:border-teal/20"
            >
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-teal transition-colors">
                Jobs @ VanFest
              </h3>
              <p className="text-charcoal/60 text-sm">
                Volunteer or join our team at the next event.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Sponsor Marquee */}
      <SponsorMarquee />

      {/* Builds Gallery Preview */}
      <section className="relative py-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image24.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="Check Out These Builds!"
            subtitle="VanFest has dozens of amazing, unique conversions open for tours at each event."
            light
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            <div className="rounded-xl overflow-hidden">
              <img src="/images/image07.jpg" alt="Van build" className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img src="/images/image12.jpg" alt="Van interior" className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img src="/images/image14.jpg" alt="Van conversion" className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img src="/images/image19.jpg" alt="Van touring" className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/media"
              className="bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors text-center"
            >
              View Gallery
            </Link>
            <Link
              href="/get-involved#exhibit"
              className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3 rounded-xl transition-colors hover:bg-white/10 text-center"
            >
              Exhibit My Rig!
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
