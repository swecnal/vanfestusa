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
];

const DRIVE_FOLDER_ID = "1CgsbfH8Z1EsRhwevaCC6fzoRf-mXl8rW";

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
      <section className="py-20 px-4 bg-white">
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

      {/* Community Media - Google Drive */}
      <section className="py-20 px-4 bg-sand">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display font-bold text-2xl mb-4 text-center">
            Community Media
          </h2>
          <p className="text-charcoal/70 mb-8 max-w-xl mx-auto text-center">
            Browse and share photos from our community! Upload your VanFest
            photos and videos to our shared folder, or tag us with{" "}
            <span className="text-teal font-semibold">#VanFestUSA</span> on
            social media.
          </p>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src={`https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`}
              className="w-full border-0"
              style={{ height: "600px" }}
              title="VanFest Community Photos"
              allow="autoplay"
            />
          </div>

          <p className="text-center mt-4 text-sm text-charcoal/50">
            <a
              href={`https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              Open in Google Drive
            </a>{" "}
            to view full-size photos or upload your own.
          </p>

          <div className="flex gap-4 justify-center mt-8">
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
