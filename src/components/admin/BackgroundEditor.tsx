"use client";

import { useRef, useState, useCallback } from "react";
import type { BackgroundConfig, ImageCrop } from "@/lib/types";
import ImagePicker from "./ImagePicker";

const BG_TYPES = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
] as const;

const SIZING_OPTIONS = [
  { value: "cover", label: "Fit to Section" },
  { value: "contain", label: "Contain" },
  { value: "stretch", label: "Stretch" },
  { value: "tile", label: "Tile" },
  { value: "full", label: "Full Width" },
] as const;

interface Props {
  value: BackgroundConfig | undefined;
  onChange: (config: BackgroundConfig | undefined) => void;
}

export default function BackgroundEditor({ value, onChange }: Props) {
  const config = value || { type: "none" as const };
  const solidColorRef = useRef<HTMLInputElement>(null);

  // Use a ref to track the latest config to avoid stale closure issues
  // when multiple update() calls happen before React re-renders
  const latestConfig = useRef(config);
  latestConfig.current = config;

  const update = useCallback((patch: Partial<BackgroundConfig>) => {
    const merged = { ...latestConfig.current, ...patch };
    latestConfig.current = merged;
    onChange(merged);
  }, [onChange]);

  const updateGradientColor = (index: number, patch: Partial<{ color: string; opacity: number }>) => {
    const colors = [...(config.gradientColors || [{ color: "#ffffff", opacity: 100 }, { color: "#000000", opacity: 100 }])];
    colors[index] = { ...colors[index], ...patch };
    update({ gradientColors: colors });
  };

  return (
    <div>
      <label className="block text-[11px] font-medium text-gray-600 mb-1">Background</label>

      {/* Type selector pills */}
      <div className="flex gap-1 mb-2">
        {BG_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              if (t.value === "none") {
                onChange(undefined);
              } else {
                const base: BackgroundConfig = { type: t.value };
                if (t.value === "solid") base.solidColor = config.solidColor || "#ffffff";
                if (t.value === "gradient") {
                  base.gradientType = config.gradientType || "linear";
                  base.gradientAngle = config.gradientAngle ?? 180;
                  base.gradientColors = config.gradientColors || [
                    { color: "#ffffff", opacity: 100 },
                    { color: "#000000", opacity: 100 },
                  ];
                }
                if (t.value === "image") {
                  base.imageUrl = config.imageUrl || "";
                  base.imageSizing = config.imageSizing || "cover";
                  base.imageOpacity = config.imageOpacity ?? 100;
                }
                onChange(base);
              }
            }}
            className={`flex-1 text-[10px] py-1 rounded border transition-colors ${
              config.type === t.value
                ? "bg-teal/15 border-teal text-teal font-semibold"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Solid Color */}
      {config.type === "solid" && (
        <div className="space-y-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <ColorPickerRow
            label="Color"
            value={config.solidColor || "#ffffff"}
            onChange={(c) => update({ solidColor: c })}
          />
        </div>
      )}

      {/* Gradient */}
      {config.type === "gradient" && (
        <div className="space-y-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          {/* Linear / Radial toggle */}
          <div className="flex gap-1">
            {(["linear", "radial"] as const).map((gt) => (
              <button
                key={gt}
                onClick={() => update({ gradientType: gt })}
                className={`flex-1 text-[10px] py-1 rounded border transition-colors capitalize ${
                  (config.gradientType || "linear") === gt
                    ? "bg-teal/15 border-teal text-teal font-semibold"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {gt}
              </button>
            ))}
          </div>

          {/* Angle (linear only) */}
          {(config.gradientType || "linear") === "linear" && (
            <div>
              <label className="text-[9px] text-gray-400">Angle: {config.gradientAngle ?? 180}°</label>
              <input
                type="range"
                min={0}
                max={360}
                value={config.gradientAngle ?? 180}
                onChange={(e) => update({ gradientAngle: Number(e.target.value) })}
                className="w-full h-1.5 accent-teal"
              />
            </div>
          )}

          {/* Color stops */}
          {(config.gradientColors || [{ color: "#ffffff", opacity: 100 }, { color: "#000000", opacity: 100 }]).map((stop, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-1">
                <ColorPickerRow
                  label={`Color ${i + 1}`}
                  value={stop.color}
                  onChange={(c) => updateGradientColor(i, { color: c })}
                />
                {(config.gradientColors?.length || 2) > 2 && (
                  <button
                    onClick={() => {
                      const colors = [...(config.gradientColors || [])];
                      colors.splice(i, 1);
                      update({ gradientColors: colors });
                    }}
                    className="text-red-400 hover:text-red-600 text-[10px] flex-shrink-0 mt-3"
                    title="Remove"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div>
                <label className="text-[9px] text-gray-400">Opacity: {stop.opacity ?? 100}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.opacity ?? 100}
                  onChange={(e) => updateGradientColor(i, { opacity: Number(e.target.value) })}
                  className="w-full h-1.5 accent-teal"
                />
              </div>
            </div>
          ))}

          {/* Add color stop */}
          {(config.gradientColors?.length || 2) < 3 && (
            <button
              onClick={() => {
                const colors = [...(config.gradientColors || [{ color: "#ffffff", opacity: 100 }, { color: "#000000", opacity: 100 }])];
                colors.push({ color: "#888888", opacity: 100 });
                update({ gradientColors: colors });
              }}
              className="text-[10px] text-teal hover:text-teal-dark font-medium"
            >
              + Add Color Stop
            </button>
          )}

          {/* Reverse */}
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={config.gradientReverse || false}
              onChange={(e) => update({ gradientReverse: e.target.checked })}
              className="accent-teal w-3 h-3"
            />
            <span className="text-[10px] text-gray-600">Reverse</span>
          </label>

          {/* Gradient preview */}
          <GradientPreview config={config} />
        </div>
      )}

      {/* Image */}
      {config.type === "image" && (
        <div className="space-y-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-[10px] text-gray-400">Ideal: 1920x800px or wider. Use &quot;Fit to Section&quot; for full-bleed hero backgrounds.</p>
          <ImagePicker
            value={config.imageUrl || ""}
            onChange={(url) => update({ imageUrl: url, imageCrop: undefined })}
            cropValue={(config.imageCrop as ImageCrop) || null}
            onCropChange={(crop) => update({ imageCrop: crop || undefined })}
          />
          <div>
            <label className="text-[9px] text-gray-400">Sizing</label>
            <select
              value={config.imageSizing || "cover"}
              onChange={(e) => update({ imageSizing: e.target.value as BackgroundConfig["imageSizing"] })}
              className="w-full h-6 px-1 text-[10px] bg-white border border-gray-200 rounded cursor-pointer"
            >
              {SIZING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[9px] text-gray-400">Image Opacity: {config.imageOpacity ?? 100}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={config.imageOpacity ?? 100}
              onChange={(e) => update({ imageOpacity: Number(e.target.value) })}
              className="w-full h-1.5 accent-teal"
            />
          </div>
          {/* Overlay */}
          <div className="border-t border-gray-200 pt-2 mt-1 space-y-1.5">
            <label className="text-[9px] text-gray-400 font-medium">Color Overlay</label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={config.overlayColor || "#000000"}
                onChange={(e) => update({ overlayColor: e.target.value, overlayOpacity: config.overlayOpacity || 30 })}
                className="w-6 h-5 rounded border border-gray-200 cursor-pointer p-0"
              />
              <input
                type="text"
                value={config.overlayColor || "#000000"}
                onChange={(e) => update({ overlayColor: e.target.value })}
                className="flex-1 h-5 text-[9px] border border-gray-200 rounded px-1 bg-white"
                placeholder="#000000"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-400">Overlay Opacity: {config.overlayOpacity ?? 0}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={config.overlayOpacity ?? 0}
                onChange={(e) => update({ overlayOpacity: Number(e.target.value), overlayColor: config.overlayColor || "#000000" })}
                className="w-full h-1.5 accent-teal"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Color Picker Row ───

function ColorPickerRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex-1">
      <label className="text-[9px] text-gray-400">{label}</label>
      <div className="flex items-center gap-1">
        <button
          onClick={() => ref.current?.click()}
          className="relative h-6 w-6 rounded border border-gray-200 flex-shrink-0 overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            ref={ref}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 px-1.5 text-[10px] border border-gray-200 rounded bg-white flex-1 min-w-0"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

// ─── Gradient Preview ───

function GradientPreview({ config }: { config: BackgroundConfig }) {
  let colors = config.gradientColors || [{ color: "#ffffff", opacity: 100 }, { color: "#000000", opacity: 100 }];
  if (config.gradientReverse) colors = [...colors].reverse();
  const stops = colors.map((c) => {
    const op = (c.opacity ?? 100) / 100;
    if (op < 1) {
      const hex = c.color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${op})`;
    }
    return c.color;
  }).join(", ");

  const bg = (config.gradientType || "linear") === "radial"
    ? `radial-gradient(circle, ${stops})`
    : `linear-gradient(${config.gradientAngle ?? 180}deg, ${stops})`;

  return (
    <div
      className="w-full h-8 rounded border border-gray-200"
      style={{ background: bg }}
    />
  );
}
