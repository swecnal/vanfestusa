"use client";

import { useRef, useEffect, useState } from "react";
import type { ImageCrop, ImageFit } from "@/lib/types";
import { isEffectiveCrop } from "@/lib/crop-utils";

export type ParallaxIntensity = "none" | "light" | "medium" | "strong";

const SPEED_MAP: Record<ParallaxIntensity, number> = {
  none: 0,
  light: 0.1,
  medium: 0.25,
  strong: 0.45,
};

interface Props {
  src: string;
  alt: string;
  intensity?: ParallaxIntensity;
  className?: string;
  crop?: ImageCrop | null;
  imageFit?: ImageFit;
}

function cropToViewBox(crop: ImageCrop): string {
  const top = crop.y;
  const right = 100 - crop.x - crop.width;
  const bottom = 100 - crop.y - crop.height;
  const left = crop.x;
  return `inset(${top.toFixed(2)}% ${right.toFixed(2)}% ${bottom.toFixed(2)}% ${left.toFixed(2)}%)`;
}

export default function ParallaxImage({ src, alt, intensity = "none", className = "", crop, imageFit }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const speed = SPEED_MAP[intensity] || 0;
  const hasCrop = isEffectiveCrop(crop);
  const fit = imageFit || "cover";
  const objectFit = fit === "fill" ? ("fill" as const) : fit;

  useEffect(() => {
    if (speed === 0) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setOffset(scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  const imgStyle: React.CSSProperties = {
    objectFit,
    ...(hasCrop && crop ? { objectViewBox: cropToViewBox(crop) } : {}),
  } as React.CSSProperties;

  // No parallax
  if (speed === 0) {
    return <img src={src} alt={alt} className={className} style={imgStyle} />;
  }

  // Parallax — wrap in overflow container with transform
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        style={{
          ...imgStyle,
          transform: `translateY(${offset}px)`,
          willChange: "transform",
          height: `${100 + speed * 100}%`,
          minHeight: `${100 + speed * 100}%`,
        } as React.CSSProperties}
      />
    </div>
  );
}
