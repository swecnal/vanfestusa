import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";

export const metadata = {
  title: "About | VanFest",
  description: "Learn about VanFest, the ultimate vanlife experience",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image21.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="About VanFest"
            subtitle="The story behind the ultimate vanlife experience."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl">
          {/* Hero image */}
          <div className="rounded-2xl overflow-hidden mb-10">
            <img
              src="/images/image23.jpg"
              alt="VanFest community gathering"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-charcoal/80 text-lg leading-relaxed mb-6">
              VanFest is the <strong>ultimate vanlife experience</strong> &mdash; a
              nomadic event series that brings together hundreds of converted
              vans, buses, and alternative dwellings for an unforgettable
              celebration of community, creativity, and the open road.
            </p>
            <p className="text-charcoal/70 leading-relaxed mb-6">
              Each VanFest event is part festival, part expo, and ALL focused
              around showcasing and celebrating the amazing vanlife and nomadic
              community. From live music and dance parties to expert workshops
              and van tours, every event is designed to inspire, connect, and
              create memories that last a lifetime.
            </p>
            <p className="text-charcoal/70 leading-relaxed mb-6">
              Whether you&apos;re a seasoned traveler or new to vanlife,
              there&apos;s something for everyone at VanFest. Our events bring
              together people from all walks of life who share a love for
              adventure, freedom, and the nomadic lifestyle.
            </p>

            <div className="bg-sand rounded-2xl p-8 my-10 text-center">
              <p className="font-accent text-2xl italic text-charcoal/80">
                &ldquo;miles &bull; moments &bull; music &bull; memories&rdquo;
              </p>
            </div>

          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/magnet"
              className="text-center bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-full transition-colors inline-flex items-center justify-center"
            >
              Found a Magnet?
            </Link>
            <Link
              href="/terms"
              className="text-center border-2 border-charcoal/20 hover:border-charcoal text-charcoal font-bold px-8 py-3 rounded-full transition-colors inline-flex items-center justify-center"
            >
              Terms & Conduct
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
