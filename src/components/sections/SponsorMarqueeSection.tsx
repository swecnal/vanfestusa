import SponsorMarquee from "@/components/SponsorMarquee";
import type { SponsorMarqueeData, SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function SponsorMarqueeSection({ data }: Props) {
  const d = data as unknown as SponsorMarqueeData;
  return (
    <SponsorMarquee
      sponsors={d.sponsors || []}
      heading={d.heading}
      subheading={d.subheading}
      ctaText={d.ctaText}
      ctaHref={d.ctaHref}
      speed={d.speed}
    />
  );
}
