import SectionHeading from "@/components/SectionHeading";

export const metadata = {
  title: "Terms & Conduct | VanFest",
  description:
    "VanFest terms of service, code of conduct, and community guidelines",
};

export default function TermsPage() {
  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Terms, Conditions, & Code of Conduct"
            subtitle="VanFest is a safe, respectful, inclusive, and creative environment for everyone to enjoy."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl prose prose-lg">
          {/* ── Preamble ── */}
          <p className="text-charcoal/70 leading-relaxed mb-6">
            These Terms, Conditions, and Code of Conduct apply to everyone at
            the event and who participate in our social media channels, and we
            hope to see it reflected in the way we treat one another in general.
            Guests, staff, volunteers, vendors, sponsors, and press will be held
            to the same standards. We reserve the right to remove or ban any
            person who does not adhere to the Code of Conduct.
          </p>

          <div className="bg-red-50 border-l-4 border-red-400 rounded-r-2xl p-6 mb-10">
            <p className="text-charcoal/90 font-semibold text-sm leading-relaxed mb-2">
              You are responsible for reading this before buying a ticket.
            </p>
            <p className="text-charcoal/70 text-sm leading-relaxed mb-2">
              Not reading it is <strong>not</strong> an excuse to violate
              anything here.
            </p>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              If you <strong>ever</strong> need to contact VanFest for an
              emergency situation at our events, call us at{" "}
              <a
                href="tel:8058263378"
                className="text-teal hover:text-teal-dark font-semibold transition-colors"
              >
                805.826.3378
              </a>
              .
            </p>
          </div>

          <p className="text-charcoal/70 leading-relaxed mb-6">
            By purchasing a ticket to VanFest, you (&ldquo;you&rdquo; or
            &ldquo;Ticket Holder&rdquo;) are agreeing to the following terms and
            conditions. Please read these terms carefully before completing your
            purchase. If you do not agree with these terms, do not purchase a
            ticket for VanFest.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            By purchasing a ticket to VanFest, you acknowledge that you&apos;ve
            had the opportunity to review these terms prior to purchase. Your
            decision to complete the purchase means that you accept these terms.
            VanFest is not responsible for any claims or disputes arising from
            your failure to read, understand, or comply with these terms.
          </p>

          {/* ── Safety, Conduct, and Zero Tolerance ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Safety, Conduct, and Zero Tolerance
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            In a nutshell, when it comes to safety, we&apos;re{" "}
            <strong>not messing around</strong>. VanFest strives to create a
            safe space for <em>everyone</em>, regardless of gender, race, sexual
            orientation, political beliefs, or any other of the myriad of things
            that divide us in this world. If at any time during a VanFest event
            you do not feel safe, or you observe someone else exhibiting
            behavior that they may not feel safe, say something. Find a VanFest
            staff member or volunteer. Reach out to us via email or social
            media. Call us directly at{" "}
            <a
              href="tel:8058263378"
              className="text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              805.826.3378
            </a>
            . If you see something, say something.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            Making anyone feel unsafe through words or actions is unacceptable.
            Anyone found doing so will be removed from the event and no longer
            allowed at future events{" "}
            <strong>without exception</strong>. VanFest{" "}
            <strong>will</strong> involve the police or other authorities{" "}
            <strong>without exception</strong>. VanFest will{" "}
            <strong>not</strong> be playing favorites or siding with{" "}
            <em>anyone</em> involved in an unsafe situation. VanFest will
            provide all available evidence to authorities in a situation that
            warrants it. If anyone&apos;s behavior at a VanFest event or
            involving in some way a VanFest event negatively affects
            VanFest&apos;s brand, image, or status, VanFest{" "}
            <strong>will</strong> pursue legal action for any/all damages as
            allowed by the law.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            VanFest is a safe, respectful, inclusive, and creative environment
            for <em>everyone</em> to enjoy. This Code of Conduct and Community
            Guidelines apply to everyone at the event and who participate in our
            social media channels, and we hope to see it reflected in the way we
            treat one another in general. Guests, staff, volunteers, vendors,
            sponsors, and press will be held to the same standards. We reserve
            the right to (and will) remove and/or ban any person who does not
            adhere to the Code of Conduct and Community Guidelines.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-3">
            We do not tolerate harassment of any kind, including but not limited
            to:
          </p>

          <ul className="space-y-2 text-charcoal/70 text-sm mb-4">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Intimidation or threats of any nature
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Inappropriate disruption of events for any reason
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Intentionally hurtful language
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Physical assault of any type
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Inappropriate physical contact
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Unwanted sexual attention
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Unwanted photography or video recording
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Bullying or stalking
            </li>
          </ul>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            This applies especially in connection to race or ethnicity, national
            origin, gender identity or presentation, sex or sexual orientation,
            age, religion, disability, medical condition, or pregnancy,
            citizenship status, and political ideology, but we&apos;re not
            limiting it to just those categories. It is solely at VanFest&apos;s
            discretion what is and is not considered disruptive, harassive, or
            any other descriptor that accurately represents unwanted and/or
            unwelcome behavior.
          </p>

          {/* ── Security & Weapons ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Security &amp; Weapons
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            For the safety and security of all attendees, weapons are not
            permitted at VanFest. Bags may be searched at the discretion of
            VanFest, and any items deemed dangerous, disruptive, or otherwise
            inappropriate may be confiscated until the owner exits the venue.
            Fireworks and other explosive devices are strictly prohibited.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            You agree to behave responsibly and respectfully while attending
            VanFest, and to comply with all applicable laws, rules, and
            regulations. You acknowledge that VanFest may refuse entry or remove
            any attendee from the event for disruptive, unsafe, or inappropriate
            conduct, at their sole discretion, including involving law
            enforcement. No refunds will be issued for tickets in such cases.
            Anyone that is removed from the event will not be allowed at any
            future VanFest events, and for the safety of the community that
            person&apos;s information may be given to other related event
            companies.
          </p>

          {/* ── Dogs / Pets ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Dogs / Pets
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            We love dogs! Honestly, meeting so many new doggo friends is one of
            the best perks of running VanFest. However, we have a strict
            on-leash dog policy at all events. No dog should ever run around
            unleashed at VanFest &mdash; this allows members of the community to
            participate if they have a reactive dog, are nervous around dogs,
            have other pets, etc. There are no exceptions to this rule. Owners
            with dogs displaying aggressive or unruly behavior will be asked to
            put their dog inside their rig and may be asked to leave, at the
            discretion of VanFest. You are responsible for the behavior of your
            pet(s) and must ensure that pets do not cause any harm or
            disturbance to other attendees, staff, or the event venue. Owners
            are required to clean up after their pets and dispose of waste
            properly. Failure to comply with these rules may result in removal
            from the event without a refund. Additionally, you should be aware
            of any local regulations or restrictions regarding pets, including
            ensuring that their pets&apos; vaccinations and health documentation
            are up to date before attending VanFest.
          </p>

          {/* ── Media Agreement ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Media Agreement
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            By attending VanFest, you grant VanFest the irrevocable and
            unrestricted right to use, reproduce, distribute, and display any
            photographs, video, audio, or other media that either captures your
            likeness, voice, or participation in the event, or that you share of
            a VanFest event or the travel to or from a VanFest event on social
            media platforms, without payment or compensation. VanFest will make
            every reasonable effort to credit you or the original creator where
            possible. This grant includes the right to modify, adapt, and create
            derivative works from such media. You also agree that you may not
            revoke this permission, and hereby waive any right to royalties,
            payments, or other compensation arising from the use of such media
            by VanFest. You also agree that anything you post to social media
            channels tagged with VanFest-related tags or mentions can be used by
            VanFest however we see fit.
          </p>

          {/* ── Community Media Agreement ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Community Media Agreement
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            Thank you for contributing to the VanFest Community Media Folder! By
            uploading media (photos, videos, or other content) to any folder
            shared by VanFest, you agree to the following terms:
          </p>

          <div className="space-y-4 mb-10">
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                Open Use for VanFest Promotion
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Any media uploaded to this folder may be freely used by VanFest
                organizers, attendees, sponsors, and vendors for social media
                posts, event recaps, and VanFest-specific promotional purposes.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                No Compensation
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                You acknowledge that any media you upload is provided
                voluntarily, and you will not receive financial compensation or
                royalties for its use.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                No Direct Sales of Uploaded Media
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                VanFest and any other users of this folder will not sell the
                uploaded media directly (e.g., prints, stock photo sales,
                merchandise, etc.). However, it may be used in promotional
                materials related to VanFest.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                Respectful and Positive Use
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Any media used must align with the spirit of community and
                respect. No uploaded media may be used in a way that
                misrepresents, disparages, or negatively portrays VanFest, its
                attendees, sponsors, vendors, or any individuals featured in the
                content.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                Restricted Use for Other Events
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Any media in this folder is NOT to be used to promote other
                events without express permission from VanFest.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                Intellectual Property Protection
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Anyone uploading media to this folder agrees that VanFest has
                the right to claim IP ownership of that media for non-profit
                purposes, solely to protect VanFest&apos;s intellectual
                property. VanFest will NOT claim to be the original owner of any
                media in this folder, except for media taken by and directly for
                VanFest (e.g., VanFest staff, paid photographers, etc.) and will
                only claim IP rights should an IP violation occur (e.g., another
                event owner uses this media to promote a non-VanFest event
                without express written permission). Ultimately, YOU own the
                media you created, and you agree that you will not give
                permission to any other events to use media from a VanFest event
                to promote non-VanFest events.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                Shared Responsibility
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                By uploading media, you confirm that you have the rights to
                share it and that it does not infringe on any third-party
                copyrights, trademarks, or privacy rights.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                Automatic Agreement
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                No formal signature is required. By accessing, uploading, or
                downloading to/from the shared folder, you automatically agree
                to these terms.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-1">
                No Deletion of Data
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                While you&apos;ll have the ability to delete files in this
                folder, please don&apos;t! We&apos;re trusting you all to match
                the level of respect and trust we&apos;re putting out there by
                doing this. All files in this folder are automatically backed up
                elsewhere, and all activity is logged.
              </p>
            </div>
          </div>

          <p className="text-charcoal/70 leading-relaxed mb-10 text-sm">
            If you have any questions or concerns about media usage, please
            contact VanFest organizers before using the Community Media service.
            Thank you for sharing your experiences and helping to grow the
            VanFest community!
          </p>

          {/* ── Brand Use ── */}
          <h2 className="font-display font-bold text-2xl mb-6">Brand Use</h2>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            If you wish to use VanFest logos/media/etc, please contact us at{" "}
            <a
              href="mailto:media@vanfestusa.com"
              className="text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              media@vanfestusa.com
            </a>{" "}
            ahead of time. We&apos;re always happy to collaborate, but just hit
            us up ahead of time if you&apos;re wanting to directly utilize our
            logos or brand.
          </p>

          {/* ── Cancellations, Credits, Transfers, and Refunds ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Cancellations, Credits, Transfers, and Refunds
          </h2>

          <div className="bg-sand rounded-2xl p-6 mb-8">
            <h3 className="font-display font-bold text-lg text-teal-dark mb-3">
              Please Note
            </h3>
            <p className="text-charcoal/70 text-sm leading-relaxed">
              We&apos;re a small, bootstrapped event and believe it or not,{" "}
              <strong>we&apos;re not swimming in cash here</strong>. The costs
              for each event are paid from the tickets sold{" "}
              <em>for that event</em>, and generally speaking each event is not
              very deeply &ldquo;in the green&rdquo; if you know what I mean
              (and some have even resulted in out-of-pocket losses). Because of
              this we kindly ask that you{" "}
              <strong>strongly consider</strong> a future credit to any future
              VanFest event in lieu of a refund. Thanks!
            </p>
          </div>

          {/* Credits */}
          <h3 className="font-display font-bold text-lg text-charcoal mb-3">
            Cancellations / Credits
          </h3>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            VanFest tickets are fully cancellable for a full credit to any
            future VanFest event at any time. Simply fill out the Cancellation
            Request Form and we&apos;ll get back to you via email within one
            week. If you&apos;re submitting this request within 30 days of an
            event it may take us an additional two weeks past the end of the
            event, simply because we&apos;re swamped at the moment.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            Cancellations for future credit are <strong>always</strong>{" "}
            approved.
          </p>

          {/* Transfers */}
          <h3 className="font-display font-bold text-lg text-charcoal mb-3">
            Cancellations / Transfers
          </h3>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            Tickets are transferable between individuals, as well as
            exchangeable for another VanFest event. If you are unable to attend
            the event you purchased a ticket to, you may transfer your ticket to
            another individual by notifying us through the Cancellation Request
            Form. Note that additional purchases such as merchandise, accessory
            event attendance, or other add-ons are eligible for transfer,
            however in the case of merchandise the size ordered may not be
            applicable for the transferee. In these cases VanFest will make
            every effort to get the transferee merchandise in the correct size,
            however no guarantees are made.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            Add-ons such as accessory event attendance that required an
            additional cost are transferrable. In the case that an accessory
            event is not desired by the transferee and the request for transfer
            is made within 30 days of the start of the event, the cost of that
            accessory event is not refundable.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-8">
            Transfer requests are <strong>always</strong> approved.
          </p>

          {/* Refunds */}
          <h3 className="font-display font-bold text-lg text-charcoal mb-3">
            Cancellations / Refunds
          </h3>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            VanFest tickets are cancellable and fully refundable within 48 hours
            of the initial purchase. To request a cancellation within this
            period, please complete the Cancellation Request Form.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            After the 48-hour window has passed, tickets become non-refundable
            for any reason unless VanFest cancels the event due to actions or
            decisions directly attributable to VanFest. In cases where the event
            is canceled due to circumstances beyond our control, such as natural
            disasters, government restrictions, venue-related issues, and/or
            other such circumstances you will be given the option of a full
            refund (less processing costs/fees) or a credit to any future
            VanFest event.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            Note that VanFest events are rain or shine events, and unless
            &ldquo;bad weather&rdquo; includes NOAA-level warnings then VanFest
            is ON!
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            If you experience an extenuating circumstance (e.g., serious
            illness, family emergency, etc.) that prevents you from attending
            VanFest and wish to request a cancellation with refund, please fill
            out the Cancellation Request Form. Please note that travel plan
            changes are NOT an extenuating circumstance &mdash; this includes
            (but is not limited to) poor planning, unexpected travel delays,
            getting called into work, etc. Each request will be reviewed
            individually, and approval is at the sole discretion of VanFest.
            Approved cancellations will be refunded the total amount paid, minus
            any processing costs/fees. If a cancellation request is approved,
            please allow 10 to 15 business days for the refund to be processed
            and appear via your original payment method.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            We strive to be as flexible as possible when genuine extenuating
            circumstances arise. However, to ensure fairness and
            sustainability, we ask that this refund policy is not misused.
            Refunds granted due to extenuating circumstances are intended as a
            courtesy for rare, unavoidable situations &mdash; not as an ongoing
            option. Individuals who submit multiple refund requests over time
            may no longer be eligible for future refunds.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            Our goal is to support our attendees while ensuring VanFest can
            continue operating sustainably. We appreciate your honesty and
            understanding.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            If approved, cancellation requests submitted within 30 days of the
            event&apos;s start date are only eligible for a partial refund of
            50% of the total amount paid, minus any processing costs/fees.
            Add-ons will not be refunded for approved refunds within 30 days of
            the event&apos;s start date.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-4 text-sm">
            &ldquo;Add-ons&rdquo; are herein defined as including (but not
            limited to) merchandise purchases, accessory event attendance
            packages, VIP upgrades, and any other additional services or
            products purchased alongside your ticket.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            After submitting your cancellation request, you will receive an
            email confirmation acknowledging receipt. Once a decision has been
            made, you will be notified via email regarding the approval or
            denial of your refund. All decisions are final. Please give up to{" "}
            <strong>two weeks from submission</strong> to receive a response,{" "}
            <em>especially</em> if you submit this form within a week of an
            event.
          </p>

          {/* ── Accessibility ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Accessibility
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            VanFest is committed to providing a welcoming and accessible event
            for all attendees. If you require accommodations due to a
            disability, please{" "}
            <a
              href="mailto:hello@vanfestusa.com"
              className="text-teal hover:text-teal-dark font-semibold transition-colors"
            >
              contact the event organizers
            </a>{" "}
            IN ADVANCE to discuss your needs and make appropriate arrangements.
            Failure to do so on your part will result in an environment that may
            not be conducive to your needs, and VanFest shall not be responsible
            for failing to provide accessible accommodations if no advance
            notice was given at least thirty (30) days prior to the event.
          </p>

          {/* ── No Liability ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            No Liability
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-4">
            You acknowledge that VanFest, its organizers, sponsors, staff, and
            volunteers (collectively &ldquo;VanFest&rdquo;) shall not be held
            liable for any loss, injury, or damage to persons or property
            occurring during the VanFest event. This includes, but is not
            limited to, accidents, theft, or other incidents that may occur on
            the event grounds or during your travels to or from the event.
          </p>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            You agree to indemnify and hold harmless VanFest from any claims,
            damages, or expenses, including reasonable attorneys&apos; fees,
            arising out of or in connection with your attendance.
          </p>

          {/* ── COVID-19 ── */}
          <h2 className="font-display font-bold text-2xl mb-6">COVID-19</h2>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            While it seems that the pandemic days are behind us, COVID is still
            a part of our lives. By purchasing a ticket you agree that you will
            not attend the event in the case where you are displaying COVID
            symptoms and/or symptoms that may pose a risk of infection to
            others. You agree to practice hand washing and other routine
            cleanliness during the event, and you also agree to respect the
            wishes of others when it comes to COVID precautions.
          </p>

          {/* ── Smoking ── */}
          <h2 className="font-display font-bold text-2xl mb-6">Smoking</h2>

          <p className="text-charcoal/70 leading-relaxed mb-10">
            VanFest is a tobacco-free event. Period. End of story. For the
            health and safety of everyone, VanFest events are
            tobacco-smoke-free. If you must consume tobacco products, it needs
            to be smokeless (vape, dip, etc.). If you use a vaporizer, please do
            so politely. If you&apos;re found smoking tobacco inside the venue,
            you&apos;ll be asked to immediately stop; failure to do so will
            result in you being removed from the event. If you wish to smoke
            tobacco, please exit the venue on foot to do so, and please try to
            remain downwind. Each state has varying laws on other smokable plant
            materials, and we ask that you consume responsibly. You are
            responsible for adhering to local/state law. Please also be
            respectful of those with children or people who are not fans of such
            things.
          </p>

          {/* ── What Isn't Allowed ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            What isn&apos;t allowed?
          </h2>

          <p className="text-charcoal/70 leading-relaxed mb-6">
            This is <strong>not</strong> a comprehensive list &mdash; use your
            best judgment. We have the right to, at our discretion, amend, add,
            or remove anything from the list below. By attending, you agree to
            this.
          </p>

          <ul className="space-y-3 text-charcoal/70 text-sm mb-10">
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Discriminative or divisive symbols, and inappropriate imagery
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
              Drones (unless operated by our licensed &amp; insured media
              partners)
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Aggressive or disruptive behavior
            </li>
            <li className="flex gap-2">
              <span className="text-red-500 font-bold">&times;</span>
              Excessive noise during quiet hours (11pm &ndash; 7am)
            </li>
          </ul>

          {/* ── Vendors and Sponsors ── */}
          <h2 className="font-display font-bold text-2xl mb-6">
            Vendors and Sponsors
          </h2>

          <div className="space-y-6 mb-10">
            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Payment
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                You agree to pay the full agreed upon amount associated with
                your selected Vendor/Sponsor package within 5 business days of
                signing this agreement. Payment must be made via a digital
                invoice sent by VanFest.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Benefits and Responsibilities
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                You will receive the benefits outlined in your selected package.
                You are responsible for providing any necessary materials for
                marketing purposes, including logos, artwork, banners, signs,
                and promotional materials, in the format and by the deadlines
                set by VanFest.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                No Guarantees
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                There are no guarantees of sales, leads, or any other specific
                results. You acknowledge that your participation is at your own
                risk, and VanFest does not guarantee any level of exposure or
                success.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Cancellation and Refunds
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                If you cancel your participation, no refunds will be provided.
                If VanFest cancels the event, you will be entitled to a 100%
                refund or an equivalent slot at the next event, at your
                discretion.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Compliance
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Both parties agree to comply with all applicable federal, state,
                and local laws, regulations, and ordinances in connection with
                their participation in the event.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Intellectual Property
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Both parties agree to provide a limited license to one another
                for the use of intellectual property for promoting and
                conducting event operations. All usage must be consistent with
                any provided brand guidelines.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Indemnification
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                You agree to indemnify, defend, and hold harmless VanFest, its
                directors, officers, employees, and agents from any and all
                claims, liabilities, damages, expenses, and losses arising out
                of or related to your participation in the event.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Limitation of Liability
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                VanFest&apos;s liability to you is limited to the amount paid by
                you for your Vendor/Sponsor package. VanFest is not liable for
                any indirect, incidental, consequential, or special damages.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Insurance
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                You shall provide VanFest with a certificate of insurance
                confirming General Liability coverage with limits no less than
                $1,000,000 per event / $2,000,000 general aggregate. This must
                be submitted no later than one (1) month before the event.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Force Majeure
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Neither party shall be held responsible for any delay or failure
                in performance due to events beyond its reasonable control, such
                as natural disasters or other unforeseen circumstances.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Dispute Resolution
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Any disputes shall be resolved through good faith negotiations
                or binding arbitration in accordance with the rules of the
                American Arbitration Association.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Governing Law
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                This agreement is governed by the laws of the state where the
                event is held.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Non-disparagement
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                Neither party will disparage or criticize the other party or its
                business affairs after the agreement is signed.
              </p>
            </div>

            <div>
              <h3 className="font-display font-bold text-lg text-charcoal mb-2">
                Entire Agreement
              </h3>
              <p className="text-charcoal/70 text-sm leading-relaxed">
                These Terms represent the entire understanding between both
                parties and supersede any previous agreements. Amendments
                require a written agreement by both parties.
              </p>
            </div>
          </div>

          {/* ── Our Commitment ── */}
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
            <p className="mb-2">
              VanFest is a nomadic event series brand run by Ever Onward LLC, a
              Massachusetts-based Limited Liability Company.
            </p>
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
