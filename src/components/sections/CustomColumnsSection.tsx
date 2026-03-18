import type { CustomColumnsData, SectionSettings, SectionType } from "@/lib/types";
import { sectionSpacingStyles, sectionBgClass } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";
import SectionRenderer from "./SectionRenderer";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

export default function CustomColumnsSection({ data, settings, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as CustomColumnsData;
  const columnCount = d.columnCount || 2;
  const columnWidths = d.columnWidths || Array(columnCount).fill(`${100 / columnCount}%`);
  const gap = d.gap || "24px";
  const stackOnMobile = d.stackOnMobile !== false;

  const gridTemplateColumns = columnWidths.slice(0, columnCount).join(" ");
  const sectionId = settings.sectionId || `cc-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`px-4 ${sectionBgClass(settings)} ${settings.customClasses || ""}`}
      id={settings.sectionId}
    >
      <div className={`mx-auto ${settings.maxWidth || "max-w-6xl"}`}>
        <div
          id={`columns-grid-${sectionId}`}
          className="columns-grid"
          style={{ display: "grid", gridTemplateColumns, gap }}
        >
          {d.columns?.slice(0, columnCount).map((column, colIdx) => (
            <div key={colIdx} className="min-w-0">
              {column.children?.map((child, childIdx) => (
                <SectionRenderer
                  key={`col-${colIdx}-child-${childIdx}`}
                  section={{
                    id: `columns-child-${colIdx}-${childIdx}`,
                    page_id: "",
                    section_type: child.sectionType as SectionType,
                    data: child.sectionData || {},
                    settings: (child.sectionSettings || {}) as SectionSettings,
                    sort_order: childIdx,
                    is_visible: true,
                    created_at: "",
                    updated_at: "",
                  }}
                  siteStyles={siteStyles}
                />
              ))}
              {(!column.children || column.children.length === 0) && (
                <div className="text-center py-8 text-gray-300 text-xs border border-dashed border-gray-200 rounded-lg">
                  Empty column
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {stackOnMobile && (
        <style>{`
          @media (max-width: 767px) {
            #columns-grid-${sectionId} {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      )}
    </section>
  );
}
