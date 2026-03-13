"use client";

import SectionHeading from "@/components/SectionHeading";
import { useState, useRef, FormEvent } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [humanChecked, setHumanChecked] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [challengeError, setChallengeError] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formStartTime = useRef(Date.now());
  const interactionCount = useRef(0);

  // Simple challenge numbers
  const [challengeA] = useState(() => Math.floor(Math.random() * 5) + 1);
  const [challengeB] = useState(() => Math.floor(Math.random() * 5) + 1);

  const trackInteraction = () => {
    interactionCount.current++;
  };

  const handleHumanCheck = () => {
    const elapsed = Date.now() - formStartTime.current;
    const isSuspicious =
      elapsed < 2000 || // filled form in under 2 seconds
      interactionCount.current < 2; // barely interacted

    if (isSuspicious && !humanChecked) {
      setShowChallenge(true);
    } else {
      setHumanChecked(!humanChecked);
      setShowChallenge(false);
    }
  };

  const handleChallengeSubmit = () => {
    if (parseInt(challengeAnswer) === challengeA + challengeB) {
      setHumanChecked(true);
      setShowChallenge(false);
      setChallengeError(false);
    } else {
      setChallengeError(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypotRef.current?.value) return; // bot trap
    if (!humanChecked) return;

    setFormState("sending");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    // For now, open mailto with the form data
    const mailtoLink = `mailto:hello@vanfestusa.com?subject=${encodeURIComponent(
      String(data.subject || "Website Contact")
    )}&body=${encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
    )}`;
    window.location.href = mailtoLink;
    setFormState("sent");
  };

  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image34.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative mx-auto max-w-6xl">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <a
              href="mailto:hello@vanfestusa.com"
              className="bg-sand hover:bg-teal/10 rounded-2xl p-8 text-center transition-colors group border border-transparent hover:border-teal/20"
            >
              <div className="w-14 h-14 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal/20 transition-colors">
                <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
                <svg className="w-6 h-6 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-lg mb-1">Call Us</h3>
              <p className="text-teal font-semibold">805.826.3378</p>
            </a>
          </div>

          {/* Contact Form */}
          <div className="bg-sand rounded-3xl p-8 md:p-10">
            <h2 className="font-display font-bold text-2xl mb-6 text-center">
              Send Us a Message
            </h2>

            {formState === "sent" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-charcoal/70 text-lg">
                  Your email client should have opened. If not, email us directly at{" "}
                  <a href="mailto:hello@vanfestusa.com" className="text-teal font-semibold">
                    hello@vanfestusa.com
                  </a>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot - hidden from humans */}
                <div className="absolute -left-[9999px]" aria-hidden="true">
                  <input
                    ref={honeypotRef}
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-1.5">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      onFocus={trackInteraction}
                      className="w-full px-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-1.5">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      onFocus={trackInteraction}
                      className="w-full px-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-charcoal mb-1.5">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    onFocus={trackInteraction}
                    className="w-full px-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors text-sm"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    onFocus={trackInteraction}
                    className="w-full px-4 py-3 rounded-xl border border-charcoal/10 bg-white focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none transition-colors text-sm resize-y"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                {/* Human verification checkbox */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={handleHumanCheck}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        humanChecked
                          ? "bg-teal border-teal"
                          : "border-charcoal/30 group-hover:border-teal/50"
                      }`}
                    >
                      {humanChecked && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-charcoal/70">
                      I&apos;m a real human, not a robot
                    </span>
                  </label>

                  {showChallenge && (
                    <div className="bg-white rounded-xl p-4 border border-teal/20 space-y-3">
                      <p className="text-sm text-charcoal/70">
                        Quick check: What is{" "}
                        <span className="font-bold text-charcoal">{challengeA} + {challengeB}</span>?
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={challengeAnswer}
                          onChange={(e) => setChallengeAnswer(e.target.value)}
                          className="w-20 px-3 py-2 rounded-lg border border-charcoal/10 text-sm text-center focus:border-teal focus:ring-2 focus:ring-teal/20 outline-none"
                          placeholder="?"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleChallengeSubmit())}
                        />
                        <button
                          type="button"
                          onClick={handleChallengeSubmit}
                          className="px-4 py-2 bg-teal text-white text-sm rounded-lg hover:bg-teal-dark transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                      {challengeError && (
                        <p className="text-red-500 text-sm font-semibold">
                          Incorrect! Try again.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!humanChecked || formState === "sending"}
                  className={`w-full py-3.5 rounded-xl font-bold text-white transition-all ${
                    humanChecked
                      ? "bg-teal hover:bg-teal-dark shadow-lg hover:shadow-xl"
                      : "bg-charcoal/20 cursor-not-allowed"
                  }`}
                >
                  {formState === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
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
