"use client";

import { useEffect, useRef } from "react";

export default function ReverseConvoy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const convoyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    const update = () => {
      if (!sectionRef.current || !convoyRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const wh = window.innerHeight;
      const total = wh + rect.height;
      const traveled = wh - rect.top;
      const progress = Math.max(0, Math.min(1, traveled / total));
      const cw = sectionRef.current.offsetWidth;
      // Reverse direction: start right, move left
      const x = cw + 100 - progress * (cw + 1000);
      convoyRef.current.style.transform = `translateX(${x}px)`;
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sand"
      style={{ height: "100px" }}
    >
      {/* Dashed road line */}
      <div className="absolute bottom-4 left-0 w-full">
        <svg width="100%" height="4" className="block">
          <line x1="0" y1="2" x2="100%" y2="2" stroke="#1CA288" strokeWidth="2" strokeDasharray="12 8" strokeOpacity="0.35" />
        </svg>
      </div>

      {/* Reverse convoy - traveling left, each vehicle flipped individually */}
      <div
        ref={convoyRef}
        className="absolute bottom-5 flex items-end gap-10"
        style={{ willChange: "transform" }}
      >
        {/* Lead: Skoolie (converted school bus) - flipped to face left */}
        <svg width="150" height="62" viewBox="0 0 300 125" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
          <rect x="35" y="8" width="200" height="5" rx="2" fill="#065F46" stroke="#064E3B" strokeWidth="1.5" />
          <rect x="70" y="1" width="70" height="8" rx="2" fill="#1CA288" fillOpacity="0.5" stroke="#1CA288" strokeWidth="1" />
          <rect x="160" y="1" width="40" height="7" rx="3" fill="#E11D48" fillOpacity="0.5" />
          <path d="M18 13 L18 82 L265 82 L265 38 L255 24 L245 13 Z" fill="#065F46" stroke="#064E3B" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M248 17 L257 27 L265 42 L265 55 L242 55 L242 17 Z" fill="#F5F0E8" stroke="#064E3B" strokeWidth="1.5" fillOpacity="0.85" />
          <rect x="200" y="26" width="28" height="24" rx="2" fill="#F5F0E8" stroke="#064E3B" strokeWidth="1.5" fillOpacity="0.7" />
          <rect x="165" y="26" width="28" height="24" rx="2" fill="#F5F0E8" stroke="#064E3B" strokeWidth="1.5" fillOpacity="0.7" />
          <rect x="130" y="26" width="28" height="24" rx="2" fill="#047857" stroke="#064E3B" strokeWidth="1.5" fillOpacity="0.5" />
          <rect x="95" y="26" width="28" height="24" rx="2" fill="#047857" stroke="#064E3B" strokeWidth="1.5" fillOpacity="0.5" />
          <rect x="60" y="26" width="28" height="24" rx="2" fill="#047857" stroke="#064E3B" strokeWidth="1.5" fillOpacity="0.5" />
          <line x1="20" y1="60" x2="263" y2="60" stroke="#F5F0E8" strokeWidth="3" strokeOpacity="0.4" />
          <rect x="263" y="50" width="5" height="12" rx="2" fill="#FDE68A" stroke="#064E3B" strokeWidth="1" />
          <rect x="15" y="55" width="5" height="14" rx="2" fill="#EF4444" stroke="#064E3B" strokeWidth="1" />
          <path d="M260 82 L270 82 L270 88 L260 88 Z" fill="#064E3B" />
          <path d="M12 82 L22 82 L22 88 L12 88 Z" fill="#064E3B" />
          <circle cx="242" cy="88" r="17" fill="#2d2d2d" stroke="#064E3B" strokeWidth="2" />
          <circle cx="242" cy="88" r="8.5" fill="#555" />
          <circle cx="242" cy="88" r="3.5" fill="#888" />
          <circle cx="55" cy="88" r="17" fill="#2d2d2d" stroke="#064E3B" strokeWidth="2" />
          <circle cx="55" cy="88" r="8.5" fill="#555" />
          <circle cx="55" cy="88" r="3.5" fill="#888" />
          <circle cx="78" cy="88" r="17" fill="#2d2d2d" stroke="#064E3B" strokeWidth="2" />
          <circle cx="78" cy="88" r="8.5" fill="#555" />
          <circle cx="78" cy="88" r="3.5" fill="#888" />
          <ellipse cx="155" cy="108" rx="120" ry="5" fill="#065F46" fillOpacity="0.08" />
          <circle cx="6" cy="78" r="4" fill="#065F46" fillOpacity="0.1" />
        </svg>

        {/* Van 1 - Promaster style - flipped */}
        <svg width="100" height="52" viewBox="0 0 200 105" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
          <circle cx="100" cy="10" r="6" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1.5" />
          <path d="M25 14 L25 72 L178 72 L178 38 L168 24 L155 14 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M158 18 L170 28 L178 42 L178 52 L152 52 Z" fill="#F5F0E8" stroke="#D97706" strokeWidth="1.5" fillOpacity="0.85" />
          <rect x="115" y="26" width="28" height="20" rx="3" fill="#F5F0E8" stroke="#D97706" strokeWidth="1.5" fillOpacity="0.75" />
          <line x1="27" y1="50" x2="176" y2="50" stroke="#D97706" strokeWidth="1.5" />
          <rect x="176" y="45" width="4" height="8" rx="2" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
          <rect x="23" y="50" width="4" height="10" rx="1.5" fill="#EF4444" stroke="#D97706" strokeWidth="1" />
          <circle cx="158" cy="77" r="15" fill="#2d2d2d" stroke="#D97706" strokeWidth="2" />
          <circle cx="158" cy="77" r="7.5" fill="#555" />
          <circle cx="158" cy="77" r="3" fill="#888" />
          <circle cx="52" cy="77" r="15" fill="#2d2d2d" stroke="#D97706" strokeWidth="2" />
          <circle cx="52" cy="77" r="7.5" fill="#555" />
          <circle cx="52" cy="77" r="3" fill="#888" />
          <ellipse cx="105" cy="94" rx="78" ry="4" fill="#F59E0B" fillOpacity="0.08" />
          <circle cx="15" cy="68" r="3" fill="#F59E0B" fillOpacity="0.1" />
        </svg>

        {/* Van 2 - Smaller Transit - flipped */}
        <svg width="90" height="48" viewBox="0 0 180 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
          <path d="M22 16 L22 65 L162 65 L162 35 L154 22 L142 16 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M144 19 L156 28 L162 38 L162 48 L138 48 Z" fill="#F5F0E8" stroke="#6D28D9" strokeWidth="1.5" fillOpacity="0.85" />
          <rect x="100" y="26" width="30" height="18" rx="3" fill="#F5F0E8" stroke="#6D28D9" strokeWidth="1.5" fillOpacity="0.75" />
          <line x1="24" y1="46" x2="160" y2="46" stroke="#6D28D9" strokeWidth="1.5" />
          <rect x="160" y="42" width="4" height="7" rx="2" fill="#FDE68A" stroke="#6D28D9" strokeWidth="1" />
          <rect x="20" y="46" width="4" height="9" rx="1.5" fill="#EF4444" stroke="#6D28D9" strokeWidth="1" />
          <circle cx="142" cy="70" r="13" fill="#2d2d2d" stroke="#6D28D9" strokeWidth="2" />
          <circle cx="142" cy="70" r="6.5" fill="#555" />
          <circle cx="142" cy="70" r="2.5" fill="#888" />
          <circle cx="48" cy="70" r="13" fill="#2d2d2d" stroke="#6D28D9" strokeWidth="2" />
          <circle cx="48" cy="70" r="6.5" fill="#555" />
          <circle cx="48" cy="70" r="2.5" fill="#888" />
          <ellipse cx="95" cy="85" rx="68" ry="3.5" fill="#8B5CF6" fillOpacity="0.08" />
        </svg>

        {/* Motorcycle - loaded for touring - flipped */}
        <svg width="65" height="42" viewBox="0 0 130 84" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: "scaleX(-1)" }}>
          <rect x="15" y="22" width="25" height="20" rx="3" fill="#78716C" stroke="#57534E" strokeWidth="1.5" />
          <rect x="18" y="18" width="18" height="6" rx="2" fill="#A8A29E" stroke="#78716C" strokeWidth="1" />
          <path d="M40 40 L65 18 L90 28 L95 40" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
          <rect x="55" y="38" width="20" height="14" rx="2" fill="#374151" stroke="#1a1a1a" strokeWidth="1.5" />
          <ellipse cx="70" cy="24" rx="18" ry="8" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <path d="M42 22 L66 18 L66 22 L42 26 Z" fill="#1a1a1a" stroke="#374151" strokeWidth="1" />
          <line x1="88" y1="14" x2="95" y2="8" stroke="#1a1a1a" strokeWidth="2.5" />
          <line x1="88" y1="14" x2="82" y2="8" stroke="#1a1a1a" strokeWidth="2.5" />
          <circle cx="100" cy="28" r="4" fill="#FDE68A" stroke="#1a1a1a" strokeWidth="1.5" />
          <path d="M95 42 Q108 38 108 50" fill="none" stroke="#374151" strokeWidth="2" />
          <path d="M38 42 Q25 38 25 50" fill="none" stroke="#374151" strokeWidth="2" />
          <path d="M45 52 L60 52 L62 48" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="108" cy="56" r="18" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="108" cy="56" r="9" fill="#555" />
          <circle cx="108" cy="56" r="3.5" fill="#888" />
          <circle cx="25" cy="56" r="18" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="2" />
          <circle cx="25" cy="56" r="9" fill="#555" />
          <circle cx="25" cy="56" r="3.5" fill="#888" />
          <ellipse cx="66" cy="76" rx="50" ry="3" fill="#1a1a1a" fillOpacity="0.06" />
        </svg>
      </div>
    </section>
  );
}
