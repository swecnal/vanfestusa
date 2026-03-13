import SectionHeading from "@/components/SectionHeading";
import type { FeatureGridData, SectionSettings } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES, findButtonStyle, buttonStyleToCSS, textStyleConfigToCSS } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function FeatureGridSection({ data, settings, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as FeatureGridData;
  const isLight = d.heading?.light || settings.bgColor === "charcoal";
  const cols = d.columns || 3;

  return (
    <section
      className={`${settings.paddingY || "py-20"} px-4 ${
        isLight ? "bg-charcoal" : "bg-white"
      } ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-6xl"}`}>
        {d.heading && (
          <SectionHeading
            title={d.heading.title}
            subtitle={d.heading.subtitle}
            light={d.heading.light}
          />
        )}
        <div className={`grid ${GRID_COLS[cols] || GRID_COLS[3]} gap-6`}>
          {d.items.map((item, i) => (
            <div
              key={i}
              className={`${
                isLight
                  ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                  : "bg-sand hover:bg-teal/10 border border-transparent hover:border-teal/20"
              } rounded-2xl p-6 transition-colors group`}
            >
              {item.iconImage ? (
                <div className="mb-4 group-hover:scale-110 transition-transform">
                  <img src={item.iconImage} alt="" className="w-12 h-12 object-contain" />
                </div>
              ) : item.iconSvg ? (
                <div
                  className="text-teal mb-4 group-hover:scale-110 transition-transform"
                  dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                />
              ) : null}
              <h3
                className={`font-display font-bold text-lg mb-2 ${
                  isLight ? "text-white" : "text-charcoal"
                }`}
                style={textStyleConfigToCSS(item.titleStyle || {})}
              >
                {item.title}
              </h3>
              {item.subtitle && (
                <p
                  className={`text-sm mb-2 ${isLight ? "text-white/50" : "text-charcoal/50"}`}
                  style={textStyleConfigToCSS(item.subtitleStyle || {})}
                >
                  {item.subtitle}
                </p>
              )}
              <p
                className={`text-sm leading-relaxed ${
                  isLight ? "text-white/60" : "text-charcoal/60"
                }`}
                style={textStyleConfigToCSS(item.descriptionStyle || {})}
              >
                {item.description}
              </p>
              {item.action?.text && item.action?.href && (() => {
                const isBtn = item.action!.type === "button";
                const btnStyle = isBtn && item.action!.styleId
                  ? findButtonStyle(item.action!.styleId, siteStyles)
                  : null;
                if (isBtn) {
                  return (
                    <a
                      href={item.action!.href}
                      target={item.action!.external ? "_blank" : undefined}
                      rel={item.action!.external ? "noopener noreferrer" : undefined}
                      className={btnStyle ? "inline-block mt-4 transition-all hover:scale-105" : "inline-block mt-4 bg-teal hover:bg-teal-dark text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"}
                      style={btnStyle ? buttonStyleToCSS(btnStyle) : undefined}
                    >
                      {item.action!.text}
                    </a>
                  );
                }
                return (
                  <a
                    href={item.action!.href}
                    target={item.action!.external ? "_blank" : undefined}
                    rel={item.action!.external ? "noopener noreferrer" : undefined}
                    className="inline-block mt-3 text-teal hover:text-teal-dark text-sm font-semibold transition-colors"
                  >
                    {item.action!.text} &rarr;
                  </a>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
