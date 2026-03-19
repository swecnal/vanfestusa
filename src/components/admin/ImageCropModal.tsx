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

const HANDLE_SIZE = 10;
const TOUCH_HANDLE_SIZE = 18;
const MIN_CROP = 5; // minimum 5% in each dimension

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function ImageCropModal({
  open,
  imageSrc,
  initialCrop,
  onAccept,
  onClear,
  onClose,
}: Props) {
  const [crop, setCrop] = useState<ImageCrop>(
    initialCrop && !(initialCrop.x === 0 && initialCrop.y === 0 && initialCrop.width === 100 && initialCrop.height === 100)
      ? initialCrop
      : { x: 10, y: 10, width: 80, height: 80 }
  );
  const [dragging, setDragging] = useState<DragMode | null>(null);
  const [dragStart, setDragStart] = useState<{ px: number; py: number; crop: ImageCrop } | null>(null);
  const imageAreaRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  // Reset crop state when modal opens with new data
  useEffect(() => {
    if (open) {
      setCrop(
        initialCrop && !(initialCrop.x === 0 && initialCrop.y === 0 && initialCrop.width === 100 && initialCrop.height === 100)
          ? initialCrop
          : { x: 10, y: 10, width: 80, height: 80 }
      );
      setDragging(null);
      setDragStart(null);
    }
  }, [open, initialCrop]);

  // Detect touch device
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const getImageRect = useCallback(() => {
    return imageAreaRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const pxToPercent = useCallback(
    (dx: number, dy: number) => {
      const rect = getImageRect();
      if (!rect) return { dpx: 0, dpy: 0 };
      return {
        dpx: (dx / rect.width) * 100,
        dpy: (dy / rect.height) * 100,
      };
    },
    [getImageRect]
  );

  const handlePointerDown = useCallback(
    (mode: DragMode, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(mode);
      setDragStart({ px: e.clientX, py: e.clientY, crop: { ...crop } });
    },
    [crop]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !dragStart) return;
      e.preventDefault();

      const { dpx, dpy } = pxToPercent(
        e.clientX - dragStart.px,
        e.clientY - dragStart.py
      );
      const s = dragStart.crop;

      let nx = s.x,
        ny = s.y,
        nw = s.width,
        nh = s.height;

      switch (dragging) {
        case "move":
          nx = clamp(s.x + dpx, 0, 100 - s.width);
          ny = clamp(s.y + dpy, 0, 100 - s.height);
          nw = s.width;
          nh = s.height;
          break;

        // Edges
        case "n": {
          const newY = clamp(s.y + dpy, 0, s.y + s.height - MIN_CROP);
          nh = s.height - (newY - s.y);
          ny = newY;
          break;
        }
        case "s": {
          nh = clamp(s.height + dpy, MIN_CROP, 100 - s.y);
          break;
        }
        case "w": {
          const newX = clamp(s.x + dpx, 0, s.x + s.width - MIN_CROP);
          nw = s.width - (newX - s.x);
          nx = newX;
          break;
        }
        case "e": {
          nw = clamp(s.width + dpx, MIN_CROP, 100 - s.x);
          break;
        }

        // Corners
        case "nw": {
          const newX = clamp(s.x + dpx, 0, s.x + s.width - MIN_CROP);
          const newY = clamp(s.y + dpy, 0, s.y + s.height - MIN_CROP);
          nw = s.width - (newX - s.x);
          nh = s.height - (newY - s.y);
          nx = newX;
          ny = newY;
          break;
        }
        case "ne": {
          const newY = clamp(s.y + dpy, 0, s.y + s.height - MIN_CROP);
          nw = clamp(s.width + dpx, MIN_CROP, 100 - s.x);
          nh = s.height - (newY - s.y);
          ny = newY;
          break;
        }
        case "sw": {
          const newX = clamp(s.x + dpx, 0, s.x + s.width - MIN_CROP);
          nw = s.width - (newX - s.x);
          nh = clamp(s.height + dpy, MIN_CROP, 100 - s.y);
          nx = newX;
          break;
        }
        case "se": {
          nw = clamp(s.width + dpx, MIN_CROP, 100 - s.x);
          nh = clamp(s.height + dpy, MIN_CROP, 100 - s.y);
          break;
        }
      }

      setCrop({ x: nx, y: ny, width: nw, height: nh });
    },
    [dragging, dragStart, pxToPercent]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
    setDragStart(null);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const hs = isTouch ? TOUCH_HANDLE_SIZE : HANDLE_SIZE;
  const hh = hs / 2;

  // Handle positions as CSS (relative to the selection box)
  const handles: { mode: DragMode; style: React.CSSProperties; cursor: string }[] = [
    { mode: "nw", style: { top: -hh, left: -hh }, cursor: "nwse-resize" },
    { mode: "n", style: { top: -hh, left: "50%", marginLeft: -hh }, cursor: "ns-resize" },
    { mode: "ne", style: { top: -hh, right: -hh }, cursor: "nesw-resize" },
    { mode: "e", style: { top: "50%", right: -hh, marginTop: -hh }, cursor: "ew-resize" },
    { mode: "se", style: { bottom: -hh, right: -hh }, cursor: "nwse-resize" },
    { mode: "s", style: { bottom: -hh, left: "50%", marginLeft: -hh }, cursor: "ns-resize" },
    { mode: "sw", style: { bottom: -hh, left: -hh }, cursor: "nesw-resize" },
    { mode: "w", style: { top: "50%", left: -hh, marginTop: -hh }, cursor: "ew-resize" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between w-full px-6 py-3 bg-charcoal/80 border-b border-white/10">
        <p className="text-white/60 text-sm">Drag to move, handles to resize</p>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onClear();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-colors"
          >
            Remove Crop
          </button>
          <button
            onClick={() => setCrop({ x: 0, y: 0, width: 100, height: 100 })}
            className="px-4 py-2 text-sm bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => onAccept(crop)}
            className="px-4 py-2 text-sm bg-teal text-white font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Accept
          </button>
        </div>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center p-8 w-full overflow-hidden">
        <div ref={imageAreaRef} className="relative max-w-[80vw] max-h-[80vh] select-none">
          {/* The image */}
          <img
            src={imageSrc}
            alt="Crop preview"
            className="block max-w-[80vw] max-h-[80vh] object-contain"
            draggable={false}
          />

          {/* Dark overlays — 4 regions around the selection */}
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
            style={{
              top: `${crop.y}%`,
              height: `${crop.height}%`,
              width: `${crop.x}%`,
            }}
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

          {/* Selection box */}
          <div
            className="absolute border-2 border-white/90 shadow-lg"
            style={{
              left: `${crop.x}%`,
              top: `${crop.y}%`,
              width: `${crop.width}%`,
              height: `${crop.height}%`,
              cursor: dragging === "move" ? "grabbing" : "grab",
            }}
            onPointerDown={(e) => handlePointerDown("move", e)}
          >
            {/* Rule of thirds grid lines */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/20" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/20" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/20" />
            </div>

            {/* Resize handles */}
            {handles.map((h) => (
              <div
                key={h.mode}
                className="absolute bg-white rounded-sm shadow-md border border-gray-300 z-10"
                style={{
                  width: hs,
                  height: hs,
                  cursor: h.cursor,
                  ...h.style,
                }}
                onPointerDown={(e) => handlePointerDown(h.mode, e)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <div className="px-6 py-2 bg-charcoal/80 border-t border-white/10 w-full text-center">
        <span className="text-white/40 text-xs font-mono">
          x:{crop.x.toFixed(1)}% y:{crop.y.toFixed(1)}% w:{crop.width.toFixed(1)}% h:{crop.height.toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
