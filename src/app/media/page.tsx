import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Media | VanFest",
  description: "Photos and videos from VanFest events",
};

const galleryImages = [
  { src: "https://vanfestusa.com/assets/images/gallery03/73b0e325_original.jpg?v=c74940d3", alt: "VanFest gallery - community gathering" },
  { src: "https://vanfestusa.com/assets/images/gallery03/a1a9921b_original.jpg?v=c74940d3", alt: "VanFest gallery - van tours" },
  { src: "https://vanfestusa.com/assets/images/gallery03/ad0b2066_original.jpg?v=c74940d3", alt: "VanFest gallery - sunset" },
  { src: "https://vanfestusa.com/assets/images/gallery03/9439939c_original.jpg?v=c74940d3", alt: "VanFest gallery - live music" },
  { src: "https://vanfestusa.com/assets/images/gallery03/82803eff_original.jpg?v=c74940d3", alt: "VanFest gallery - camping" },
  { src: "https://vanfestusa.com/assets/images/image01.jpg?v=c74940d3", alt: "VanFest event photo" },
  { src: "https://vanfestusa.com/assets/images/image06.jpg?v=c74940d3", alt: "VanFest vans on display" },
  { src: "https://vanfestusa.com/assets/images/image07.jpg?v=c74940d3", alt: "VanFest community" },
  { src: "https://vanfestusa.com/assets/images/image08.jpg?v=c74940d3", alt: "VanFest workshops" },
  { src: "https://vanfestusa.com/assets/images/image09.jpg?v=c74940d3", alt: "VanFest festival scene" },
  { src: "https://vanfestusa.com/assets/images/image10.jpg?v=c74940d3", alt: "VanFest builds" },
  { src: "https://vanfestusa.com/assets/images/image11.jpg?v=c74940d3", alt: "VanFest attendees" },
  { src: "https://vanfestusa.com/assets/images/image12.jpg?v=c74940d3", alt: "VanFest van interiors" },
  { src: "https://vanfestusa.com/assets/images/image14.jpg?v=c74940d3", alt: "VanFest sunset" },
  { src: "https://vanfestusa.com/assets/images/image19.jpg?v=c74940d3", alt: "VanFest camping area" },
  { src: "https://vanfestusa.com/assets/images/image21.jpg?v=c74940d3", alt: "VanFest vendors" },
  { src: "https://vanfestusa.com/assets/images/image22.jpg?v=c74940d3", alt: "VanFest music" },
  { src: "https://vanfestusa.com/assets/images/image23.jpg?v=c74940d3", alt: "VanFest experience" },
  { src: "https://vanfestusa.com/assets/images/image24.jpg?v=c74940d3", alt: "VanFest community event" },
  { src: "https://vanfestusa.com/assets/images/image25.jpg?v=c74940d3", alt: "VanFest rigs" },
  { src: "https://vanfestusa.com/assets/images/image26.jpg?v=c74940d3", alt: "VanFest gathering" },
  { src: "https://vanfestusa.com/assets/images/image37.jpg?v=c74940d3", alt: "VanFest panoramic" },
];

const DRIVE_FOLDER_ID = "1CgsbfH8Z1EsRhwevaCC6fzoRf-mXl8rW";

export default function MediaPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="https://vanfestusa.com/assets/images/image37.jpg?v=c74940d3"
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
      </section>
    </>
  );
}
