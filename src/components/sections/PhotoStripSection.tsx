import type { PhotoStripData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles, sectionBgClass } from "@/lib/types";
import CroppedImage from "@/components/CroppedImage";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function PhotoStripSection({ data, settings }: Props) {
  const d = data as unknown as PhotoStripData;
  const cols = d.columns || d.images.length || 4;

  return (
    <section style={sectionSpacingStyles(settings)} className={`${sectionBgClass(settings)} ${settings.customClasses || ""}`}>
      <div
        className="grid gap-0"
        style={{ gridTemplateColumns: `repeat(${Math.min(cols, 6)}, 1fr)` }}
      >
        {d.images.map((img, i) => (
          <div key={i} className="overflow-hidden" style={{ height: d.height || "200px" }}>
            <CroppedImage
              src={img.src}
              alt={img.alt || ""}
              crop={img.crop}
              imageFit={img.imageFit}
              className="w-full h-full object-cover"
              fallbackObjectPosition={img.position || "center"}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
