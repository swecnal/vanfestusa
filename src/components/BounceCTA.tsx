"use client";

import { useEffect, useRef } from "react";

interface BounceCTAProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function BounceCTA({ href, children, className = "", target, rel }: BounceCTAProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Random duration between 2-5s, random delay 0-3s
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 3;
    ref.current.style.animationDuration = `${duration}s`;
    ref.current.style.animationDelay = `${delay}s`;
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className={`animate-bounce-attention ${className}`}
    >
      {children}
    </a>
  );
}
