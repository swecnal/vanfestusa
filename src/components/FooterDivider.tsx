"use client";

import VehicleStream from "./VehicleStream";
import VehicleConvoy from "./VehicleConvoy";
import FestivalScene from "./FestivalScene";
import type { VehicleStreamConfig } from "./VehicleStream";

// ─── SVG path generators (same as WaveDividerSection) ───

function generateWavePath(width: number, height: number, frequency: number, intensity: number): string {
  const baseY = height * 0.5;
  const amplitude = baseY * (intensity / 100);
  const segments = frequency * 2;
  const segW = width / segments;

  let path = `M0,0 L0,${baseY}`;
  path += ` Q${segW * 0.5},${baseY + amplitude} ${segW},${baseY}`;
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

interface Props {
  config?: VehicleStreamConfig | null;
}

export default function FooterDivider({ config }: Props) {
  const enabled = config?.enabled ?? true;
  const dividerType = config?.dividerType || "vehicle_stream";
  const paddingTop = config?.paddingTop || "0px";
  const paddingBottom = config?.paddingBottom || "0px";
  const marginTop = config?.marginTop || "0px";
  const marginBottom = config?.marginBottom || "0px";

  if (!enabled) return null;

  const wrapperStyle = {
    paddingTop,
    paddingBottom,
    marginTop,
    marginBottom,
  };

  // Vehicle Stream (default)
  if (dividerType === "vehicle_stream") {
    return (
      <div style={wrapperStyle}>
        <VehicleStream config={config} />
      </div>
    );
  }

  // Convoy
  if (dividerType === "convoy") {
    return (
      <div style={wrapperStyle}>
        <VehicleConvoy
          seed={config?.seed || 42}
          count={config?.count || 6}
          reverse={config?.reverse}
        />
      </div>
    );
  }

  // Festival
  if (dividerType === "festival") {
    return (
      <div style={wrapperStyle}>
        <FestivalScene
          seed={config?.festivalSeed || 42}
          elements={config?.festivalElements}
          bgColor={config?.festivalBgColor || "#F5F0E8"}
        />
      </div>
    );
  }

  // Straight
  const toColor = config?.toColor || "#1a1a1a";
  const fromColor = config?.fromColor || "white";
  const height = config?.height || 60;
  const frequency = config?.frequency || 2;
  const intensity = config?.intensity || 50;

  if (dividerType === "straight") {
    return (
      <div style={wrapperStyle}>
        <div className="relative -mt-1" style={{ backgroundColor: toColor }}>
          <div style={{ height, backgroundColor: fromColor }} />
        </div>
      </div>
    );
  }

  // Wave / Zigzag / Curve
  let svgPath: string;
  if (dividerType === "zigzag") {
    svgPath = generateZigzagPath(1440, height, frequency, intensity);
  } else if (dividerType === "curve") {
    svgPath = generateCurvePath(1440, height, intensity);
  } else {
    svgPath = generateWavePath(1440, height, frequency, intensity);
  }

  return (
    <div style={wrapperStyle}>
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
    </div>
  );
}
