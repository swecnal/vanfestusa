import HeroCarousel from "@/components/HeroCarousel";
import type { HeroCarouselData, SectionSettings } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";
import type { ParallaxIntensity } from "@/components/ParallaxImage";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
  siteStyles?: SiteStyles;
}

export default function HeroCarouselSection({ data, siteStyles = EMPTY_SITE_STYLES }: Props) {
  const d = data as unknown as HeroCarouselData;
  const parallax = ((data as Record<string, unknown>).parallax as ParallaxIntensity) || "none";
  return (
    <HeroCarousel
      slides={d.slides || []}
      overlay={d.overlay || { eventName: "Event" }}
      autoplayInterval={d.autoplayInterval}
      siteStyles={siteStyles}
      parallax={parallax}
    />
  );
}
