import SectionHeading from "@/components/SectionHeading";
import BuildsCarousel from "@/components/BuildsCarousel";
import Link from "next/link";
import type { SectionSettings } from "@/lib/types";
import { sectionSpacingStyles, sectionBgClass } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function ImageCarouselSection({ data, settings }: Props) {
  const d = data as Record<string, unknown>;
  const headingStyleConfig = d.headingStyle as TextStyleConfig | undefined;
  const subheadingStyleConfig = d.subheadingStyle as TextStyleConfig | undefined;

  // heading can be a string or an object { title, subtitle, light }
  const heading = typeof d.heading === "string"
    ? { title: d.heading, subtitle: d.subheading as string | undefined, light: true }
    : (d.heading as { title: string; subtitle?: string; light?: boolean } | undefined);

  const images = (d.images as Array<{ src: string; alt: string }>) || [];
  const ctaButtons = (d.ctaButtons as Array<{ text: string; href: string; variant: string; external?: boolean }>) || [];
  const autoplayInterval = d.autoplayInterval as number | undefined;
  const bgImage = (d.bgImage as string) || settings.bgImage;
  const isLight = heading?.light || settings.bgColor === "charcoal" || !!bgImage;

  return (
    <section
      style={sectionSpacingStyles(settings)}
      className={`relative px-4 ${sectionBgClass(settings)} overflow-hidden ${settings.customClasses || ""}`}
    >
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: settings.bgImageOpacity ?? 0.15 }}
        />
      )}
      <div className={`relative mx-auto ${settings.maxWidth || "max-w-6xl"}`}>
        {heading && (
          <SectionHeading
            title={heading.title}
            subtitle={heading.subtitle}
            light={heading.light}
            titleStyle={headingStyleConfig ? textStyleConfigToCSS(headingStyleConfig) : undefined}
            subtitleStyle={subheadingStyleConfig ? textStyleConfigToCSS(subheadingStyleConfig) : undefined}
          />
        )}
        <div className="mb-10">
          <BuildsCarousel
            images={images}
            autoplayInterval={autoplayInterval}
          />
        </div>
        {ctaButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {ctaButtons.map((btn, i) => (
              <Link
                key={i}
                href={btn.href}
                target={btn.external ? "_blank" : undefined}
                rel={btn.external ? "noopener noreferrer" : undefined}
                className={
                  btn.variant === "primary"
                    ? "bg-teal hover:bg-teal-dark text-white font-bold px-8 py-3 rounded-xl transition-colors text-center"
                    : "border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3 rounded-xl transition-colors hover:bg-white/10 text-center"
                }
              >
                {btn.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
