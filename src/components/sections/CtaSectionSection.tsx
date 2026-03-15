import Link from "next/link";
import type { CtaSectionData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES, findButtonStyle, buttonStyleToCSS } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

export default function CtaSectionSection({ data, settings, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as CtaSectionData;
  const isLight = d.light || settings.bgColor === "charcoal";

  const getButtonProps = (btn: CtaSectionData["buttons"][number]) => {
    const btnData = btn as CtaSectionData["buttons"][number] & { styleId?: string };
    if (btnData.styleId) {
      const resolved = findButtonStyle(btnData.styleId, siteStyles);
      if (resolved) {
        return {
          className: "transition-all",
          style: buttonStyleToCSS(resolved),
        };
      }
    }
    // Fallback to variant-based classes
    return {
      className:
        btn.variant === "primary"
          ? "bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors"
          : btn.variant === "outline"
            ? "border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3 rounded-xl transition-colors hover:bg-white/10"
            : "bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-xl transition-colors",
      style: undefined as React.CSSProperties | undefined,
    };
  };

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${
        d.bgColor
          ? `bg-[${d.bgColor}]`
          : isLight
            ? "bg-charcoal"
            : "bg-white"
      } ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"} text-center`}>
        <h2
          className={`font-display font-black text-3xl md:text-4xl mb-4 ${
            isLight ? "text-white" : "text-charcoal"
          }`}
        >
          {d.title}
        </h2>
        {d.subtitle && (
          <p
            className={`text-lg mb-8 ${
              isLight ? "text-white/70" : "text-charcoal/60"
            }`}
          >
            {d.subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {d.buttons.map((btn, i) => {
            const props = getButtonProps(btn);
            return (
              <Link
                key={i}
                href={btn.href}
                target={btn.external ? "_blank" : undefined}
                rel={btn.external ? "noopener noreferrer" : undefined}
                className={props.className}
                style={props.style}
              >
                {btn.text}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
