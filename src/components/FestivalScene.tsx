"use client";

import { useMemo } from "react";

// ─── Seeded random (same as VehicleConvoy) ───
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ─── Color palettes ───
const TENT_COLORS = ["#1CA288", "#6366F1", "#DC2626", "#F59E0B", "#8B5CF6", "#059669", "#EC4899", "#2563EB"];
const BOOTH_COLORS = ["#DC2626", "#F59E0B", "#2563EB", "#059669", "#EC4899", "#1CA288"];
const SKIN_TONES = ["#D4A574", "#C68E5B", "#E8C39E", "#A0785A", "#F0D5B8"];
const SHIRT_COLORS = ["#1CA288", "#6366F1", "#DC2626", "#F59E0B", "#2563EB", "#EC4899", "#059669", "#8B5CF6"];

// ─── Element types ───
type FestivalElementType = "tent" | "vendorBooth" | "stage" | "dancing" | "campfireWithPeople" | "campfireSolo" | "peopleMeandering";

interface PlacedElement {
  type: FestivalElementType;
  leftPct: number;
  colorSeed: number;
}

const ELEMENT_WIDTHS: Record<FestivalElementType, number> = {
  tent: 50,
  vendorBooth: 70,
  stage: 90,
  dancing: 55,
  campfireWithPeople: 85,
  campfireSolo: 40,
  peopleMeandering: 55,
};

// ─── SVG element renderers ───

function renderTent(rng: () => number) {
  const color = pickRandom(TENT_COLORS, rng);
  const flagColor = pickRandom(TENT_COLORS, rng);
  return (
    <svg width={50} height={60} viewBox="0 0 50 60" fill="none">
      {/* Tent body */}
      <path d="M5 52 L25 12 L45 52 Z" fill={color} stroke="#555" strokeWidth={1.5} strokeLinejoin="round" />
      {/* Door flap */}
      <path d="M20 52 L25 30 L30 52" fill="none" stroke="#444" strokeWidth={1} strokeOpacity={0.6} />
      {/* Flag pole */}
      <line x1={25} y1={12} x2={25} y2={4} stroke="#888" strokeWidth={1.5} />
      {/* Flag */}
      <polygon points="25,4 34,7 25,10" fill={flagColor} className="fscene-sway" />
      {/* Ground shadow */}
      <ellipse cx={25} cy={54} rx={22} ry={3} fill="#333" fillOpacity={0.06} />
    </svg>
  );
}

function renderVendorBooth(rng: () => number) {
  const color = pickRandom(BOOTH_COLORS, rng);
  const itemColors = [pickRandom(TENT_COLORS, rng), pickRandom(TENT_COLORS, rng), pickRandom(TENT_COLORS, rng)];
  return (
    <svg width={70} height={55} viewBox="0 0 70 55" fill="none">
      {/* Canopy */}
      <path d="M5 16 L10 5 L60 5 L65 16 Z" fill={color} stroke="#555" strokeWidth={1.5} strokeLinejoin="round" />
      {/* Scalloped edge */}
      <path d="M5 16 Q12 21 19 16 Q26 21 33 16 Q40 21 47 16 Q54 21 61 16 L65 16" fill={color} stroke="#555" strokeWidth={1} />
      {/* Poles */}
      <line x1={10} y1={16} x2={10} y2={48} stroke="#888" strokeWidth={2} />
      <line x1={60} y1={16} x2={60} y2={48} stroke="#888" strokeWidth={2} />
      {/* Counter */}
      <rect x={12} y={34} width={46} height={4} rx={1} fill="#D4A574" stroke="#555" strokeWidth={1} />
      {/* Items on counter */}
      <rect x={17} y={30} width={7} height={4} rx={1} fill={itemColors[0]} fillOpacity={0.7} />
      <rect x={28} y={30} width={7} height={4} rx={1} fill={itemColors[1]} fillOpacity={0.7} />
      <rect x={39} y={30} width={7} height={4} rx={1} fill={itemColors[2]} fillOpacity={0.7} />
      {/* Ground shadow */}
      <ellipse cx={35} cy={50} rx={32} ry={3} fill="#333" fillOpacity={0.06} />
    </svg>
  );
}

function renderStage(rng: () => number) {
  const skin = pickRandom(SKIN_TONES, rng);
  const shirt = pickRandom(SHIRT_COLORS, rng);
  const skin2 = pickRandom(SKIN_TONES, rng);
  const shirt2 = pickRandom(SHIRT_COLORS, rng);
  return (
    <svg width={90} height={60} viewBox="0 0 90 60" fill="none">
      {/* Platform */}
      <rect x={5} y={42} width={80} height={12} rx={2} fill="#5B4634" stroke="#3D2E20" strokeWidth={1.5} />
      <line x1={5} y1={47} x2={85} y2={47} stroke="#3D2E20" strokeWidth={0.8} strokeOpacity={0.5} />
      {/* Speaker left */}
      <rect x={8} y={24} width={12} height={18} rx={1} fill="#333" stroke="#222" strokeWidth={1} />
      <circle cx={14} cy={30} r={3} fill="#444" stroke="#222" strokeWidth={0.5} />
      <circle cx={14} cy={37} r={4} fill="#444" stroke="#222" strokeWidth={0.5} />
      {/* Speaker right */}
      <rect x={70} y={24} width={12} height={18} rx={1} fill="#333" stroke="#222" strokeWidth={1} />
      <circle cx={76} cy={30} r={3} fill="#444" stroke="#222" strokeWidth={0.5} />
      <circle cx={76} cy={37} r={4} fill="#444" stroke="#222" strokeWidth={0.5} />
      {/* Performer 1 - singer */}
      <circle cx={40} cy={18} r={4} fill={skin} stroke="#333" strokeWidth={1} />
      <line x1={40} y1={22} x2={40} y2={36} stroke={shirt} strokeWidth={2.5} />
      <line x1={40} y1={26} x2={33} y2={32} stroke={shirt} strokeWidth={1.5} />
      <line x1={40} y1={26} x2={48} y2={30} stroke={shirt} strokeWidth={1.5} />
      <line x1={40} y1={36} x2={36} y2={42} stroke="#333" strokeWidth={1.5} />
      <line x1={40} y1={36} x2={44} y2={42} stroke="#333" strokeWidth={1.5} />
      {/* Mic stand */}
      <line x1={48} y1={30} x2={50} y2={18} stroke="#888" strokeWidth={1} />
      <circle cx={50} cy={17} r={2} fill="#555" />
      {/* Performer 2 - guitarist */}
      <circle cx={58} cy={20} r={3.5} fill={skin2} stroke="#333" strokeWidth={1} />
      <line x1={58} y1={23.5} x2={58} y2={36} stroke={shirt2} strokeWidth={2.5} />
      <line x1={58} y1={27} x2={52} y2={33} stroke={shirt2} strokeWidth={1.5} />
      <line x1={58} y1={27} x2={64} y2={31} stroke={shirt2} strokeWidth={1.5} />
      <line x1={58} y1={36} x2={55} y2={42} stroke="#333" strokeWidth={1.5} />
      <line x1={58} y1={36} x2={61} y2={42} stroke="#333" strokeWidth={1.5} />
      {/* Guitar shape */}
      <ellipse cx={53} cy={32} rx={4} ry={3} fill="#8B4513" stroke="#5B3210" strokeWidth={0.8} />
      <line x1={53} y1={29} x2={58} y2={23.5} stroke="#5B3210" strokeWidth={1} />
    </svg>
  );
}

function renderDancing(rng: () => number) {
  const skin1 = pickRandom(SKIN_TONES, rng);
  const shirt1 = pickRandom(SHIRT_COLORS, rng);
  const skin2 = pickRandom(SKIN_TONES, rng);
  const shirt2 = pickRandom(SHIRT_COLORS, rng);
  return (
    <svg width={55} height={58} viewBox="0 0 55 58" fill="none">
      {/* Person 1 - arms up */}
      <g className="fscene-sway">
        <circle cx={18} cy={12} r={4} fill={skin1} stroke="#333" strokeWidth={1} />
        <line x1={18} y1={16} x2={18} y2={34} stroke={shirt1} strokeWidth={2.5} />
        <line x1={18} y1={20} x2={10} y2={14} stroke={shirt1} strokeWidth={1.5} />
        <line x1={18} y1={20} x2={26} y2={14} stroke={shirt1} strokeWidth={1.5} />
        <line x1={18} y1={34} x2={14} y2={46} stroke="#333" strokeWidth={1.5} />
        <line x1={18} y1={34} x2={22} y2={46} stroke="#333" strokeWidth={1.5} />
      </g>
      {/* Person 2 - arms out */}
      <g className="fscene-sway-alt">
        <circle cx={38} cy={14} r={4} fill={skin2} stroke="#333" strokeWidth={1} />
        <line x1={38} y1={18} x2={38} y2={36} stroke={shirt2} strokeWidth={2.5} />
        <line x1={38} y1={22} x2={30} y2={20} stroke={shirt2} strokeWidth={1.5} />
        <line x1={38} y1={22} x2={46} y2={18} stroke={shirt2} strokeWidth={1.5} />
        <line x1={38} y1={36} x2={34} y2={46} stroke="#333" strokeWidth={1.5} />
        <line x1={38} y1={36} x2={42} y2={46} stroke="#333" strokeWidth={1.5} />
      </g>
      {/* Ground shadow */}
      <ellipse cx={28} cy={48} rx={24} ry={3} fill="#333" fillOpacity={0.06} />
    </svg>
  );
}

function renderCampfireWithPeople(rng: () => number) {
  const skin1 = pickRandom(SKIN_TONES, rng);
  const shirt1 = pickRandom(SHIRT_COLORS, rng);
  const skin2 = pickRandom(SKIN_TONES, rng);
  const shirt2 = pickRandom(SHIRT_COLORS, rng);
  return (
    <svg width={85} height={58} viewBox="0 0 85 58" fill="none">
      {/* Logs */}
      <ellipse cx={42} cy={48} rx={12} ry={3} fill="#8B4513" stroke="#5B3210" strokeWidth={1} />
      <line x1={32} y1={46} x2={52} y2={46} stroke="#5B3210" strokeWidth={3} strokeLinecap="round" />
      <line x1={35} y1={49} x2={49} y2={49} stroke="#6B3E10" strokeWidth={2.5} strokeLinecap="round" />
      {/* Fire */}
      <g className="fscene-flicker">
        <path d="M42 44 L38 30 L42 34 L44 24 L46 34 L50 28 L46 44 Z" fill="#F59E0B" fillOpacity={0.9} />
        <path d="M42 44 L40 34 L42 37 L44 28 L46 36 L48 32 L46 44 Z" fill="#EF4444" fillOpacity={0.7} />
        <path d="M43 44 L41 36 L43 38 L44 32 L45 38 L46 35 L45 44 Z" fill="#FDE68A" fillOpacity={0.8} />
      </g>
      {/* Sparks */}
      <circle cx={40} cy={22} r={1} fill="#FDE68A" className="fscene-flicker" fillOpacity={0.6} />
      <circle cx={46} cy={20} r={0.8} fill="#F59E0B" className="fscene-flicker" fillOpacity={0.5} />
      {/* Person left - seated */}
      <circle cx={18} cy={28} r={4} fill={skin1} stroke="#333" strokeWidth={1} />
      <path d="M18 32 L18 42 L24 46" fill="none" stroke={shirt1} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={18} y1={36} x2={28} y2={38} stroke={shirt1} strokeWidth={1.5} />
      <line x1={18} y1={36} x2={12} y2={40} stroke={shirt1} strokeWidth={1.5} />
      {/* Person right - seated */}
      <circle cx={66} cy={28} r={4} fill={skin2} stroke="#333" strokeWidth={1} />
      <path d="M66 32 L66 42 L60 46" fill="none" stroke={shirt2} strokeWidth={2.5} strokeLinecap="round" />
      <line x1={66} y1={36} x2={56} y2={38} stroke={shirt2} strokeWidth={1.5} />
      <line x1={66} y1={36} x2={72} y2={40} stroke={shirt2} strokeWidth={1.5} />
      {/* Glow circle */}
      <circle cx={42} cy={38} r={18} fill="#F59E0B" fillOpacity={0.04} />
    </svg>
  );
}

function renderCampfireSolo(rng: () => number) {
  void rng;
  return (
    <svg width={40} height={52} viewBox="0 0 40 52" fill="none">
      {/* Logs */}
      <ellipse cx={20} cy={44} rx={10} ry={3} fill="#8B4513" stroke="#5B3210" strokeWidth={1} />
      <line x1={12} y1={42} x2={28} y2={42} stroke="#5B3210" strokeWidth={3} strokeLinecap="round" />
      <line x1={14} y1={45} x2={26} y2={45} stroke="#6B3E10" strokeWidth={2.5} strokeLinecap="round" />
      {/* Fire */}
      <g className="fscene-flicker">
        <path d="M20 40 L16 24 L20 30 L22 16 L24 28 L28 22 L24 40 Z" fill="#F59E0B" fillOpacity={0.9} />
        <path d="M20 40 L18 28 L20 32 L22 22 L24 30 L26 26 L24 40 Z" fill="#EF4444" fillOpacity={0.7} />
        <path d="M21 40 L19 30 L21 33 L22 26 L23 32 L24 28 L23 40 Z" fill="#FDE68A" fillOpacity={0.8} />
      </g>
      {/* Sparks */}
      <circle cx={18} cy={14} r={1} fill="#FDE68A" className="fscene-flicker" fillOpacity={0.6} />
      <circle cx={24} cy={12} r={0.8} fill="#F59E0B" className="fscene-flicker" fillOpacity={0.5} />
      <circle cx={21} cy={10} r={0.6} fill="#FDE68A" className="fscene-flicker" fillOpacity={0.4} />
      {/* Glow */}
      <circle cx={20} cy={34} r={14} fill="#F59E0B" fillOpacity={0.04} />
    </svg>
  );
}

function renderPeopleMeandering(rng: () => number) {
  const skin1 = pickRandom(SKIN_TONES, rng);
  const shirt1 = pickRandom(SHIRT_COLORS, rng);
  const skin2 = pickRandom(SKIN_TONES, rng);
  const shirt2 = pickRandom(SHIRT_COLORS, rng);
  return (
    <svg width={55} height={58} viewBox="0 0 55 58" fill="none">
      {/* Person 1 - walking right */}
      <g className="fscene-bob">
        <circle cx={16} cy={12} r={4} fill={skin1} stroke="#333" strokeWidth={1} />
        <line x1={16} y1={16} x2={16} y2={34} stroke={shirt1} strokeWidth={2.5} />
        <line x1={16} y1={22} x2={10} y2={28} stroke={shirt1} strokeWidth={1.5} />
        <line x1={16} y1={22} x2={22} y2={26} stroke={shirt1} strokeWidth={1.5} />
        <line x1={16} y1={34} x2={12} y2={46} stroke="#333" strokeWidth={1.5} />
        <line x1={16} y1={34} x2={21} y2={46} stroke="#333" strokeWidth={1.5} />
      </g>
      {/* Person 2 - walking left */}
      <g className="fscene-bob-alt">
        <circle cx={40} cy={14} r={3.5} fill={skin2} stroke="#333" strokeWidth={1} />
        <line x1={40} y1={17.5} x2={40} y2={34} stroke={shirt2} strokeWidth={2.5} />
        <line x1={40} y1={22} x2={34} y2={26} stroke={shirt2} strokeWidth={1.5} />
        <line x1={40} y1={22} x2={46} y2={28} stroke={shirt2} strokeWidth={1.5} />
        <line x1={40} y1={34} x2={36} y2={46} stroke="#333" strokeWidth={1.5} />
        <line x1={40} y1={34} x2={44} y2={46} stroke="#333" strokeWidth={1.5} />
      </g>
      {/* Ground shadow */}
      <ellipse cx={28} cy={48} rx={24} ry={3} fill="#333" fillOpacity={0.06} />
    </svg>
  );
}

// ─── Render dispatcher ───
function renderElement(type: FestivalElementType, colorSeed: number) {
  const rng = seededRandom(colorSeed);
  switch (type) {
    case "tent": return renderTent(rng);
    case "vendorBooth": return renderVendorBooth(rng);
    case "stage": return renderStage(rng);
    case "dancing": return renderDancing(rng);
    case "campfireWithPeople": return renderCampfireWithPeople(rng);
    case "campfireSolo": return renderCampfireSolo(rng);
    case "peopleMeandering": return renderPeopleMeandering(rng);
  }
}

// ─── Main Component ───
export interface FestivalElements {
  vendorBooths?: boolean;
  stage?: boolean;
  dancing?: boolean;
  campfireWithPeople?: boolean;
  campfireSolo?: boolean;
  tents?: boolean;
  peopleMeandering?: boolean;
}

const ALL_ON: FestivalElements = {
  vendorBooths: true,
  stage: true,
  dancing: true,
  campfireWithPeople: true,
  campfireSolo: false,
  tents: true,
  peopleMeandering: true,
};

interface FestivalSceneProps {
  seed?: number;
  elements?: FestivalElements;
  bgColor?: string;
}

export default function FestivalScene({
  seed = 42,
  elements = ALL_ON,
  bgColor = "#F5F0E8",
}: FestivalSceneProps) {
  const scene = useMemo(() => {
    const rng = seededRandom(seed);

    // Collect enabled element types (some get duplicated for variety)
    const types: FestivalElementType[] = [];
    if (elements.tents) { types.push("tent"); types.push("tent"); }
    if (elements.vendorBooths) { types.push("vendorBooth"); types.push("vendorBooth"); }
    if (elements.stage) types.push("stage");
    if (elements.dancing) types.push("dancing");
    if (elements.campfireWithPeople) types.push("campfireWithPeople");
    if (elements.campfireSolo) types.push("campfireSolo");
    if (elements.peopleMeandering) { types.push("peopleMeandering"); types.push("peopleMeandering"); }

    if (types.length === 0) return [];

    // Shuffle
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }

    // Distribute across available width with even spacing + jitter
    const count = types.length;
    const segmentPct = 100 / (count + 1); // +1 for padding on edges

    const placed: PlacedElement[] = types.map((type, i) => ({
      type,
      leftPct: segmentPct * (i + 0.5) + (rng() - 0.5) * segmentPct * 0.4,
      colorSeed: Math.floor(rng() * 100000),
    }));

    return placed;
  }, [seed, elements]);

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "100px", backgroundColor: bgColor }}
    >
      {/* CSS Animations */}
      <style>{`
        .fscene-sway {
          animation: fscene-sway 3s ease-in-out infinite;
          transform-origin: bottom left;
        }
        .fscene-sway-alt {
          animation: fscene-sway 2.5s ease-in-out infinite reverse;
          transform-origin: bottom center;
        }
        .fscene-flicker {
          animation: fscene-flicker 1.2s ease-in-out infinite;
        }
        .fscene-bob {
          animation: fscene-bob 2.5s ease-in-out infinite;
        }
        .fscene-bob-alt {
          animation: fscene-bob 3s ease-in-out infinite 0.5s;
        }
        .fscene-sway-slow {
          animation: fscene-sway-slow 4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes fscene-sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes fscene-sway-slow {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
        @keyframes fscene-flicker {
          0%, 100% { opacity: 1; }
          25% { opacity: 0.7; }
          50% { opacity: 0.5; }
          75% { opacity: 0.85; }
        }
        @keyframes fscene-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>

      {/* Ground line */}
      <div className="absolute bottom-3 left-0 w-full">
        <svg width="100%" height="2" className="block">
          <line x1="0" y1="1" x2="100%" y2="1" stroke="#8B7355" strokeWidth="1" strokeOpacity="0.15" />
        </svg>
      </div>

      {/* Scene elements */}
      {scene.map((item, i) => (
        <div
          key={i}
          className="absolute bottom-4"
          style={{ left: `${item.leftPct}%`, transform: "translateX(-50%)" }}
        >
          {renderElement(item.type, item.colorSeed)}
        </div>
      ))}
    </section>
  );
}
