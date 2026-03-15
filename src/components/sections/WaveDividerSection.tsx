import type { WaveDividerData, SectionSettings } from "@/lib/types";
import { sectionSpacingStyles } from "@/lib/types";
import VehicleConvoy from "@/components/VehicleConvoy";
import VehicleStream from "@/components/VehicleStream";
import FestivalScene from "@/components/FestivalScene";

interface Props {
  data: Record<string, unknown>;
  settings: SectionSettings;
}

// ─── Color helpers ───

function hexToRgba(color: string, opacity: number): string {
  // Handle named colors
  const named: Record<string, string> = { white: "#ffffff", black: "#000000", transparent: "transparent" };
  const hex = named[color.toLowerCase()] || color;
  if (hex === "transparent") return "transparent";
  const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return color;
  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

function resolveColor(color: string, opacity?: number): string {
  if (opacity !== undefined && opacity < 100) return hexToRgba(color, opacity);
  return color;
}

// ─── Path generators ───

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

// ─── New SVG divider generators ───

function generateCloudsPath(width: number, height: number, intensity: number): string {
  const baseY = height * 0.3;
  const amp = height * 0.4 * (intensity / 100);
  // Multiple overlapping arcs creating a cloud silhouette
  const segments = 7;
  const segW = width / segments;
  let path = `M0,0 L0,${baseY}`;
  for (let i = 0; i < segments; i++) {
    const cx = segW * i + segW * 0.5;
    const r = amp * (0.7 + (i % 3) * 0.15);
    path += ` Q${cx},${baseY - r} ${segW * (i + 1)},${baseY}`;
  }
  path += ` L${width},0 Z`;
  return path;
}

function generateBubblesElements(width: number, height: number, intensity: number, fromColor: string): React.ReactNode[] {
  const count = 15 + Math.round(intensity * 0.3);
  const elements: React.ReactNode[] = [];
  // Seeded deterministic positions
  let seed = 12345;
  const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < count; i++) {
    const cx = rng() * width;
    const cy = rng() * height;
    const r = 4 + rng() * (height * 0.15) * (intensity / 100);
    const opacity = 0.2 + rng() * 0.6;
    elements.push(
      <circle key={i} cx={cx} cy={cy} r={r} fill={fromColor} fillOpacity={opacity} />
    );
  }
  return elements;
}

function generatePaintSpillPath(width: number, height: number, intensity: number): string {
  const baseY = height * 0.25;
  const dripDepth = height * 0.6 * (intensity / 100);
  // Base with organic drips
  let path = `M0,0 L0,${baseY}`;
  const drips = 5;
  const segW = width / drips;
  for (let i = 0; i < drips; i++) {
    const x1 = segW * i + segW * 0.2;
    const x2 = segW * i + segW * 0.5;
    const x3 = segW * i + segW * 0.8;
    const dripH = baseY + dripDepth * (0.5 + (i % 3) * 0.25);
    path += ` L${x1},${baseY}`;
    path += ` C${x1},${dripH} ${x3},${dripH} ${x3},${baseY}`;
  }
  path += ` L${width},${baseY} L${width},0 Z`;
  return path;
}

function generateDigitalFadeElements(width: number, height: number, intensity: number, fromColor: string): React.ReactNode[] {
  const cols = 48;
  const rows = Math.max(4, Math.round(height / 12));
  const cellW = width / cols;
  const cellH = height / rows;
  const elements: React.ReactNode[] = [];
  let seed = 54321;
  const rng = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

  for (let r = 0; r < rows; r++) {
    const rowOpacity = 1 - (r / rows); // Fade from top to bottom
    const threshold = rowOpacity * (intensity / 100);
    for (let c = 0; c < cols; c++) {
      if (rng() < threshold) {
        elements.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellW}
            y={r * cellH}
            width={cellW + 0.5}
            height={cellH + 0.5}
            fill={fromColor}
            fillOpacity={rowOpacity * 0.8 + rng() * 0.2}
          />
        );
      }
    }
  }
  return elements;
}

export default function WaveDividerSection({ data, settings }: Props) {
  const spacingStyle = sectionSpacingStyles(settings);
  const d = data as unknown as WaveDividerData;
  const dividerType = d.dividerType || "wave";
  const rawToColor = d.toColor || "#1a1a1a";
  const rawFromColor = d.fromColor || "white";
  const toColor = resolveColor(rawToColor, d.toColorOpacity);
  const fromColor = resolveColor(rawFromColor, d.fromColorOpacity);
  const height = d.height || 60;
  const frequency = d.frequency || 2;
  const intensity = d.intensity || 50;

  // ─── Convoy ───
  if (dividerType === "convoy") {
    return (
      <div style={spacingStyle}>
        <VehicleConvoy
          seed={d.seed || 42}
          count={d.count || 6}
          reverse={d.reverse}
          speedMultiplier={d.convoySpeed}
          randomness={d.convoyRandomness}
          vehicleGap={d.vehicleGap}
        />
      </div>
    );
  }

  // ─── Stream ───
  if (dividerType === "stream") {
    return (
      <div style={spacingStyle}>
        <VehicleStream
          config={{
            enabled: true,
            seed: d.streamSeed || 777,
            count: d.streamCount || 14,
            signs: d.streamSigns || ["COMMUNITY", "MUSIC", "MEMORIES", "VANFEST"],
          }}
          speedMultiplier={d.streamSpeed}
          randomness={d.streamRandomness}
          showDrivers={d.showDrivers}
          showPassengers={d.showPassengers}
        />
      </div>
    );
  }

  // ─── Festival ───
  if (dividerType === "festival") {
    return (
      <div style={spacingStyle}>
        <FestivalScene
          seed={d.festivalSeed || 42}
          elements={d.festivalElements}
          bgColor={d.festivalBgColor || "#F5F0E8"}
        />
      </div>
    );
  }

  // ─── Straight ───
  if (dividerType === "straight") {
    return (
      <div className="relative -mt-1" style={{ backgroundColor: toColor, ...spacingStyle }}>
        <div style={{ height, backgroundColor: fromColor }} />
      </div>
    );
  }

  // ─── Gradient ───
  if (dividerType === "gradient") {
    return (
      <div className="relative -mt-1" style={spacingStyle}>
        <svg
          viewBox={`0 0 1440 ${height}`}
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height, transform: d.flip ? "scaleX(-1)" : undefined }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad-divider" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={fromColor} />
              <stop offset="100%" stopColor={toColor} />
            </linearGradient>
          </defs>
          <rect width="1440" height={height} fill="url(#grad-divider)" />
        </svg>
      </div>
    );
  }

  // ─── Bubbles ───
  if (dividerType === "bubbles") {
    return (
      <div className="relative -mt-1" style={{ backgroundColor: toColor, ...spacingStyle }}>
        <svg
          viewBox={`0 0 1440 ${height}`}
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height, transform: d.flip ? "scaleX(-1)" : undefined }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {generateBubblesElements(1440, height, intensity, fromColor)}
        </svg>
      </div>
    );
  }

  // ─── Digital Fade ───
  if (dividerType === "digital_fade") {
    return (
      <div className="relative -mt-1" style={{ backgroundColor: toColor, ...spacingStyle }}>
        <svg
          viewBox={`0 0 1440 ${height}`}
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height, transform: d.flip ? "scaleX(-1)" : undefined }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {generateDigitalFadeElements(1440, height, intensity, fromColor)}
        </svg>
      </div>
    );
  }

  // ─── Wave / Zigzag / Curve / Clouds / Paint Spill ───
  let svgPath: string;
  if (d.svgPath && dividerType === "wave") {
    svgPath = d.svgPath;
  } else if (dividerType === "zigzag") {
    svgPath = generateZigzagPath(1440, height, frequency, intensity);
  } else if (dividerType === "curve") {
    svgPath = generateCurvePath(1440, height, intensity);
  } else if (dividerType === "clouds") {
    svgPath = generateCloudsPath(1440, height, intensity);
  } else if (dividerType === "paint_spill") {
    svgPath = generatePaintSpillPath(1440, height, intensity);
  } else {
    svgPath = d.svgPath || generateWavePath(1440, height, frequency, intensity);
  }

  return (
    <div className="relative -mt-1" style={{ backgroundColor: toColor, ...spacingStyle }}>
      <svg
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height, transform: d.flip ? "scaleX(-1)" : undefined }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={svgPath} fill={fromColor} />
      </svg>
    </div>
  );
}
