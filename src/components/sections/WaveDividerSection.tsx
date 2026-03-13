import type { WaveDividerData } from "@/lib/types";

interface Props {
  data: Record<string, unknown>;
}

export default function WaveDividerSection({ data }: Props) {
  const d = data as unknown as WaveDividerData;
  const toColor = d.toColor || "#1a1a1a";
  const fromColor = d.fromColor || "white";

  return (
    <div className="relative -mt-1" style={{ backgroundColor: toColor }}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: d.height || 60 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={
            d.svgPath ||
            "M0,0 L0,30 Q180,60 360,30 T720,30 T1080,30 T1440,30 L1440,0 Z"
          }
          fill={fromColor}
        />
      </svg>
    </div>
  );
}
