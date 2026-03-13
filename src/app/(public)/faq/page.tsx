"use client";

import SectionHeading from "@/components/SectionHeading";
import { useState, useRef } from "react";
import { faqs } from "@/data/faqs";

export default function FAQPage() {
  const [allOpen, setAllOpen] = useState(false);
  const detailsRefs = useRef<(HTMLDetailsElement | null)[]>([]);

  const toggleAll = () => {
    const newState = !allOpen;
    setAllOpen(newState);
    detailsRefs.current.forEach((el) => {
      if (el) el.open = newState;
    });
  };

  return (
    <>
      <section className="relative pt-32 pb-20 px-4 bg-charcoal overflow-hidden">
        <img
          src="/images/image109.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative mx-auto max-w-6xl">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about VanFest."
            light
          />
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="flex justify-end mb-6">
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 text-sm font-semibold text-teal hover:text-teal-dark transition-colors"
            >
              <svg
                className={`w-4 h-4 transition-transform ${allOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {allOpen ? "Collapse All" : "Expand All"}
            </button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                ref={(el) => { detailsRefs.current[i] = el; }}
                className="group bg-sand rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-6 font-display font-semibold text-charcoal hover:text-teal transition-colors list-none">
                  <span>{faq.q}</span>
                  <svg
                    className="w-5 h-5 text-teal flex-shrink-0 ml-4 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-charcoal/70 leading-relaxed text-sm">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
