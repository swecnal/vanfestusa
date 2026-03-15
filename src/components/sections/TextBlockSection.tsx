import type { TextBlockData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";
import type { SiteStyles } from "@/lib/styles";
import { resolveButtonStylesInHtml, EMPTY_SITE_STYLES } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

export default function TextBlockSection({ data, settings, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as TextBlockData;
  const resolvedHtml = resolveButtonStylesInHtml(d.html, siteStyles);

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${
        settings.bgColor === "charcoal"
          ? "bg-charcoal text-white"
          : settings.bgColor === "sand"
            ? "bg-sand"
            : "bg-white"
      } ${settings.customClasses || ""}`}
    >
      <div
        className={`mx-auto ${settings.maxWidth || "max-w-4xl"} ${
          d.alignment === "center"
            ? "text-center"
            : d.alignment === "right"
              ? "text-right"
              : "text-left"
        }`}
      >
        <div
          className={`site-html-content ${d.prose ? "prose prose-lg max-w-none" : ""}`}
          dangerouslySetInnerHTML={{ __html: resolvedHtml }}
        />
      </div>
    </section>
  );
}
