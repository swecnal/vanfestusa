import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Contact | VanFest",
  description: "Get in touch with the VanFest team",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Get in Touch!"
            subtitle="We'd love to hear from you."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-charcoal/70 text-lg leading-relaxed text-center mb-12">
            We&apos;re here to help and answer any question you might have about
            VanFest. Whether you&apos;re curious about music line-ups, have
            questions about tickets, or just want to share your excitement about
            the festival, we&apos;d love to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a
              href="mailto:hello@vanfestusa.com"
              className="bg-sand hover:bg-teal/10 rounded-2xl p-8 text-center transition-colors group border border-transparent hover:border-teal/20"
            >
              <div className="w-14 h-14 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal/20 transition-colors">
                <svg
                  className="w-6 h-6 text-teal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mb-1">Email Us</h3>
              <p className="text-teal font-semibold">hello@vanfestusa.com</p>
            </a>

            <a
              href="tel:8058263378"
              className="bg-sand hover:bg-teal/10 rounded-2xl p-8 text-center transition-colors group border border-transparent hover:border-teal/20"
            >
              <div className="w-14 h-14 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal/20 transition-colors">
                <svg
                  className="w-6 h-6 text-teal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mb-1">Call Us</h3>
              <p className="text-teal font-semibold">805.826.3378</p>
            </a>
          </div>

          <div className="mt-12 text-center">
            <p className="text-charcoal/50 text-sm mb-4">Follow us on social media</p>
            <div className="flex gap-4 justify-center">
              <a
                href="https://instagram.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-sand hover:bg-teal text-charcoal hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/vanfestusa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-sand hover:bg-teal text-charcoal hover:text-white flex items-center justify-center transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
