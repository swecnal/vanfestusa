import SectionHeading from "@/components/SectionHeading";
import BuildsCarousel from "@/components/BuildsCarousel";
import Link from "next/link";
import type { ImageCarouselData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function ImageCarouselSection({ data, settings }: Props) {
  const d = data as unknown as ImageCarouselData;
  const isLight = d.heading?.light || settings.bgColor === "charcoal";

  return (
    <section
      className={`relative ${settings.paddingY || "py-20"} px-4 ${
        isLight ? "bg-charcoal" : "bg-white"
      } overflow-hidden ${settings.customClasses || ""}`}
    >
      {settings.bgImage && (
        <img
          src={settings.bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: settings.bgImageOpacity ?? 0.15 }}
        />
      )}
      <div className={`relative mx-auto ${settings.maxWidth || "max-w-6xl"}`}>
        {d.heading && (
          <SectionHeading
            title={d.heading.title}
            subtitle={d.heading.subtitle}
            light={d.heading.light}
          />
        )}
        <div className="mb-10">
          <BuildsCarousel />
        </div>
        {d.ctaButtons && d.ctaButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {d.ctaButtons.map((btn, i) => (
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
