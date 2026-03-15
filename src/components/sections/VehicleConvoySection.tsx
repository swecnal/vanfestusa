import VehicleConvoy from "@/components/VehicleConvoy";
import type { VehicleConvoyData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function VehicleConvoySection({ data, settings }: Props) {
  const d = data as unknown as VehicleConvoyData;

  return (
    <div style={sectionSpacingStyles(settings)}>
      <VehicleConvoy
        seed={d.seed || 42}
        count={d.count || 6}
        reverse={d.reverse}
        marginTop={d.marginTop}
      />
    </div>
  );
}
