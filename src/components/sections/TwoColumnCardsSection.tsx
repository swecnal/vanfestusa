import SectionHeading from "@/components/SectionHeading";
import type { TwoColumnCardsData, SectionSettings } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES, findButtonStyle, buttonStyleToCSS, textStyleConfigToCSS } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export default function TwoColumnCardsSection({ data, settings, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as TwoColumnCardsData;
  const cols = d.columns || 2;

  return (
    <section className={`${settings.paddingY || "py-20"} px-4 ${settings.bgColor === "sand" ? "bg-sand" : "bg-white"} ${settings.customClasses || ""}`}>
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"} text-center`}>
        {d.heading && <SectionHeading title={d.heading} subtitle={d.headingSubtitle} />}
        <div className={`grid ${GRID_COLS[cols] || GRID_COLS[2]} gap-6 text-left`}>
          {d.cards.map((card, i) => {
            const isBackground = card.imagePosition === "background";
            const isSmall = card.imagePosition?.startsWith("small-");

            return (
              <div
                key={i}
                className={`${card.bgColor || "bg-sand"} rounded-2xl overflow-hidden ${isBackground ? "relative" : ""}`}
              >
                {/* Background image */}
                {card.image && isBackground && (
                  <>
                    <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                  </>
                )}

                {/* Full-width top image */}
                {card.image && (card.imagePosition === "full-width" || (!card.imagePosition && !isBackground && !isSmall)) && (
                  <img src={card.image} alt="" className="w-full h-48 object-cover" />
                )}

                {/* Small center image */}
                {card.image && card.imagePosition === "small-center" && (
                  <div className="flex justify-center pt-6">
                    <img src={card.image} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  </div>
                )}

                <div className={`p-6 ${isBackground ? "relative z-10" : ""} ${isSmall && card.imagePosition !== "small-center" ? "flex gap-4" : ""}`}>
                  {/* Small left image */}
                  {card.image && card.imagePosition === "small-left" && (
                    <img src={card.image} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}

                  <div className="flex-1">
                    <h3
                      className={`font-display font-bold text-xl mb-2 ${isBackground ? "text-white" : "text-teal-dark"}`}
                      style={textStyleConfigToCSS(card.titleStyle || {})}
                    >
                      {card.title}
                    </h3>
                    {card.subtitle && (
                      <p
                        className={`text-xs mb-2 ${isBackground ? "text-white/70" : "text-charcoal/50"}`}
                        style={textStyleConfigToCSS(card.subtitleStyle || {})}
                      >
                        {card.subtitle}
                      </p>
                    )}
                    <div
                      className={`text-sm leading-relaxed site-html-content ${isBackground ? "text-white/80" : "text-charcoal/70"}`}
                      style={textStyleConfigToCSS(card.bodyStyle || {})}
                      dangerouslySetInnerHTML={{ __html: card.body }}
                    />
                    {card.button?.text && card.button?.href && (() => {
                      const btnStyle = card.button!.styleId
                        ? findButtonStyle(card.button!.styleId, siteStyles)
                        : null;
                      return (
                        <a
                          href={card.button!.href}
                          target={card.button!.external ? "_blank" : undefined}
                          rel={card.button!.external ? "noopener noreferrer" : undefined}
                          className={btnStyle ? "inline-block mt-4 transition-all hover:scale-105" : "inline-block mt-4 bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-2 rounded-lg text-sm transition-colors"}
                          style={btnStyle ? buttonStyleToCSS(btnStyle) : undefined}
                        >
                          {card.button!.text}
                        </a>
                      );
                    })()}
                  </div>

                  {/* Small right image */}
                  {card.image && card.imagePosition === "small-right" && (
                    <img src={card.image} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
