import type { TextBlockData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function TextBlockSection({ data, settings }: Props) {
  const d = data as unknown as TextBlockData;

  return (
    <section
      className={`${settings.paddingY || "py-16"} px-4 ${
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
          dangerouslySetInnerHTML={{ __html: d.html }}
        />
      </div>
    </section>
  );
}
