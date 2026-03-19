"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { ImageCrop } from "@/lib/types";

interface Props {
  open: boolean;
  imageSrc: string;
  initialCrop?: ImageCrop | null;
  onAccept: (crop: ImageCrop) => void;
  onClear: () => void;
  onClose: () => void;
}

type DragMode = "move" | "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

const MIN_PCT = 5; // min 5% in each dimension

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function ImageCropModal({ open, imageSrc, initialCrop, onAccept, onClear, onClose }: Props) {
  // ── state ──
  const [crop, setCrop] = useState<ImageCrop>({ x: 10, y: 10, width: 80, height: 80 });
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number } | null>(null);
  const [dragging, setDragging] = useState<DragMode | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; startCrop: ImageCrop } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Reset when modal opens
  useEffect(() => {
    if (!open) return;
    setDragging(null);
    dragRef.current = null;
    setImgSize(null);
    setContainerSize(null);
    const ic = initialCrop;
    if (ic && !(ic.x === 0 && ic.y === 0 && ic.width === 100 && ic.height === 100)) {
      setCrop({ ...ic });
    } else {
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
    }
  }, [open, initialCrop]);

  // Load image to get natural dimensions, then compute fit size
  useEffect(() => {
    if (!open || !imageSrc) return;
    const img = new Image();
    img.onload = () => {
      setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = imageSrc;
  }, [open, imageSrc]);

  // Calculate fitted container size when image loads or window resizes
  useEffect(() => {
    if (!imgSize || !wrapRef.current) return;

    const calc = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const pad = 48; // padding around image
      const maxW = wrap.clientWidth - pad * 2;
      const maxH = wrap.clientHeight - pad * 2;
      const ratio = imgSize.w / imgSize.h;
      let w = maxW;
      let h = w / ratio;
      if (h > maxH) {
        h = maxH;
        w = h * ratio;
      }
      setContainerSize({ w: Math.round(w), h: Math.round(h) });
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [imgSize]);

  // ── pointer helpers ──
  const toPercent = useCallback(
    (dx: number, dy: number) => {
      if (!containerSize) return { dpx: 0, dpy: 0 };
      return {
        dpx: (dx / containerSize.w) * 100,
        dpy: (dy / containerSize.h) * 100,
      };
    },
    [containerSize]
  );

  const onPointerDown = useCallback(
    (mode: DragMode, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(mode);
      dragRef.current = { startX: e.clientX, startY: e.clientY, startCrop: { ...crop } };
    },
    [crop]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !dragRef.current) return;
      e.preventDefault();

      const { dpx, dpy } = toPercent(
        e.clientX - dragRef.current.startX,
        e.clientY - dragRef.current.startY
      );
      const s = dragRef.current.startCrop;
      let nx = s.x, ny = s.y, nw = s.width, nh = s.height;

      switch (dragging) {
        case "move":
          nx = clamp(s.x + dpx, 0, 100 - s.width);
          ny = clamp(s.y + dpy, 0, 100 - s.height);
          break;
        case "n": {
          const newY = clamp(s.y + dpy, 0, s.y + s.height - MIN_PCT);
          nh = s.height - (newY - s.y);
          ny = newY;
          break;
        }
        case "s":
          nh = clamp(s.height + dpy, MIN_PCT, 100 - s.y);
          break;
        case "w": {
          const newX = clamp(s.x + dpx, 0, s.x + s.width - MIN_PCT);
          nw = s.width - (newX - s.x);
          nx = newX;
          break;
        }
        case "e":
          nw = clamp(s.width + dpx, MIN_PCT, 100 - s.x);
          break;
        case "nw": {
          const newX = clamp(s.x + dpx, 0, s.x + s.width - MIN_PCT);
          const newY = clamp(s.y + dpy, 0, s.y + s.height - MIN_PCT);
          nw = s.width - (newX - s.x);
          nh = s.height - (newY - s.y);
          nx = newX;
          ny = newY;
          break;
        }
        case "ne": {
          const newY = clamp(s.y + dpy, 0, s.y + s.height - MIN_PCT);
          nw = clamp(s.width + dpx, MIN_PCT, 100 - s.x);
          nh = s.height - (newY - s.y);
          ny = newY;
          break;
        }
        case "sw": {
          const newX = clamp(s.x + dpx, 0, s.x + s.width - MIN_PCT);
          nw = s.width - (newX - s.x);
          nh = clamp(s.height + dpy, MIN_PCT, 100 - s.y);
          nx = newX;
          break;
        }
        case "se":
          nw = clamp(s.width + dpx, MIN_PCT, 100 - s.x);
          nh = clamp(s.height + dpy, MIN_PCT, 100 - s.y);
          break;
      }
      setCrop({ x: nx, y: ny, width: nw, height: nh });
    },
    [dragging, toPercent]
  );

  const onPointerUp = useCallback(() => {
    setDragging(null);
    dragRef.current = null;
  }, []);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  // Handle sizes
  const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const hs = isTouch ? 20 : 12;

  const handles: { mode: DragMode; style: React.CSSProperties; cursor: string }[] = [
    { mode: "nw", style: { top: -(hs / 2), left: -(hs / 2) }, cursor: "nwse-resize" },
    { mode: "n", style: { top: -(hs / 2), left: "50%", transform: "translateX(-50%)" }, cursor: "ns-resize" },
    { mode: "ne", style: { top: -(hs / 2), right: -(hs / 2) }, cursor: "nesw-resize" },
    { mode: "e", style: { top: "50%", right: -(hs / 2), transform: "translateY(-50%)" }, cursor: "ew-resize" },
    { mode: "se", style: { bottom: -(hs / 2), right: -(hs / 2) }, cursor: "nwse-resize" },
    { mode: "s", style: { bottom: -(hs / 2), left: "50%", transform: "translateX(-50%)" }, cursor: "ns-resize" },
    { mode: "sw", style: { bottom: -(hs / 2), left: -(hs / 2) }, cursor: "nesw-resize" },
    { mode: "w", style: { top: "50%", left: -(hs / 2), transform: "translateY(-50%)" }, cursor: "ew-resize" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-[#1a1a2e]"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#16213e] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-white/90 text-sm font-semibold">Crop Image</span>
          <span className="text-white/30 text-xs font-mono">
            {crop.x.toFixed(0)}%, {crop.y.toFixed(0)}% — {crop.width.toFixed(0)}% × {crop.height.toFixed(0)}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="px-4 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Remove Crop
          </button>
          <button
            onClick={() => setCrop({ x: 0, y: 0, width: 100, height: 100 })}
            className="px-4 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => onAccept(crop)}
            className="px-5 py-1.5 text-sm bg-teal text-white font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Apply Crop
          </button>
        </div>
      </div>

      {/* ── Image workspace ── */}
      <div ref={wrapRef} className="flex-1 flex items-center justify-center overflow-hidden select-none">
        {!containerSize ? (
          <div className="text-white/40 text-sm">Loading image…</div>
        ) : (
          <div
            ref={containerRef}
            className="relative"
            style={{ width: containerSize.w, height: containerSize.h }}
          >
            {/* Actual image */}
            <img
              src={imageSrc}
              alt="Crop preview"
              className="absolute inset-0 w-full h-full"
              style={{ objectFit: "fill" }}
              draggable={false}
            />

            {/* Dark overlays (4 regions outside selection) */}
            {/* Top */}
            <div
              className="absolute left-0 right-0 top-0 bg-black/60 pointer-events-none"
              style={{ height: `${crop.y}%` }}
            />
            {/* Bottom */}
            <div
              className="absolute left-0 right-0 bottom-0 bg-black/60 pointer-events-none"
              style={{ height: `${100 - crop.y - crop.height}%` }}
            />
            {/* Left */}
            <div
              className="absolute left-0 bg-black/60 pointer-events-none"
              style={{ top: `${crop.y}%`, height: `${crop.height}%`, width: `${crop.x}%` }}
            />
            {/* Right */}
            <div
              className="absolute right-0 bg-black/60 pointer-events-none"
              style={{
                top: `${crop.y}%`,
                height: `${crop.height}%`,
                width: `${100 - crop.x - crop.width}%`,
              }}
            />

            {/* ── Selection box ── */}
            <div
              className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
                cursor: dragging === "move" ? "grabbing" : "grab",
              }}
              onPointerDown={(e) => onPointerDown("move", e)}
            >
              {/* Rule-of-thirds grid */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/30" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/30" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/30" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/30" />
              </div>

              {/* Resize handles */}
              {handles.map((h) => (
                <div
                  key={h.mode}
                  className="absolute bg-white rounded-full shadow-md border border-gray-400/50 z-10 hover:scale-125 transition-transform"
                  style={{ width: hs, height: hs, cursor: h.cursor, ...h.style }}
                  onPointerDown={(e) => onPointerDown(h.mode, e)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom hint ── */}
      <div className="px-5 py-2 bg-[#16213e] border-t border-white/10 text-center shrink-0">
        <span className="text-white/30 text-xs">Drag to reposition · Drag handles to resize · Esc to cancel</span>
      </div>
    </div>
  );
}
