"use client";

import { useState, useCallback } from "react";
import SectionHeading from "@/components/SectionHeading";
import Lightbox from "@/components/Lightbox";

const galleryImages = [
  { src: "/images/gallery-73b0e325.jpg", alt: "VanFest gallery - community gathering" },
  { src: "/images/image06.jpg", alt: "VanFest vans on display" },
  { src: "/images/gallery-ad0b2066.jpg", alt: "VanFest gallery - sunset" },
  { src: "/images/image01.jpg", alt: "VanFest event photo" },
  { src: "/images/gallery-a1a9921b.jpg", alt: "VanFest gallery - van tours" },
  { src: "/images/image22.jpg", alt: "VanFest music" },
  { src: "/images/image08.jpg", alt: "VanFest workshops" },
  { src: "/images/gallery-9439939c.jpg", alt: "VanFest gallery - live music" },
  { src: "/images/image24.jpg", alt: "VanFest community event" },
  { src: "/images/image09.jpg", alt: "VanFest festival scene" },
  { src: "/images/gallery-82803eff.jpg", alt: "VanFest gallery - camping" },
  { src: "/images/image25.jpg", alt: "VanFest rigs" },
  { src: "/images/image07.jpg", alt: "VanFest community" },
  { src: "/images/image14.jpg", alt: "VanFest sunset" },
  { src: "/images/image10.jpg", alt: "VanFest builds" },
  { src: "/images/image19.jpg", alt: "VanFest camping area" },
  { src: "/images/image12.jpg", alt: "VanFest van interiors" },
  { src: "/images/image23.jpg", alt: "VanFest experience" },
  { src: "/images/image26.jpg", alt: "VanFest gathering" },
  { src: "/images/image21.jpg", alt: "VanFest vendors" },
  { src: "/images/image37.jpg", alt: "VanFest panoramic" },
  // Drive folder 1 - Bruce Murray Photography (Cape Cod setup day)
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9180.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9182.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9189.jpg", alt: "VanFest Cape Cod setup" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9193.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9200.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9206.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9208.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9213.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9216.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9219.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9223.jpg", alt: "VanFest Cape Cod" },
  { src: "/images/drive1/BruceMurrayPhoto_com-20250820-VanFest-Cape-Cod-9229.jpg", alt: "VanFest Cape Cod potluck" },
  // Drive folder 2 - Community uploads
  { src: "/images/drive2/IMG_0119.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_0133.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_1925.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_1928.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_1932.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_1936.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_1938.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_1941.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/IMG_1943.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/19c95c60-a94c-422b-a1d8-863df833d276.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/64085c0e-0817-4ea3-bf76-92ca0cba46d2.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/81246df8-166f-450d-bb25-94cb4182c8f4.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/c1bae530-e590-47f7-844f-86921fbef3e9.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/c384f429-093d-48f1-9f06-e38f5db4b5b3.jpeg", alt: "VanFest community photo" },
  { src: "/images/drive2/c408226c-bc92-4d26-b7df-b46913b2e8fc.jpeg", alt: "VanFest community photo" },
];

export default function MediaPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  }, []);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  }, []);

  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image37.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="Media"
            subtitle="Relive the moments from past VanFest events."
            light
          />
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display font-bold text-2xl mb-8">Gallery</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {galleryImages.map((img, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(i)}
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
        </div>
      </section>

      {/* Community Media */}
      <section id="community" className="py-20 px-4 bg-sand scroll-mt-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display font-bold text-2xl mb-4 text-center">
            Community Media
          </h2>
          <p className="text-charcoal/70 mb-6 text-center text-lg">
            The VanFest Community Media Program is your chance to share your
            VanFest experience with the world!
          </p>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="font-display font-bold text-xl text-teal-dark mb-4">
              How It Works
            </h3>
            <div className="space-y-4 text-charcoal/70 text-sm leading-relaxed">
              <p>
                Capture and upload your best VanFest photos and videos to our
                shared community gallery. Whether it&apos;s a stunning sunset over
                the campgrounds, your favorite van build, or an unforgettable
                moment with new friends — we want to see it all!
              </p>
              <p>
                <strong className="text-charcoal">Guidelines:</strong> Keep it
                family-friendly, respectful, and VanFest-related. By uploading
                you grant VanFest permission to use your media for promotional
                purposes with credit given.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <a
                href="https://driveuploader.com/upload/gBGqZuXflO/embed/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal hover:bg-teal-dark text-white font-bold px-6 py-3 rounded-xl transition-colors text-center"
              >
                Upload Your Photos
              </a>
              <a
                href="https://drive.google.com/drive/folders/1CgsbfH8Z1EsRhwevaCC6fzoRf-mXl8rW?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-teal/30 hover:border-teal text-teal-dark font-bold px-6 py-3 rounded-xl transition-colors text-center"
              >
                View Community Gallery
              </a>
            </div>
          </div>

          <div className="text-center">
            <p className="text-charcoal/60 text-sm mb-4">
              You can also tag us on social media with{" "}
              <span className="text-teal font-semibold">#VanFestUSA</span>
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://instagram.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-teal hover:bg-teal-dark text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Follow on Instagram
              </a>
              <a
                href="https://facebook.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-charcoal/20 hover:border-charcoal text-charcoal font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Follow on Facebook
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={galleryImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  );
}
