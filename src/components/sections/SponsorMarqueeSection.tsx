import SponsorMarquee from "@/components/SponsorMarquee";
import type { SponsorMarqueeData, SectionSettings } from "@/lib/types";
import { textStyleConfigToCSS, type TextStyleConfig } from "@/lib/styles";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function SponsorMarqueeSection({ data }: Props) {
  const d = data as unknown as SponsorMarqueeData;
  const headingStyle = (data as Record<string, unknown>).headingStyle as TextStyleConfig | undefined;
  const subheadingStyle = (data as Record<string, unknown>).subheadingStyle as TextStyleConfig | undefined;
  return (
    <SponsorMarquee
      sponsors={d.sponsors || []}
      heading={d.heading}
      subheading={d.subheading}
      ctaText={d.ctaText}
      ctaHref={d.ctaHref}
      speed={d.speed}
      headingStyle={headingStyle ? textStyleConfigToCSS(headingStyle) : undefined}
      subheadingStyle={subheadingStyle ? textStyleConfigToCSS(subheadingStyle) : undefined}
    />
  );
}
