import VehicleStream from "@/components/VehicleStream";
import type { VehicleStreamData } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
}

export default function VehicleStreamSection({ data }: Props) {
  // VehicleStream is already in the public layout.
  // This section type exists if someone wants to add it inline.
  return <VehicleStream />;
}
