import SponsorMarquee from "@/components/SponsorMarquee";
import type { SectionSettings } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function SponsorMarqueeSection({}: Props) {
  // SponsorMarquee uses its own data currently
  return <SponsorMarquee />;
}
