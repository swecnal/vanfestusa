import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import type { CtaCardsData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles, sectionBgClass } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function CtaCardsSection({ data, settings }: Props) {
  const d = data as unknown as CtaCardsData;
  const headingStyle = (data as Record<string, unknown>).headingStyle as TextStyleConfig | undefined;
  const cols = d.columns || 3;
  const cards = d.cards || [];

  const gridClass =
    cols === 1
      ? "grid grid-cols-1"
      : cols === 2
        ? "grid grid-cols-1 sm:grid-cols-2"
        : "grid grid-cols-1 sm:grid-cols-3";

  const gridStyle: React.CSSProperties =
    cols === 1
      ? { maxWidth: d.singleCardMaxWidth || "32rem", marginLeft: "auto", marginRight: "auto" }
      : {};

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${sectionBgClass(settings)} ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"} text-center`}>
        {d.heading && (
          <SectionHeading title={d.heading.title} subtitle={d.heading.subtitle} titleStyle={headingStyle ? textStyleConfigToCSS(headingStyle) : undefined} />
        )}
        <div className={`${gridClass} gap-6`} style={gridStyle}>
          {cards.map((card, i) => (
            <Link
              key={i}
              href={card.href}
              className="group bg-sand hover:bg-teal/10 rounded-2xl p-6 transition-colors border border-transparent hover:border-teal/20"
            >
              <h3 className="font-display font-bold text-lg mb-2 group-hover:text-teal transition-colors" dangerouslySetInnerHTML={{ __html: card.title || "" }} />
              <div className="text-charcoal/60 text-sm site-html-content" dangerouslySetInnerHTML={{ __html: card.description || "" }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
