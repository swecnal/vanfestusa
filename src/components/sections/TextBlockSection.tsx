import type { TextBlockData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles, sectionBgClass } from "@/lib/types";
import type { SiteStyles } from "@/lib/styles";
import { resolveButtonStylesInHtml, EMPTY_SITE_STYLES } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

export default function TextBlockSection({ data, settings, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as TextBlockData;
  const columns = d.columns || [];
  const isColumns = d.layout === "columns" && columns.length > 0;

  const alignClass =
    d.alignment === "center"
      ? "text-center"
      : d.alignment === "right"
        ? "text-right"
        : "text-left";

  const proseClass = d.prose ? "prose prose-lg max-w-none" : "";

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${sectionBgClass(settings)} ${settings.customClasses || ""}`}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-4xl"} ${alignClass}`}>
        {isColumns ? (
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
              gap: d.columnGap || "2rem",
            }}
          >
            {columns.map((col, i) => (
              <div
                key={i}
                className={`site-html-content ${proseClass}`}
                dangerouslySetInnerHTML={{ __html: resolveButtonStylesInHtml(col.html, siteStyles) }}
              />
            ))}
          </div>
        ) : (
          <div
            className={`site-html-content ${proseClass}`}
            dangerouslySetInnerHTML={{ __html: resolveButtonStylesInHtml(d.html, siteStyles) }}
          />
        )}
      </div>
    </section>
  );
}
