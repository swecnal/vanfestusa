import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Found a Magnet? | VanFest",
  description: "You found a VanFest magnet! Here's what to do.",
};

export default function MagnetPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="WOAH — you got a MAGNET?!"
            subtitle="Lucky you! Here's the deal."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display font-bold text-2xl mb-6 text-teal-dark">
            Why did I get a magnet?
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            It&apos;s our little way of saying &ldquo;hello&rdquo;! While
            we&apos;re traveling, we always have vans and other rigs catch our
            eye. Since we don&apos;t always have time to say
            &ldquo;hello,&rdquo; we like to leave something so the owners can
            reach out if they&apos;d like.
          </p>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            Stickers were, of course, the easiest idea. But let&apos;s face it
            &mdash; it&apos;s kind of rude to put a sticker on someone&apos;s
            van! So, we went with magnets. Easy to leave on a rig, doesn&apos;t
            harm the paint, and is re-usable!
          </p>

          <div className="bg-teal/5 border-2 border-teal/20 rounded-2xl p-8 my-10">
            <h3 className="font-display font-bold text-xl mb-4 text-teal-dark">
              So, what do I do?
            </h3>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              Well, you don&apos;t <strong>have</strong> to do anything! You can
              just enjoy the free magnet.
            </p>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              <strong>BUT</strong> if you&apos;d like a 100% free camping ticket
              to <em>any</em> VanFest event, then you&apos;re in luck!
            </p>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              Just throw up a post on your social media channel of choice (we
              prefer{" "}
              <a
                href="https://instagram.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:text-teal-dark font-semibold transition-colors"
              >
                Instagram
              </a>
              , but we&apos;re also on{" "}
              <a
                href="https://facebook.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:text-teal-dark font-semibold transition-colors"
              >
                Facebook
              </a>
              ) of you with your NICE RIG! magnet. It could be you holding it,
              on your van, whatever!
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              Get creative with it! Just make sure to mention us and tag{" "}
              <span className="text-teal font-semibold">@vanfestusa</span>.
              We&apos;ll reach out with your free ticket!
            </p>
          </div>

          <p className="text-charcoal/50 text-sm text-center">
            We are <strong>not</strong> on Twitter/X or TikTok.
          </p>
        </div>
      </section>
    </>
  );
}
