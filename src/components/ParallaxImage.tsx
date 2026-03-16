"use client";

import { useRef, useEffect, useState } from "react";

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
}

export default function ParallaxImage({ src, alt, intensity = "none", className = "" }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const speed = SPEED_MAP[intensity] || 0;

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

  if (speed === 0) {
    return <img src={src} alt={alt} className={className} />;
  }

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
          // Scale up slightly so parallax movement doesn't reveal gaps
          height: `${100 + speed * 100}%`,
          minHeight: `${100 + speed * 100}%`,
        }}
      />
    </div>
  );
}
