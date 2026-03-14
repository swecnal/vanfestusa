"use client";

import { useRef, useState } from "react";
import type { TextStyleConfig } from "@/lib/styles";

const FONT_OPTIONS = [
  "Poppins", "Gothic A1", "EB Garamond", "Orbitron",
];

const FONT_WEIGHT_OPTIONS = [
  { label: "—", value: "" },
  { label: "300", value: "300" },
  { label: "400", value: "400" },
  { label: "500", value: "500" },
  { label: "600", value: "600" },
  { label: "700", value: "700" },
  { label: "800", value: "800" },
  { label: "900", value: "900" },
];

const TEXT_TRANSFORM_OPTIONS = [
  { label: "—", value: "" },
  { label: "Aa", value: "none" },
  { label: "AA", value: "uppercase" },
  { label: "aa", value: "lowercase" },
  { label: "Ab", value: "capitalize" },
];

interface Props {
  label: string;
  value: TextStyleConfig;
  onChange: (style: TextStyleConfig) => void;
  defaults?: Partial<TextStyleConfig>;
}

export default function TextStyleEditor({ label, value, onChange, defaults }: Props) {
  const colorRef = useRef<HTMLInputElement>(null);
  const [showExtra, setShowExtra] = useState(false);

  const update = (key: keyof TextStyleConfig, val: string) => {
    onChange({ ...value, [key]: val || undefined });
  };

  const hasOverrides = Object.values(value).some((v) => v);

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 mb-0.5">
        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide flex-1">{label}</span>
        {hasOverrides && (
          <button
            onClick={() => onChange({})}
            className="text-[9px] text-red-400 hover:text-red-600 font-semibold uppercase"
            title="Reset styles"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-gray-50 border border-gray-300 rounded-lg">
        {/* Font Family */}
        <select
          value={value.fontFamily || ""}
          onChange={(e) => update("fontFamily", e.target.value)}
          className="h-6 px-1 text-[10px] bg-white border border-gray-200 rounded cursor-pointer min-w-0"
          title={`Font${defaults?.fontFamily ? ` (default: ${defaults.fontFamily})` : ""}`}
          style={{ maxWidth: "72px" }}
        >
          <option value="">Font</option>
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Font Size */}
        <input
          type="text"
          value={value.fontSize || ""}
          onChange={(e) => update("fontSize", e.target.value)}
          className="h-6 px-1.5 text-[10px] border border-gray-200 rounded bg-white w-[52px]"
          placeholder={defaults?.fontSize ? defaults.fontSize.substring(0, 6) : "Size"}
          title={`Font size${defaults?.fontSize ? ` (default: ${defaults.fontSize})` : ""}`}
        />

        {/* Font Weight */}
        <select
          value={value.fontWeight || ""}
          onChange={(e) => update("fontWeight", e.target.value)}
          className="h-6 px-1 text-[10px] bg-white border border-gray-200 rounded cursor-pointer w-[44px]"
          title={`Weight${defaults?.fontWeight ? ` (default: ${defaults.fontWeight})` : ""}`}
        >
          <option value="">Wt</option>
          {FONT_WEIGHT_OPTIONS.filter((o) => o.value).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Color */}
        <button
          onClick={() => colorRef.current?.click()}
          className="relative h-6 w-6 rounded border border-gray-200 flex-shrink-0 overflow-hidden"
          title="Text color"
          style={{ backgroundColor: value.color || "#888888" }}
        >
          <input
            ref={colorRef}
            type="color"
            value={value.color || "#888888"}
            onChange={(e) => update("color", e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold" style={{ color: value.color ? (isLightColor(value.color) ? "#333" : "#fff") : "#fff" }}>A</span>
        </button>

        {/* Text Transform */}
        <select
          value={value.textTransform || ""}
          onChange={(e) => update("textTransform", e.target.value)}
          className="h-6 px-1 text-[10px] bg-white border border-gray-200 rounded cursor-pointer w-[36px]"
          title="Text transform"
        >
          <option value="">Tt</option>
          {TEXT_TRANSFORM_OPTIONS.filter((o) => o.value).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Toggle extra controls */}
        <button
          onClick={() => setShowExtra(!showExtra)}
          className={`h-6 w-6 flex items-center justify-center rounded border text-[10px] transition-colors ${
            showExtra ? "bg-teal/10 border-teal/30 text-teal" : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"
          }`}
          title="More options"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </button>

        {/* Extra row: letter spacing + color hex */}
        {showExtra && (
          <div className="w-full flex items-center gap-1 pt-1 border-t border-gray-200 mt-0.5">
            <span className="text-[9px] text-gray-400 flex-shrink-0">Spacing</span>
            <input
              type="text"
              value={value.letterSpacing || ""}
              onChange={(e) => update("letterSpacing", e.target.value)}
              className="h-6 px-1.5 text-[10px] border border-gray-200 rounded bg-white flex-1 min-w-0"
              placeholder="0.3em, 2px"
            />
            <span className="text-[9px] text-gray-400 flex-shrink-0">Color</span>
            <input
              type="text"
              value={value.color || ""}
              onChange={(e) => update("color", e.target.value)}
              className="h-6 px-1.5 text-[10px] border border-gray-200 rounded bg-white w-[68px]"
              placeholder="inherit"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
