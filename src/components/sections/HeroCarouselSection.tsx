import HeroCarousel from "@/components/HeroCarousel";
import type { SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function HeroCarouselSection({ data }: Props) {
  // HeroCarousel currently uses hardcoded data.
  // Pass data through as props when HeroCarousel is refactored.
  // For now, render the existing component.
  return <HeroCarousel />;
}
