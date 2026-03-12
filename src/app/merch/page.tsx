import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Merch | VanFest",
  description: "Official VanFest merchandise",
};

export default function MerchPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Merch!"
            subtitle="Rep the VanFest brand wherever your adventures take you."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="bg-sand rounded-3xl p-12">
            <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-display font-bold text-2xl mb-4">
              Coming Soon!
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-6">
              Our official merch store is being set up. T-shirts, hoodies,
              stickers, magnets, and more will be available here soon. In the
              meantime, merch is available for purchase at every VanFest event!
            </p>
            <p className="text-charcoal/50 text-sm">
              Follow{" "}
              <a
                href="https://instagram.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:text-teal-dark font-semibold transition-colors"
              >
                @vanfestusa
              </a>{" "}
              for announcements.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
