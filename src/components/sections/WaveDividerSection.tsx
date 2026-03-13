import type { WaveDividerData } from "@/lib/types";
import VehicleConvoy from "@/components/VehicleConvoy";
import FestivalScene from "@/components/FestivalScene";

interface Props {
  data: Record<string, unknown>;
}

// ─── Path generators ───

function generateWavePath(width: number, height: number, frequency: number, intensity: number): string {
  const baseY = height * 0.5;
  const amplitude = baseY * (intensity / 100);
  const segments = frequency * 2;
  const segW = width / segments;

  let path = `M0,0 L0,${baseY}`;
  // First segment: explicit quadratic bezier
  path += ` Q${segW * 0.5},${baseY + amplitude} ${segW},${baseY}`;
  // Remaining segments: smooth continuation (alternates control direction automatically)
  for (let i = 1; i < segments; i++) {
    path += ` T${segW * (i + 1)},${baseY}`;
  }
  path += ` L${width},0 Z`;
  return path;
}

function generateZigzagPath(width: number, height: number, frequency: number, intensity: number): string {
  const baseY = height * 0.5;
  const amplitude = baseY * (intensity / 100);
  const segments = frequency * 2;
  const segW = width / segments;

  let path = `M0,0 L0,${baseY}`;
  for (let i = 0; i < segments; i++) {
    const targetY = i % 2 === 0 ? baseY + amplitude : baseY - amplitude;
    path += ` L${segW * (i + 1)},${targetY}`;
  }
  path += ` L${width},${baseY} L${width},0 Z`;
  return path;
}

function generateCurvePath(width: number, height: number, intensity: number): string {
  const depth = height * (intensity / 100);
  return `M0,0 L0,${height - depth} Q${width / 2},${height + depth * 0.5} ${width},${height - depth} L${width},0 Z`;
}

export default function WaveDividerSection({ data }: Props) {
  const d = data as unknown as WaveDividerData;
  const dividerType = d.dividerType || "wave";
  const toColor = d.toColor || "#1a1a1a";
  const fromColor = d.fromColor || "white";
  const height = d.height || 60;
  const frequency = d.frequency || 2;
  const intensity = d.intensity || 50;

  // ─── Convoy ───
  if (dividerType === "convoy") {
    return (
      <VehicleConvoy
        seed={d.seed || 42}
        count={d.count || 6}
        reverse={d.reverse}
      />
    );
  }

  // ─── Festival ───
  if (dividerType === "festival") {
    return (
      <FestivalScene
        seed={d.festivalSeed || 42}
        elements={d.festivalElements}
        bgColor={d.festivalBgColor || "#F5F0E8"}
      />
    );
  }

  // ─── Straight ───
  if (dividerType === "straight") {
    return (
      <div className="relative -mt-1" style={{ backgroundColor: toColor }}>
        <div style={{ height, backgroundColor: fromColor }} />
      </div>
    );
  }

  // ─── Wave / Zigzag / Curve ───
  let svgPath: string;
  if (d.svgPath && dividerType === "wave") {
    // Legacy custom path
    svgPath = d.svgPath;
  } else if (dividerType === "zigzag") {
    svgPath = generateZigzagPath(1440, height, frequency, intensity);
  } else if (dividerType === "curve") {
    svgPath = generateCurvePath(1440, height, intensity);
  } else {
    // Default wave
    svgPath = d.svgPath || generateWavePath(1440, height, frequency, intensity);
  }

  return (
    <div className="relative -mt-1" style={{ backgroundColor: toColor }}>
      <svg
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={svgPath} fill={fromColor} />
      </svg>
    </div>
  );
}
