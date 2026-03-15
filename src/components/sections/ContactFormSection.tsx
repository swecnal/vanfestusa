"use client";

import { useState } from "react";
import type { ContactFormData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function ContactFormSection({ data, settings }: Props) {
  const d = data as unknown as ContactFormData;
  const formHeadingStyle = (data as Record<string, unknown>).formHeadingStyle as TextStyleConfig | undefined;
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [humanChecked, setHumanChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!humanChecked) return;
    const mailto = `mailto:${d.recipientEmail}?subject=${encodeURIComponent(formState.subject)}&body=${encodeURIComponent(`From: ${formState.name} (${formState.email})\n\n${formState.message}`)}`;
    window.location.href = mailto;
  };

  return (
    <section style={sectionSpacingStyles(settings)} className={`px-4 bg-white ${settings.customClasses || ""}`}>
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"}`}>
        {d.contactCards && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {d.contactCards.map((card, i) => (
              <a
                key={i}
                href={card.href}
                className="bg-sand rounded-xl p-6 text-center hover:bg-teal/10 transition-colors group"
              >
                <h3 className="font-display font-bold text-lg text-charcoal group-hover:text-teal transition-colors">
                  {card.title}
                </h3>
                <p className="text-charcoal/60 text-sm mt-1">{card.value}</p>
              </a>
            ))}
          </div>
        )}
        {d.formHeading && (
          <h3 className="font-display font-bold text-2xl text-charcoal mb-6 text-center" style={formHeadingStyle ? textStyleConfigToCSS(formHeadingStyle) : undefined} dangerouslySetInnerHTML={{ __html: d.formHeading || "" }} />
        )}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="px-4 py-3 border border-charcoal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal text-sm"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="px-4 py-3 border border-charcoal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal text-sm"
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            required
            value={formState.subject}
            onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
            className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal text-sm"
          />
          <textarea
            placeholder="Your Message"
            required
            rows={5}
            value={formState.message}
            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
            className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal text-sm resize-none"
          />
          <label className="flex items-center gap-2 text-sm text-charcoal/70">
            <input
              type="checkbox"
              checked={humanChecked}
              onChange={(e) => setHumanChecked(e.target.checked)}
              className="rounded border-charcoal/30"
            />
            I am a human
          </label>
          <button
            type="submit"
            disabled={!humanChecked}
            className="w-full bg-teal hover:bg-teal-dark text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
