import SectionHeading from "@/components/SectionHeading";
import BounceCTA from "@/components/BounceCTA";
import Link from "next/link";

const events = [
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
    location: "",
    dates: "Details to be Announced",
    description:
      "Details coming soon for our Florida event! Stay tuned for what promises to be an unforgettable experience.",
    color: "from-purple-600 to-pink-500",
    tag: "Coming Soon",
    image: "/images/image157.jpg",
    href: "/events/liftoff",
    ticketUrl: "https://tickets.vanfestusa.com",
    fontOverride: "Orbitron, sans-serif",
  },
];

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

      {/* Events Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((ev) => (
              <div
                key={ev.name}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
              >
                <div
                  className={`relative bg-gradient-to-r ${ev.color} p-8 text-white overflow-hidden`}
                >
                  <img
                    src={ev.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
                  />
                  <div className="relative">
                    <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-lg mb-4">
                      {ev.tag}
                    </span>
                    <h3
                      className="font-display font-black text-3xl mb-1"
                      style={ev.fontOverride ? { fontFamily: ev.fontOverride } : undefined}
                    >
                      {ev.name}
                    </h3>
                    {ev.location && <p className="text-white/80 text-sm">{ev.location}</p>}
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
    </>
  );
}
