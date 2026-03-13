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
  const [termsOpen, setTermsOpen] = useState(false);

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
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            VanFest Community Media Program
          </h2>
          <div className="text-charcoal/70 mb-8 text-center max-w-3xl mx-auto space-y-4">
            <p className="text-lg">
              VanFest believes that sharing is caring, and we want to create a
              space where everyone can celebrate and relive the incredible
              experiences that make our events so special.
            </p>
            <p>
              This initiative is designed to bring the VanFest community closer
              by making it easy to share event moments, inspiring others to
              embrace the vanlife movement and experience the magic of life on
              the road. Whether it&apos;s a stunning sunset over a van-lined
              campground, an unforgettable workshop, or just the joy of meeting
              fellow nomads, your captured moments help tell the VanFest story.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h3 className="font-display font-bold text-xl text-teal-dark mb-4">
              How It Works
            </h3>
            <p className="text-charcoal/70 text-sm leading-relaxed mb-4">
              Through this program, anyone who attends VanFest can upload their
              pictures and videos to our Community Media Folder, where they will
              be freely available for others in the community to use for:
            </p>
            <ul className="space-y-2 text-charcoal/70 text-sm mb-6">
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Social media posts that showcase the VanFest experience
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                Event recaps to highlight key moments and memories
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                VanFest-specific promotions that help grow and strengthen our community
              </li>
            </ul>

            <h3 className="font-display font-bold text-xl text-teal-dark mb-4">
              Guidelines for Use
            </h3>
            <p className="text-charcoal/70 text-sm leading-relaxed mb-3">
              By uploading to the Community Media Folder, you agree to the following:
            </p>
            <ul className="space-y-2 text-charcoal/70 text-sm mb-6">
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                <span><strong className="text-charcoal">Open Sharing</strong> &mdash; Anyone in the community can use the uploaded media for non-commercial purposes related to VanFest.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                <span><strong className="text-charcoal">No Selling</strong> &mdash; Your contributions will not be sold (e.g., as prints, stock photos, or for commercial resale).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                <span><strong className="text-charcoal">Respectful Use</strong> &mdash; All media should be used in a positive way that respects VanFest, its attendees, sponsors, vendors, and the greater vanlife community.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-teal font-bold">&bull;</span>
                <span><strong className="text-charcoal">Agreement to Terms</strong> &mdash; Before uploading, please review the{" "}
                  <button
                    onClick={() => setTermsOpen(true)}
                    className="text-teal hover:text-teal-dark font-semibold underline underline-offset-2 transition-colors"
                  >
                    full Community Media Agreement
                  </button>.
                </span>
              </li>
            </ul>

            <h3 className="font-display font-bold text-xl text-teal-dark mb-4">
              Why Participate?
            </h3>
            <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
              The VanFest community is built on connection and collaboration. By
              contributing, you&apos;re helping to create an ever-growing archive
              of vanlife adventures that inspire and connect both newcomers and
              seasoned nomads alike. Whether you&apos;re looking for the perfect
              photo to share your VanFest experience or just want to reminisce
              about the good times, this program ensures those memories live on.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Community Media Terms Modal */}
      {termsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setTermsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-charcoal/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-display font-bold text-xl text-charcoal">
                Community Media Agreement
              </h2>
              <button
                onClick={() => setTermsOpen(false)}
                className="text-charcoal/40 hover:text-charcoal transition-colors p-1"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6 space-y-5">
              <p className="text-charcoal/70 leading-relaxed text-sm">
                Thank you for contributing to the VanFest Community Media Folder!
                By uploading media (photos, videos, or other content) to any
                folder shared by VanFest, you agree to the following terms:
              </p>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">Open Use for VanFest Promotion</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Any media uploaded to this folder may be freely used by VanFest organizers, attendees, sponsors, and vendors for social media posts, event recaps, and VanFest-specific promotional purposes.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">No Compensation</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  You acknowledge that any media you upload is provided voluntarily, and you will not receive financial compensation or royalties for its use.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">No Direct Sales of Uploaded Media</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  VanFest and any other users of this folder will not sell the uploaded media directly (e.g., prints, stock photo sales, merchandise, etc.). However, it may be used in promotional materials related to VanFest.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">Respectful and Positive Use</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Any media used must align with the spirit of community and respect. No uploaded media may be used in a way that misrepresents, disparages, or negatively portrays VanFest, its attendees, sponsors, vendors, or any individuals featured in the content.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">Restricted Use for Other Events</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Any media in this folder is NOT to be used to promote other events without express permission from VanFest.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">Intellectual Property Protection</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  Anyone uploading media to this folder agrees that VanFest has the right to claim IP ownership of that media for non-profit purposes, solely to protect VanFest&apos;s intellectual property. VanFest will NOT claim to be the original owner of any media in this folder, except for media taken by and directly for VanFest (e.g., VanFest staff, paid photographers, etc.) and will only claim IP rights should an IP violation occur (e.g., another event owner uses this media to promote a non-VanFest event without express written permission). Ultimately, YOU own the media you created, and you agree that you will not give permission to any other events to use media from a VanFest event to promote non-VanFest events.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">Shared Responsibility</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  By uploading media, you confirm that you have the rights to share it and that it does not infringe on any third-party copyrights, trademarks, or privacy rights.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">Automatic Agreement</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  No formal signature is required. By accessing, uploading, or downloading to/from the shared folder, you automatically agree to these terms.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-base text-charcoal mb-1">No Deletion of Data</h3>
                <p className="text-charcoal/70 text-sm leading-relaxed">
                  While you&apos;ll have the ability to delete files in this folder, please don&apos;t! We&apos;re trusting you all to match the level of respect and trust we&apos;re putting out there by doing this. All files in this folder are automatically backed up elsewhere, and all activity is logged.
                </p>
              </div>

              <p className="text-charcoal/70 leading-relaxed text-sm">
                If you have any questions or concerns about media usage, please
                contact VanFest organizers before using the Community Media service.
                Thank you for sharing your experiences and helping to grow the
                VanFest community!
              </p>
            </div>
          </div>
        </div>
      )}

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
