"use client";

import { useRef, useEffect, useState } from "react";
import type { ImageCrop } from "@/lib/types";
import { isEffectiveCrop, cropToBackgroundStyles } from "@/lib/crop-utils";

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
}

export default function ParallaxImage({ src, alt, intensity = "none", className = "", crop }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const speed = SPEED_MAP[intensity] || 0;
  const hasCrop = isEffectiveCrop(crop);

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

  // No parallax, no crop
  if (speed === 0 && !hasCrop) {
    return <img src={src} alt={alt} className={className} />;
  }

  // No parallax but has crop — render as background-image div
  if (speed === 0 && hasCrop && crop) {
    const bgStyles = cropToBackgroundStyles(crop);
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: bgStyles.backgroundSize,
          backgroundPosition: bgStyles.backgroundPosition,
          backgroundRepeat: "no-repeat",
        }}
      />
    );
  }

  // Parallax with crop — background-image div with transform
  if (hasCrop && crop) {
    const bgStyles = cropToBackgroundStyles(crop);
    return (
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <div
          role="img"
          aria-label={alt}
          className={className}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: bgStyles.backgroundSize,
            backgroundPosition: bgStyles.backgroundPosition,
            backgroundRepeat: "no-repeat",
            transform: `translateY(${offset}px)`,
            willChange: "transform",
            height: `${100 + speed * 100}%`,
            minHeight: `${100 + speed * 100}%`,
          }}
        />
      </div>
    );
  }

  // Parallax without crop — original behavior
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        style={{
          transform: `translateY(${offset}px)`,
          willChange: "transform",
          height: `${100 + speed * 100}%`,
          minHeight: `${100 + speed * 100}%`,
        }}
      />
    </div>
  );
}
