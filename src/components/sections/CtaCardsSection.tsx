import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import type { CtaCardsData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function CtaCardsSection({ data, settings }: Props) {
  const d = data as unknown as CtaCardsData;
  const cols = d.columns || 3;

  return (
    <section
      className={`${settings.paddingY || "py-20"} px-4 ${
        settings.bgColor === "charcoal" ? "bg-charcoal" : "bg-white"
      } ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"} text-center`}>
        {d.heading && (
          <SectionHeading title={d.heading.title} subtitle={d.heading.subtitle} />
        )}
        <div
          className={`grid grid-cols-1 ${
            cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
          } gap-6`}
        >
          {d.cards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="group bg-sand hover:bg-teal/10 rounded-2xl p-6 transition-colors border border-transparent hover:border-teal/20"
            >
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-teal transition-colors">
                {card.title}
              </h3>
              <p className="text-charcoal/60 text-sm">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
