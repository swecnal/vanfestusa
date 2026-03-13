import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Privacy Policy | VanFest",
  description: "VanFest privacy policy — how we collect, use, and protect your data",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Privacy Policy"
            subtitle="How we collect, use, and protect your information."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl prose prose-lg">
          <p className="text-charcoal/50 text-sm mb-8">
            Effective Date: March 13, 2026 &middot; Last Updated: March 13, 2026
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-6">
            VanFest is a nomadic event series brand operated by Ever Onward LLC,
            a Massachusetts-based Limited Liability Company
            (&ldquo;VanFest,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;). This Privacy Policy describes how we collect,
            use, and protect your personal information when you visit our website
            (vanfestusa.com), purchase tickets, opt in to our SMS messaging
            program, or otherwise interact with us.
          </p>

          {/* ── Information We Collect ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Information We Collect
          </h2>

          <h3 className="font-display font-bold text-lg text-charcoal mb-3">
            Information You Provide Directly
          </h3>
          <ul className="space-y-2 text-charcoal/70 text-sm mb-6">
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Contact information</strong>{" "}
                &mdash; name, email address, phone number, and mailing address
                when you purchase tickets, register for events, or contact us.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Payment information</strong>{" "}
                &mdash; credit/debit card details processed securely through our
                third-party payment processor (Stripe). We do not store your
                full card number on our servers.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Phone number for SMS</strong>{" "}
                &mdash; when you opt in to receive text messages from VanFest
                during the ticket checkout process or through other opt-in
                methods.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">
                  Communications and inquiries
                </strong>{" "}
                &mdash; any information you provide when you email us, fill out
                a contact form, or interact with us on social media.
              </span>
            </li>
          </ul>

          <h3 className="font-display font-bold text-lg text-charcoal mb-3">
            Information Collected Automatically
          </h3>
          <ul className="space-y-2 text-charcoal/70 text-sm mb-8">
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Usage data</strong> &mdash;
                pages visited, time spent on site, referring URL, browser type,
                device type, and IP address collected through standard web
                server logs and analytics tools.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Cookies</strong> &mdash; we
                may use cookies and similar technologies for site functionality
                and analytics. You can control cookie preferences through your
                browser settings.
              </span>
            </li>
          </ul>

          {/* ── How We Use Your Information ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            How We Use Your Information
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-3">
            We use the information we collect for the following purposes:
          </p>

          <ul className="space-y-2 text-charcoal/70 text-sm mb-8">
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              To process ticket purchases and event registrations
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              To send transactional communications (order confirmations, ticket
              delivery, event updates)
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              To send SMS messages to opted-in participants with event
              announcements, logistics, schedule updates, and important
              information related to VanFest events
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              To respond to your inquiries and provide customer support
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              To improve our website, events, and services
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              To comply with legal obligations
            </li>
          </ul>

          {/* ── SMS Messaging ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            SMS Messaging Program
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            When you opt in to receive SMS messages from VanFest (e.g., by
            checking the SMS opt-in box during ticket checkout), you consent to
            receive text messages from us related to VanFest events. These
            messages may include event announcements, schedule updates, logistical
            information, and important reminders.
          </p>

          <div className="bg-sand rounded-2xl p-6 mb-8">
            <p className="text-charcoal/70 text-sm leading-relaxed mb-3">
              <strong className="text-charcoal">
                Your phone number and personal information collected through our
                SMS program will not be sold, rented, or shared with third
                parties or affiliates for their own marketing or promotional
                purposes.
              </strong>
            </p>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              We only share your phone number with our SMS service provider
              (Twilio) solely for the purpose of delivering messages on our
              behalf. Twilio is bound by their own privacy policy and does not
              use your information for any purpose other than message delivery.
            </p>
          </div>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            You can opt out of SMS messages at any time by replying{" "}
            <strong>STOP</strong> to any message. For help, reply{" "}
            <strong>HELP</strong> or contact us at{" "}
            <a
              href="mailto:hello@vanfestusa.com"
              className="text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              hello@vanfestusa.com
            </a>{" "}
            or{" "}
            <a
              href="tel:8058263378"
              className="text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              805.826.3378
            </a>
            .
          </p>

          {/* ── Sharing Your Information ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Sharing Your Information
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-3">
            We do not sell your personal information. We may share your
            information only in the following limited circumstances:
          </p>

          <ul className="space-y-2 text-charcoal/70 text-sm mb-8">
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Service providers</strong>{" "}
                &mdash; trusted third-party providers who assist us with payment
                processing (Stripe), email delivery (Resend), SMS delivery
                (Twilio), and website hosting (Vercel). These providers are
                contractually obligated to use your data only as necessary to
                provide services to us.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Legal compliance</strong>{" "}
                &mdash; when required by law, subpoena, or other legal process,
                or to protect our rights, safety, or property.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Safety</strong> &mdash; if
                necessary to protect the safety of event attendees, staff, or
                the public (e.g., sharing information with law enforcement in
                the event of a safety incident at our events).
              </span>
            </li>
          </ul>

          {/* ── Data Security ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Data Security
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            We implement reasonable administrative, technical, and physical
            safeguards to protect your personal information. Payment information
            is processed through PCI-compliant payment processors and is never
            stored on our servers. However, no method of transmission over the
            internet or electronic storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          {/* ── Data Retention ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Data Retention
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            We retain your personal information for as long as necessary to
            fulfill the purposes described in this policy, comply with legal
            obligations, resolve disputes, and enforce our agreements. If you opt
            out of SMS messaging, we will remove your phone number from our
            active messaging list promptly. Transactional records (e.g., ticket
            purchases) may be retained for accounting and legal purposes.
          </p>

          {/* ── Your Rights ── */}
          <h2 className="font-display font-bold text-2xl mb-6">Your Rights</h2>

          <p className="text-charcoal/70 leading-relaxed mb-3">
            Depending on your state of residence, you may have certain rights
            regarding your personal information, including:
          </p>

          <ul className="space-y-2 text-charcoal/70 text-sm mb-4">
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              The right to access and obtain a copy of your personal information
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              The right to request correction of inaccurate information
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              The right to request deletion of your personal information
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              The right to opt out of SMS communications at any time
            </li>
          </ul>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            To exercise any of these rights, contact us at{" "}
            <a
              href="mailto:hello@vanfestusa.com"
              className="text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              hello@vanfestusa.com
            </a>
            . We will respond to your request within 30 days.
          </p>

          {/* ── Children's Privacy ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Children&apos;s Privacy
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            Our website and services are not directed to children under the age
            of 13. We do not knowingly collect personal information from children
            under 13. If you believe a child under 13 has provided us with
            personal information, please contact us so we can take steps to
            remove that information.
          </p>

          {/* ── Third-Party Links ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Third-Party Links
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            Our website may contain links to third-party websites or services
            (e.g., ticket platforms, merchandise stores, social media). We are
            not responsible for the privacy practices of these third parties. We
            encourage you to review their privacy policies before providing your
            information.
          </p>

          {/* ── Changes to This Policy ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Changes to This Policy
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated &ldquo;Last
            Updated&rdquo; date. Your continued use of our website or services
            after any changes constitutes your acceptance of the updated policy.
          </p>

          {/* ── Contact Us ── */}
          <h2 className="font-display font-bold text-2xl mb-6">Contact Us</h2>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us:
          </p>

          <ul className="space-y-2 text-charcoal/70 text-sm mb-8">
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Email:</strong>{" "}
                <a
                  href="mailto:hello@vanfestusa.com"
                  className="text-teal hover:text-teal-dark font-semibold transition-colors"
                >
                  hello@vanfestusa.com
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Phone:</strong>{" "}
                <a
                  href="tel:8058263378"
                  className="text-teal hover:text-teal-dark font-semibold transition-colors"
                >
                  805.826.3378
                </a>
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-teal font-bold">&bull;</span>
              <span>
                <strong className="text-charcoal">Mail:</strong> Ever Onward
                LLC, Massachusetts, USA
              </span>
            </li>
          </ul>

          <div className="mt-10 text-center text-charcoal/50 text-sm">
            <p>
              VanFest is a nomadic event series brand run by Ever Onward LLC, a
              Massachusetts-based Limited Liability Company.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
