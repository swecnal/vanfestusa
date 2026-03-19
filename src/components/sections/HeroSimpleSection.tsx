import SectionHeading from "@/components/SectionHeading";
import ParallaxImage from "@/components/ParallaxImage";
import type { ParallaxIntensity } from "@/components/ParallaxImage";
import type { HeroSimpleData, SectionSettings, ImageCrop } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function HeroSimpleSection({ data, settings }: Props) {
  const d = data as unknown as HeroSimpleData;
  const titleStyle = (data as Record<string, unknown>).titleStyle as TextStyleConfig | undefined;
  const subtitleStyle = (data as Record<string, unknown>).subtitleStyle as TextStyleConfig | undefined;
  const parallax = ((data as Record<string, unknown>).parallax as ParallaxIntensity) || "none";

  // When bgConfig has an active background (image/solid/gradient), don't apply
  // the section's own opaque bg — let SectionRenderer's background layer show through
  const hasBgConfig = settings.bgConfig?.type && settings.bgConfig.type !== "none";
  const bgClass = hasBgConfig ? "" : (d.light ? "bg-charcoal" : "bg-white");

  return (
    <section
      className={`relative pt-32 pb-20 px-4 overflow-hidden ${bgClass} ${settings.customClasses || ""}`}
    >
      {d.bgImage && (
        <ParallaxImage
          src={d.bgImage}
          alt=""
          intensity={parallax}
          className="absolute inset-0 w-full h-full object-cover"
          crop={(data as Record<string, unknown>).bgImageCrop as ImageCrop | undefined}
        />
      )}
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          title={d.title}
          subtitle={d.subtitle}
          light={d.light}
          titleStyle={titleStyle ? textStyleConfigToCSS(titleStyle) : undefined}
          subtitleStyle={subtitleStyle ? textStyleConfigToCSS(subtitleStyle) : undefined}
        />
      </div>
    </section>
  );
}
