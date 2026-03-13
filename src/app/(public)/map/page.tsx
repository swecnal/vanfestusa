import SectionHeading from "@/components/SectionHeading";

export default function MapPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image10.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="Event Map"
            subtitle="Find your way around VanFest."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="bg-sand rounded-3xl p-12 md:p-16">
            <svg
              className="w-16 h-16 text-teal mx-auto mb-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <h2 className="font-display font-black text-3xl text-charcoal mb-4">
              Official Event Map Coming Soon!
            </h2>
            <p className="text-charcoal/60 text-lg leading-relaxed mb-6">
              We&apos;re putting the finishing touches on an interactive map for
              each VanFest event. Check back closer to the event date for
              camping areas, vendor locations, stages, food trucks, and more.
            </p>
            <p className="text-charcoal/40 text-sm">
              Maps will be available for download and on-site at check-in.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
