"use client";

import { useEffect, useRef, useMemo } from "react";

// ─── Color palettes ───
const vanColors = [
  { body: "#1CA288", stroke: "#17806C" },    // teal
  { body: "#6366F1", stroke: "#4338CA" },    // indigo
  { body: "#DC2626", stroke: "#991B1B" },    // red
  { body: "#F59E0B", stroke: "#D97706" },    // amber
  { body: "#8B5CF6", stroke: "#6D28D9" },    // purple
  { body: "#059669", stroke: "#047857" },    // emerald
  { body: "#2563EB", stroke: "#1D4ED8" },    // blue
  { body: "#EC4899", stroke: "#BE185D" },    // pink
  { body: "#78716C", stroke: "#57534E" },    // stone
  { body: "#0891B2", stroke: "#0E7490" },    // cyan
  { body: "#EA580C", stroke: "#C2410C" },    // orange
  { body: "#65A30D", stroke: "#4D7C0F" },    // lime
];
const busColors = [
  { body: "#D97706", stroke: "#92400E" },    // classic yellow
  { body: "#065F46", stroke: "#064E3B" },    // forest
  { body: "#1E40AF", stroke: "#1E3A8A" },    // navy
  { body: "#7C2D12", stroke: "#6C2710" },    // rust
  { body: "#831843", stroke: "#6B1E3B" },    // magenta
];

type VehicleType = "sprinter" | "promaster" | "transit" | "vw" | "skoolie_short" | "skoolie_long" | "rv" | "minivan" | "car" | "motorcycle";

interface VehicleDef {
  type: VehicleType;
  width: number;
  height: number;
}

const vehiclePool: VehicleDef[] = [
  { type: "sprinter", width: 110, height: 55 },
  { type: "promaster", width: 105, height: 54 },
  { type: "transit", width: 100, height: 52 },
  { type: "vw", width: 85, height: 48 },
  { type: "skoolie_short", width: 120, height: 58 },
  { type: "skoolie_long", width: 150, height: 62 },
  { type: "rv", width: 145, height: 60 },
  { type: "minivan", width: 80, height: 42 },
  { type: "car", width: 78, height: 38 },
  { type: "motorcycle", width: 60, height: 38 },
];

// Seeded random for SSR consistency
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

// ─── Roof accessories ───
function roofAccessory(rng: () => number, bodyW: number, viewW: number): React.ReactNode {
  const choice = Math.floor(rng() * 6);
  const cx = viewW * 0.45;
  switch (choice) {
    case 0: // Solar panels
      return (
        <>
          <rect x={cx - 25} y={4} width={50} height={6} rx={1} fill="#1CA288" fillOpacity={0.5} stroke="#1CA288" strokeWidth={1} />
          <line x1={cx - 10} y1={4} x2={cx - 10} y2={10} stroke="#1CA288" strokeWidth={0.8} />
          <line x1={cx + 10} y1={4} x2={cx + 10} y2={10} stroke="#1CA288" strokeWidth={0.8} />
        </>
      );
    case 1: // Roof rack with cargo
      return (
        <>
          <line x1={cx - 30} y1={10} x2={cx + 30} y2={10} stroke="#6B7280" strokeWidth={2} />
          <line x1={cx - 25} y1={10} x2={cx - 25} y2={14} stroke="#6B7280" strokeWidth={1.5} />
          <line x1={cx + 25} y1={10} x2={cx + 25} y2={14} stroke="#6B7280" strokeWidth={1.5} />
          <rect x={cx - 18} y={3} width={36} height={7} rx={2} fill="#78716C" fillOpacity={0.6} />
        </>
      );
    case 2: // Surfboard on side
      return (
        <ellipse cx={cx} cy={6} rx={32} ry={3} fill="#F59E0B" fillOpacity={0.7} stroke="#D97706" strokeWidth={1} />
      );
    case 3: // Roof vent/fan
      return (
        <circle cx={cx} cy={8} r={5} fill="#9CA3AF" stroke="#6B7280" strokeWidth={1.5} />
      );
    case 4: // Kayak
      return (
        <ellipse cx={cx} cy={5} rx={30} ry={3.5} fill="#E11D48" fillOpacity={0.6} stroke="#BE185D" strokeWidth={1} />
      );
    case 5: // Solar + rack combo
      return (
        <>
          <line x1={cx - 35} y1={10} x2={cx + 35} y2={10} stroke="#1CA288" strokeWidth={2} />
          <line x1={cx - 30} y1={10} x2={cx - 30} y2={14} stroke="#1CA288" strokeWidth={1.5} />
          <line x1={cx + 30} y1={10} x2={cx + 30} y2={14} stroke="#1CA288" strokeWidth={1.5} />
          <rect x={cx - 22} y={3} width={44} height={7} rx={1} fill="#1CA288" fillOpacity={0.4} stroke="#1CA288" strokeWidth={0.8} />
        </>
      );
    default:
      return null;
  }
}

// ─── Vehicle SVG renderers ───
function renderVehicle(
  type: VehicleType,
  color: { body: string; stroke: string },
  rng: () => number,
  flip: boolean,
): React.ReactNode {
  const s = flip ? { transform: "scaleX(-1)" } : {};

  switch (type) {
    case "sprinter":
      return (
        <svg width={110} height={55} viewBox="0 0 220 110" fill="none" style={s}>
          {roofAccessory(rng, 110, 220)}
          <path d="M30 20 L30 75 L195 75 L195 45 L180 28 L165 20 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M168 24 L182 32 L195 48 L195 55 L168 55 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={130} y={30} width={28} height={20} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.75} />
          <rect x={40} y={32} width={18} height={16} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.6} />
          <line x1={32} y1={55} x2={193} y2={55} stroke={color.stroke} strokeWidth={1.5} />
          <rect x={193} y={50} width={5} height={8} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={28} y={55} width={4} height={10} rx={1.5} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={175} cy={80} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={175} cy={80} r={8} fill="#555" /><circle cx={175} cy={80} r={3} fill="#888" />
          <circle cx={60} cy={80} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={60} cy={80} r={8} fill="#555" /><circle cx={60} cy={80} r={3} fill="#888" />
          <ellipse cx={118} cy={98} rx={85} ry={4} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "promaster":
      return (
        <svg width={105} height={54} viewBox="0 0 210 108" fill="none" style={s}>
          {roofAccessory(rng, 105, 210)}
          <path d="M28 18 L28 74 L185 74 L185 42 L175 28 L160 18 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M163 22 L177 30 L185 45 L185 54 L158 54 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={120} y={30} width={30} height={20} rx={4} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.75} />
          <rect x={38} y={30} width={22} height={16} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.6} />
          <line x1={30} y1={54} x2={183} y2={54} stroke={color.stroke} strokeWidth={1.5} />
          <rect x={183} y={48} width={5} height={9} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={26} y={54} width={4} height={10} rx={1.5} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={168} cy={78} r={15} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={168} cy={78} r={7.5} fill="#555" /><circle cx={168} cy={78} r={3} fill="#888" />
          <circle cx={55} cy={78} r={15} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={55} cy={78} r={7.5} fill="#555" /><circle cx={55} cy={78} r={3} fill="#888" />
          <ellipse cx={112} cy={96} rx={80} ry={4} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "transit":
      return (
        <svg width={100} height={52} viewBox="0 0 200 105" fill="none" style={s}>
          {roofAccessory(rng, 100, 200)}
          <path d="M28 14 L28 72 L180 72 L180 38 L170 24 L155 14 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M158 18 L172 28 L180 42 L180 52 L155 52 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={118} y={26} width={28} height={20} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.75} />
          <line x1={30} y1={52} x2={178} y2={52} stroke={color.stroke} strokeWidth={1.5} />
          <rect x={178} y={47} width={4} height={8} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={26} y={52} width={4} height={10} rx={1.5} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={160} cy={77} r={15} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={160} cy={77} r={7.5} fill="#555" /><circle cx={160} cy={77} r={3} fill="#888" />
          <circle cx={55} cy={77} r={15} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={55} cy={77} r={7.5} fill="#555" /><circle cx={55} cy={77} r={3} fill="#888" />
          <ellipse cx={108} cy={94} rx={80} ry={4} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "vw":
      return (
        <svg width={85} height={48} viewBox="0 0 170 96" fill="none" style={s}>
          <path d="M45 16 L45 8 L130 8 L130 16" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} />
          <path d="M22 16 L22 64 L152 64 L152 33 L143 20 L138 16 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M140 19 L145 22 L152 35 L152 46 L132 46 L132 19 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={94} y={26} width={28} height={16} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.75} />
          <rect x={30} y={26} width={18} height={13} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.6} />
          <line x1={24} y1={44} x2={150} y2={44} stroke={color.stroke} strokeWidth={1.5} />
          <rect x={150} y={42} width={4} height={7} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={20} y={44} width={4} height={8} rx={1.5} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={132} cy={68} r={13} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={132} cy={68} r={6.5} fill="#555" /><circle cx={132} cy={68} r={2.5} fill="#888" />
          <circle cx={45} cy={68} r={13} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={45} cy={68} r={6.5} fill="#555" /><circle cx={45} cy={68} r={2.5} fill="#888" />
          <ellipse cx={88} cy={83} rx={60} ry={3.5} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "skoolie_short":
      return (
        <svg width={120} height={58} viewBox="0 0 240 116" fill="none" style={s}>
          {roofAccessory(rng, 120, 240)}
          <path d="M18 14 L18 78 L218 78 L218 38 L210 25 L200 14 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M203 18 L212 27 L218 40 L218 52 L198 52 L198 18 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={158} y={26} width={24} height={22} rx={2} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.7} />
          <rect x={128} y={26} width={24} height={22} rx={2} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.7} />
          <rect x={98} y={26} width={24} height={22} rx={2} fill={color.body} stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.6} />
          <rect x={68} y={26} width={24} height={22} rx={2} fill={color.body} stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.6} />
          <line x1={20} y1={56} x2={216} y2={56} stroke={color.stroke} strokeWidth={2} />
          <rect x={216} y={48} width={5} height={10} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={15} y={54} width={4} height={12} rx={1.5} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={200} cy={83} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={200} cy={83} r={8} fill="#555" /><circle cx={200} cy={83} r={3} fill="#888" />
          <circle cx={50} cy={83} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={50} cy={83} r={8} fill="#555" /><circle cx={50} cy={83} r={3} fill="#888" />
          <circle cx={70} cy={83} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={70} cy={83} r={8} fill="#555" /><circle cx={70} cy={83} r={3} fill="#888" />
          <ellipse cx={125} cy={102} rx={100} ry={4.5} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "skoolie_long":
      return (
        <svg width={150} height={62} viewBox="0 0 300 125" fill="none" style={s}>
          {roofAccessory(rng, 150, 300)}
          <path d="M18 13 L18 82 L265 82 L265 38 L255 24 L245 13 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M248 17 L257 27 L265 42 L265 55 L242 55 L242 17 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={200} y={26} width={28} height={24} rx={2} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.7} />
          <rect x={165} y={26} width={28} height={24} rx={2} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.7} />
          <rect x={130} y={26} width={28} height={24} rx={2} fill={color.body} stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.5} />
          <rect x={95} y={26} width={28} height={24} rx={2} fill={color.body} stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.5} />
          <rect x={60} y={26} width={28} height={24} rx={2} fill={color.body} stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.5} />
          <line x1={20} y1={60} x2={263} y2={60} stroke="#F5F0E8" strokeWidth={3} strokeOpacity={0.4} />
          <rect x={263} y={50} width={5} height={12} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={15} y={55} width={5} height={14} rx={2} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={242} cy={88} r={17} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={242} cy={88} r={8.5} fill="#555" /><circle cx={242} cy={88} r={3.5} fill="#888" />
          <circle cx={55} cy={88} r={17} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={55} cy={88} r={8.5} fill="#555" /><circle cx={55} cy={88} r={3.5} fill="#888" />
          <circle cx={78} cy={88} r={17} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={78} cy={88} r={8.5} fill="#555" /><circle cx={78} cy={88} r={3.5} fill="#888" />
          <ellipse cx={155} cy={108} rx={120} ry={5} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "rv":
      return (
        <svg width={145} height={60} viewBox="0 0 290 120" fill="none" style={s}>
          <rect x={80} y={4} width={60} height={5} rx={2} fill="#9CA3AF" stroke="#6B7280" strokeWidth={1} />
          <path d="M20 10 L20 78 L255 78 L255 35 L245 20 L235 10 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M238 14 L247 23 L255 38 L255 50 L230 50 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={185} y={24} width={32} height={22} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.75} />
          <rect x={145} y={24} width={32} height={22} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.7} />
          <rect x={30} y={28} width={20} height={18} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.5} />
          <line x1={22} y1={55} x2={253} y2={55} stroke={color.stroke} strokeWidth={2} />
          <rect x={70} y={55} width={22} height={23} rx={2} fill={color.stroke} fillOpacity={0.8} />
          <rect x={253} y={45} width={5} height={10} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={17} y={55} width={5} height={12} rx={2} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={232} cy={83} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={232} cy={83} r={8} fill="#555" /><circle cx={232} cy={83} r={3} fill="#888" />
          <circle cx={55} cy={83} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={55} cy={83} r={8} fill="#555" /><circle cx={55} cy={83} r={3} fill="#888" />
          <circle cx={75} cy={83} r={16} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={75} cy={83} r={8} fill="#555" /><circle cx={75} cy={83} r={3} fill="#888" />
          <ellipse cx={148} cy={102} rx={115} ry={5} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "minivan":
      return (
        <svg width={80} height={42} viewBox="0 0 160 84" fill="none" style={s}>
          {roofAccessory(rng, 80, 160)}
          <path d="M18 20 L18 58 L145 58 L145 32 L135 22 L125 20 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M128 23 L137 28 L145 36 L145 44 L122 44 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={88} y={28} width={26} height={14} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.75} />
          <rect x={56} y={28} width={26} height={14} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.7} />
          <rect x={26} y={28} width={22} height={14} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.6} />
          <line x1={20} y1={44} x2={143} y2={44} stroke={color.stroke} strokeWidth={1.5} />
          <rect x={143} y={38} width={4} height={7} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={16} y={44} width={4} height={8} rx={1.5} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={126} cy={62} r={12} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={126} cy={62} r={6} fill="#555" /><circle cx={126} cy={62} r={2} fill="#888" />
          <circle cx={40} cy={62} r={12} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={40} cy={62} r={6} fill="#555" /><circle cx={40} cy={62} r={2} fill="#888" />
          <ellipse cx={82} cy={76} rx={62} ry={3} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "car":
      return (
        <svg width={78} height={38} viewBox="0 0 156 76" fill="none" style={s}>
          {/* Roof rack with gear */}
          <line x1={44} y1={12} x2={105} y2={12} stroke="#6B7280" strokeWidth={2} />
          <line x1={50} y1={12} x2={50} y2={16} stroke="#6B7280" strokeWidth={1.5} />
          <line x1={100} y1={12} x2={100} y2={16} stroke="#6B7280" strokeWidth={1.5} />
          <rect x={55} y={5} width={40} height={8} rx={3} fill="#78716C" fillOpacity={0.7} stroke="#57534E" strokeWidth={1} />
          <rect x={62} y={2} width={8} height={5} rx={1} fill="#92400E" fillOpacity={0.6} />
          <path d="M22 18 L22 50 L138 50 L138 30 L125 18 Z" fill={color.body} stroke={color.stroke} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M118 20 L128 24 L138 34 L138 40 L112 40 Z" fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.85} />
          <rect x={74} y={24} width={30} height={14} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.75} />
          <rect x={36} y={24} width={30} height={14} rx={3} fill="#F5F0E8" stroke={color.stroke} strokeWidth={1.5} fillOpacity={0.7} />
          <line x1={24} y1={40} x2={136} y2={40} stroke={color.stroke} strokeWidth={1.5} />
          <rect x={136} y={35} width={4} height={6} rx={2} fill="#FDE68A" stroke={color.stroke} strokeWidth={1} />
          <rect x={20} y={40} width={4} height={6} rx={1.5} fill="#EF4444" stroke={color.stroke} strokeWidth={1} />
          <circle cx={120} cy={54} r={11} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={120} cy={54} r={5.5} fill="#555" /><circle cx={120} cy={54} r={2} fill="#888" />
          <circle cx={40} cy={54} r={11} fill="#2d2d2d" stroke={color.stroke} strokeWidth={2} />
          <circle cx={40} cy={54} r={5.5} fill="#555" /><circle cx={40} cy={54} r={2} fill="#888" />
          <ellipse cx={80} cy={67} rx={55} ry={3} fill={color.body} fillOpacity={0.08} />
        </svg>
      );

    case "motorcycle":
      return (
        <svg width={60} height={38} viewBox="0 0 120 76" fill="none" style={s}>
          <rect x={12} y={20} width={22} height={18} rx={3} fill="#78716C" stroke="#57534E" strokeWidth={1.5} />
          <rect x={14} y={16} width={16} height={5} rx={2} fill="#A8A29E" stroke="#78716C" strokeWidth={1} />
          <path d="M34 36 L56 16 L78 24 L82 36" fill="none" stroke="#1a1a1a" strokeWidth={3} strokeLinejoin="round" />
          <rect x={48} y={34} width={18} height={12} rx={2} fill="#374151" stroke="#1a1a1a" strokeWidth={1.5} />
          <ellipse cx={60} cy={22} rx={16} ry={7} fill={color.body} stroke={color.stroke} strokeWidth={1.5} />
          <path d="M36 20 L56 16 L56 20 L36 24 Z" fill="#1a1a1a" stroke="#374151" strokeWidth={1} />
          <line x1={76} y1={12} x2={82} y2={6} stroke="#1a1a1a" strokeWidth={2.5} />
          <line x1={76} y1={12} x2={70} y2={6} stroke="#1a1a1a" strokeWidth={2.5} />
          <circle cx={86} cy={24} r={3.5} fill="#FDE68A" stroke="#1a1a1a" strokeWidth={1.5} />
          <path d="M82 38 Q92 34 92 44" fill="none" stroke="#374151" strokeWidth={2} />
          <path d="M32 38 Q22 34 22 44" fill="none" stroke="#374151" strokeWidth={2} />
          <circle cx={92} cy={50} r={16} fill="#2d2d2d" stroke="#1a1a1a" strokeWidth={2} />
          <circle cx={92} cy={50} r={8} fill="#555" /><circle cx={92} cy={50} r={3} fill="#888" />
          <circle cx={22} cy={50} r={16} fill="#2d2d2d" stroke="#1a1a1a" strokeWidth={2} />
          <circle cx={22} cy={50} r={8} fill="#555" /><circle cx={22} cy={50} r={3} fill="#888" />
          <ellipse cx={57} cy={68} rx={42} ry={3} fill="#1a1a1a" fillOpacity={0.06} />
        </svg>
      );
  }
}

// ─── Generate convoy data ───
function generateConvoy(seed: number, count: number) {
  const rng = seededRandom(seed);
  const vehicles: {
    def: VehicleDef;
    color: { body: string; stroke: string };
    gap: number;
    speedMul: number;
    rngSeed: number;
  }[] = [];

  for (let i = 0; i < count; i++) {
    const def = pickRandom(vehiclePool, rng);
    const isBus = def.type.startsWith("skoolie") || def.type === "rv";
    const color = pickRandom(isBus ? busColors : vanColors, rng);
    const gap = 30 + Math.floor(rng() * 80); // 30-110px gap
    const speedMul = 0.7 + rng() * 0.6; // 0.7x - 1.3x
    vehicles.push({ def, color, gap, speedMul, rngSeed: Math.floor(rng() * 100000) });
  }

  // Sort by speed ascending: slowest first (index 0), fastest last (index N).
  // Fastest vehicle gets highest cumulative offset → enters viewport first
  // and moves fastest → pulls away from slower ones → no collisions.
  vehicles.sort((a, b) => a.speedMul - b.speedMul);

  return vehicles;
}

// ─── Main Component ───
interface VehicleConvoyProps {
  seed?: number;
  count?: number;
  reverse?: boolean;
  marginTop?: string;
}

export default function VehicleConvoy({
  seed = 42,
  count = 5,
  reverse = false,
  marginTop = "20px",
}: VehicleConvoyProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const vehicleRefs = useRef<(HTMLDivElement | null)[]>([]);

  const vehicles = useMemo(
    () => generateConvoy(seed, count),
    [seed, count],
  );

  // Cumulative offsets for formation spacing
  const offsets = useMemo(() => {
    const o: number[] = [];
    let x = 0;
    for (let i = 0; i < vehicles.length; i++) {
      o.push(x);
      x += vehicles[i].def.width + vehicles[i].gap;
    }
    return o;
  }, [vehicles]);

  const totalWidth = useMemo(() => {
    if (vehicles.length === 0) return 0;
    return offsets[offsets.length - 1] + vehicles[vehicles.length - 1].def.width;
  }, [offsets, vehicles]);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const wh = window.innerHeight;
      const total = wh + rect.height;
      const traveled = wh - rect.top;
      const progress = Math.max(0, Math.min(1, traveled / total));
      const cw = sectionRef.current.offsetWidth;
      const pad = 150;
      const travelDist = cw + totalWidth + pad * 2;

      vehicleRefs.current.forEach((el, i) => {
        if (!el) return;
        const v = vehicles[i];
        const off = offsets[i];
        let x: number;
        if (reverse) {
          // Start right, move left. Fastest vehicle (highest offset) is
          // closest to viewport and enters first, then pulls away.
          x = (cw + totalWidth + pad) - off - progress * v.speedMul * travelDist;
        } else {
          // Start left, move right. Fastest vehicle (highest offset) is
          // closest to viewport and enters first, then pulls away.
          x = -(totalWidth + pad) + off + progress * v.speedMul * travelDist;
        }
        el.style.transform = `translateX(${x}px)`;
      });
    };
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [vehicles, reverse, totalWidth, offsets]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sand"
      style={{ height: "100px", marginTop }}
    >
      {/* Dashed road line */}
      <div className="absolute bottom-4 left-0 w-full">
        <svg width="100%" height="4" className="block">
          <line x1="0" y1="2" x2="100%" y2="2" stroke="#1CA288" strokeWidth="2" strokeDasharray="12 8" strokeOpacity="0.35" />
        </svg>
      </div>

      {/* Each vehicle independently positioned and animated */}
      {vehicles.map((v, i) => {
        const vRng = seededRandom(v.rngSeed);
        return (
          <div
            key={i}
            ref={(el) => { vehicleRefs.current[i] = el; }}
            className="absolute bottom-5"
            style={{ willChange: "transform" }}
          >
            {renderVehicle(v.def.type, v.color, vRng, reverse)}
          </div>
        );
      })}
    </section>
  );
}
