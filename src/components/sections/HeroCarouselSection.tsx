import HeroCarousel from "@/components/HeroCarousel";
import type { HeroCarouselData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function HeroCarouselSection({ data }: Props) {
  const d = data as unknown as HeroCarouselData;
  return (
    <HeroCarousel
      slides={d.slides || []}
      overlay={d.overlay || { eventName: "Event" }}
      autoplayInterval={d.autoplayInterval}
    />
  );
}
