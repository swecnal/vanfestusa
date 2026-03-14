"use client";

import { useState } from "react";
import type { TextStyleConfig } from "@/lib/styles";

const FONT_OPTIONS = [
  "inherit", "Poppins", "Gothic A1", "EB Garamond", "Orbitron",
];

const FONT_WEIGHT_OPTIONS = [
  { label: "Inherit", value: "" },
  { label: "Light (300)", value: "300" },
  { label: "Normal (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semibold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
  { label: "Black (900)", value: "900" },
];

const TEXT_TRANSFORM_OPTIONS = [
  { label: "Inherit", value: "" },
  { label: "None", value: "none" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

interface Props {
  label: string;
  value: TextStyleConfig;
  onChange: (style: TextStyleConfig) => void;
  defaults?: Partial<TextStyleConfig>;
}

export default function TextStyleEditor({ label, value, onChange, defaults }: Props) {
  const [open, setOpen] = useState(false);

  const update = (key: keyof TextStyleConfig, val: string) => {
    onChange({ ...value, [key]: val || undefined });
  };

  const hasOverrides = Object.values(value).some((v) => v);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors"
      >
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-90" : ""}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
        </svg>
        <span className="font-semibold text-gray-500">{label}</span>
        {hasOverrides && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="p-3 space-y-2.5 border-t border-gray-100 bg-gray-50/50">
          {/* Font Family */}
          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-0.5">
              Font{defaults?.fontFamily ? <span className="text-gray-300 normal-case ml-1">(default: {defaults.fontFamily})</span> : ""}
            </label>
            <select
              value={value.fontFamily || ""}
              onChange={(e) => update("fontFamily", e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            >
              <option value="">{defaults?.fontFamily ? `Inherit (${defaults.fontFamily})` : "Inherit"}</option>
              {FONT_OPTIONS.filter((f) => f !== "inherit").map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-0.5">
              Size{defaults?.fontSize ? <span className="text-gray-300 normal-case ml-1">(default: {defaults.fontSize})</span> : ""}
            </label>
            <input
              type="text"
              value={value.fontSize || ""}
              onChange={(e) => update("fontSize", e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs"
              placeholder={defaults?.fontSize || "e.g. 24px, 2rem, clamp(...)"}
            />
          </div>

          {/* Font Weight */}
          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-0.5">
              Weight{defaults?.fontWeight ? <span className="text-gray-300 normal-case ml-1">(default: {defaults.fontWeight})</span> : ""}
            </label>
            <select
              value={value.fontWeight || ""}
              onChange={(e) => update("fontWeight", e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            >
              {FONT_WEIGHT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.value === "" && defaults?.fontWeight
                    ? `Inherit (${FONT_WEIGHT_OPTIONS.find((fw) => fw.value === defaults.fontWeight)?.label || defaults.fontWeight})`
                    : o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-0.5">Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={value.color || "#ffffff"}
                onChange={(e) => update("color", e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={value.color || ""}
                onChange={(e) => update("color", e.target.value)}
                className="flex-1 p-1.5 border border-gray-300 rounded text-xs"
                placeholder="inherit"
              />
            </div>
          </div>

          {/* Text Transform */}
          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-0.5">Transform</label>
            <select
              value={value.textTransform || ""}
              onChange={(e) => update("textTransform", e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
            >
              {TEXT_TRANSFORM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Letter Spacing */}
          <div>
            <label className="text-[10px] text-gray-400 uppercase block mb-0.5">Letter Spacing</label>
            <input
              type="text"
              value={value.letterSpacing || ""}
              onChange={(e) => update("letterSpacing", e.target.value)}
              className="w-full p-1.5 border border-gray-300 rounded text-xs"
              placeholder="e.g. 0.3em, 2px, normal"
            />
          </div>

          {/* Reset */}
          {hasOverrides && (
            <button
              onClick={() => onChange({})}
              className="text-red-400 hover:text-red-600 text-[10px] font-semibold uppercase tracking-wider"
            >
              Reset to default
            </button>
          )}
        </div>
      )}
    </div>
  );
}
