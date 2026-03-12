import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Media | VanFest",
  description: "Photos and videos from VanFest events",
};

const galleryImages = Array.from({ length: 20 }, (_, i) => ({
  src: `https://vanfestusa.com/assets/images/gallery${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `VanFest gallery photo ${i + 1}`,
}));

export default function MediaPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Media"
            subtitle="Relive the moments from past VanFest events."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display font-bold text-2xl mb-8">Gallery</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl overflow-hidden group"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="font-display font-bold text-2xl mb-4">
              Community Media
            </h2>
            <p className="text-charcoal/70 mb-6 max-w-xl mx-auto">
              Share your VanFest photos and videos on social media with{" "}
              <span className="text-teal font-semibold">#VanFestUSA</span> and
              we&apos;ll feature the best ones here!
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://instagram.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal hover:bg-teal-dark text-white font-bold px-6 py-3 rounded-full transition-colors"
              >
                Follow on Instagram
              </a>
              <a
                href="https://facebook.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-charcoal/20 hover:border-charcoal text-charcoal font-bold px-6 py-3 rounded-full transition-colors"
              >
                Follow on Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
