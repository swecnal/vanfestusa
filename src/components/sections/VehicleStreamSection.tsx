import VehicleStream from "@/components/VehicleStream";
import type { VehicleStreamData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

export default function VehicleStreamSection({ data, settings }: Props) {
  return (
    <div style={sectionSpacingStyles(settings)}>
      <VehicleStream />
    </div>
  );
}
