import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Terms & Conduct | VanFest",
  description: "VanFest terms of service and code of conduct",
};

export default function TermsPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Terms & Conduct"
            subtitle="Guidelines for a safe and enjoyable VanFest experience."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl prose prose-lg">
          <h2 className="font-display font-bold text-2xl mb-6">
            What isn&apos;t allowed?
          </h2>
          <p className="text-charcoal/70 leading-relaxed mb-6">
            This is not a comprehensive list &mdash; use your best judgment. We
            reserve the right to amend, add, or remove anything from the list
            below. By attending, you agree to this.
          </p>

          <ul className="space-y-3 text-charcoal/70 text-sm">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Discriminative or divisive symbols and inappropriate imagery
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Political-fueled riffraff of any kind
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Weapons such as guns, knives, pepper spray, etc.
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Tobacco smoking inside the venue
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Drones (unless operated by our licensed & insured media partners)
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Aggressive or disruptive behavior
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Excessive noise during quiet hours (11pm - 7am)
            </li>
          </ul>

          <div className="bg-sand rounded-2xl p-6 mt-10">
            <h3 className="font-display font-bold text-lg text-teal-dark mb-4">
              Our Commitment
            </h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              VanFest is committed to providing a safe, inclusive, and welcoming
              environment for everyone &mdash; regardless of gender, age, sexual
              orientation, disability, physical appearance, race, ethnicity, or
              religion. We do not tolerate harassment of event participants in
              any form.
            </p>
          </div>

          <div className="mt-10 text-center text-charcoal/50 text-sm">
            <p>
              Questions? Contact us at{" "}
              <a
                href="mailto:hello@vanfestusa.com"
                className="text-teal hover:text-teal-dark font-semibold transition-colors"
              >
                hello@vanfestusa.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
