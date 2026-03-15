"use client";

import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import type { ImageGalleryData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function ImageGallerySection({ data, settings }: Props) {
  const d = data as unknown as ImageGalleryData;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const cols = d.columns || 3;
  const colClass =
    cols === 1
      ? "columns-1"
      : cols === 2
        ? "columns-1 sm:columns-2"
        : cols === 4
          ? "columns-1 sm:columns-2 lg:columns-4"
          : "columns-1 sm:columns-2 lg:columns-3";

  return (
    <section style={sectionSpacingStyles(settings)} className={`px-4 bg-white ${settings.customClasses || ""}`}>
      <div className={`mx-auto ${settings.maxWidth || "max-w-6xl"}`}>
        {d.heading && (
          <h2 className="font-display font-black text-3xl text-charcoal mb-8 text-center">
            {d.heading}
          </h2>
        )}
        <div className={`${colClass} gap-4`}>
          {d.images.map((img, i) => (
            <div
              key={i}
              className="break-inside-avoid mb-4 rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => d.enableLightbox !== false && setLightboxIndex(i)}
            >
              <img
                src={img.src}
                alt={img.alt || ""}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        {lightboxIndex !== null && d.enableLightbox !== false && (
          <Lightbox
            images={d.images.map((img) => ({ src: img.src, alt: img.alt || "" }))}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : d.images.length - 1))}
            onNext={() => setLightboxIndex((prev) => (prev !== null && prev < d.images.length - 1 ? prev + 1 : 0))}
          />
        )}
      </div>
    </section>
  );
}
