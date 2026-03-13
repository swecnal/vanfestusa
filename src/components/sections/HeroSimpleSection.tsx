import SectionHeading from "@/components/SectionHeading";
import type { HeroSimpleData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function HeroSimpleSection({ data, settings }: Props) {
  const d = data as unknown as HeroSimpleData;

  return (
    <section
      className={`relative pt-32 pb-20 px-4 ${
        d.light ? "bg-charcoal" : "bg-white"
      } ${settings.customClasses || ""}`}
    >
      {d.bgImage && (
        <img
          src={d.bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
      )}
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          title={d.title}
          subtitle={d.subtitle}
          light={d.light}
        />
      </div>
    </section>
  );
}
