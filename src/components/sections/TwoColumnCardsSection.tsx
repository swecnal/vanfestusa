import SectionHeading from "@/components/SectionHeading";
import type { TwoColumnCardsData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function TwoColumnCardsSection({ data, settings }: Props) {
  const d = data as unknown as TwoColumnCardsData;

  return (
    <section className={`${settings.paddingY || "py-20"} px-4 ${settings.bgColor === "sand" ? "bg-sand" : "bg-white"} ${settings.customClasses || ""}`}>
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"} text-center`}>
        {d.heading && <SectionHeading title={d.heading} subtitle={d.headingSubtitle} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {d.cards.map((card, i) => (
            <div key={i} className={`${card.bgColor || "bg-sand"} rounded-2xl p-6`}>
              <h3 className="font-display font-bold text-xl mb-2 text-teal-dark">
                {card.title}
              </h3>
              {card.subtitle && (
                <p className="text-charcoal/50 text-xs mb-2">{card.subtitle}</p>
              )}
              <div
                className="text-charcoal/70 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: card.body }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
