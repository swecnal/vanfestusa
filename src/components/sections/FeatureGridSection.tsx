import SectionHeading from "@/components/SectionHeading";
import type { FeatureGridData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function FeatureGridSection({ data, settings }: Props) {
  const d = data as unknown as FeatureGridData;
  const isLight = d.heading?.light || settings.bgColor === "charcoal";

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
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            (d.columns || 3) === 3 ? "lg:grid-cols-3" : ""
          } gap-6`}
        >
          {d.items.map((item, i) => (
            <div
              key={i}
              className={`${
                isLight
                  ? "bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                  : "bg-sand hover:bg-teal/10 border border-transparent hover:border-teal/20"
              } rounded-2xl p-6 transition-colors group`}
            >
              {item.iconSvg && (
                <div
                  className="text-teal mb-4 group-hover:scale-110 transition-transform"
                  dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                />
              )}
              <h3
                className={`font-display font-bold text-lg mb-2 ${
                  isLight ? "text-white" : "text-charcoal"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isLight ? "text-white/60" : "text-charcoal/60"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
