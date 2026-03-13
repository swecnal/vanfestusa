import VehicleConvoy from "@/components/VehicleConvoy";
import type { VehicleConvoyData } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
}

export default function VehicleConvoySection({ data }: Props) {
  const d = data as unknown as VehicleConvoyData;

  return (
    <VehicleConvoy
      seed={d.seed || 42}
      count={d.count || 6}
      reverse={d.reverse}
      marginTop={d.marginTop}
    />
  );
}
