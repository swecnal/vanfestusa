"use client";

import { useEffect, useRef } from "react";

export default function ScrollingVan() {
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
      const x = -700 + progress * (cw + 800);
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
      style={{ height: "100px", marginTop: "20px" }}
    >
      {/* Dashed road line */}
      <div className="absolute bottom-4 left-0 w-full">
        <svg width="100%" height="4" className="block">
          <line x1="0" y1="2" x2="100%" y2="2" stroke="#1CA288" strokeWidth="2" strokeDasharray="12 8" strokeOpacity="0.35" />
        </svg>
      </div>

      {/* Vehicle convoy - scroll driven, moving right */}
      <div
        ref={convoyRef}
        className="absolute bottom-5 flex items-end gap-8"
        style={{ willChange: "transform" }}
      >
        {/* Lead Van - Sprinter with solar panels */}
        <svg width="110" height="55" viewBox="0 0 220 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="60" y="8" width="55" height="6" rx="1" fill="#1CA288" fillOpacity="0.6" stroke="#1CA288" strokeWidth="1.5" />
          <line x1="72" y1="8" x2="72" y2="14" stroke="#1CA288" strokeWidth="0.8" />
          <line x1="84" y1="8" x2="84" y2="14" stroke="#1CA288" strokeWidth="0.8" />
          <line x1="96" y1="8" x2="96" y2="14" stroke="#1CA288" strokeWidth="0.8" />
          <line x1="104" y1="8" x2="104" y2="14" stroke="#1CA288" strokeWidth="0.8" />
          <line x1="50" y1="14" x2="125" y2="14" stroke="#1CA288" strokeWidth="2" />
          <line x1="55" y1="14" x2="55" y2="20" stroke="#1CA288" strokeWidth="1.5" />
          <line x1="120" y1="14" x2="120" y2="20" stroke="#1CA288" strokeWidth="1.5" />
          <path d="M30 20 L30 75 L195 75 L195 45 L180 28 L165 20 Z" fill="#1CA288" stroke="#17806C" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M168 24 L182 32 L195 48 L195 55 L168 55 Z" fill="#F5F0E8" stroke="#17806C" strokeWidth="1.5" fillOpacity="0.85" />
          <rect x="130" y="30" width="28" height="20" rx="3" fill="#F5F0E8" stroke="#17806C" strokeWidth="1.5" fillOpacity="0.75" />
          <rect x="40" y="32" width="18" height="16" rx="3" fill="#F5F0E8" stroke="#17806C" strokeWidth="1.5" fillOpacity="0.6" />
          <line x1="32" y1="55" x2="193" y2="55" stroke="#17806C" strokeWidth="1.5" />
          <line x1="35" y1="24" x2="35" y2="75" stroke="#17806C" strokeWidth="1.2" />
          <rect x="37" y="50" width="6" height="2" rx="1" fill="#17806C" />
          <rect x="193" y="50" width="5" height="8" rx="2" fill="#FDE68A" stroke="#17806C" strokeWidth="1" />
          <rect x="28" y="55" width="4" height="10" rx="1.5" fill="#EF4444" stroke="#17806C" strokeWidth="1" />
          <path d="M190 75 L200 75 L200 80 L190 80 Z" fill="#17806C" />
          <path d="M25 75 L35 75 L35 80 L25 80 Z" fill="#17806C" />
          <circle cx="175" cy="80" r="16" fill="#2d2d2d" stroke="#17806C" strokeWidth="2" />
          <circle cx="175" cy="80" r="8" fill="#555" />
          <circle cx="175" cy="80" r="3" fill="#888" />
          <circle cx="60" cy="80" r="16" fill="#2d2d2d" stroke="#17806C" strokeWidth="2" />
          <circle cx="60" cy="80" r="8" fill="#555" />
          <circle cx="60" cy="80" r="3" fill="#888" />
          <ellipse cx="118" cy="98" rx="85" ry="4" fill="#1CA288" fillOpacity="0.08" />
          <circle cx="18" cy="72" r="4" fill="#1CA288" fillOpacity="0.15" />
          <circle cx="10" cy="68" r="3" fill="#1CA288" fillOpacity="0.1" />
          <circle cx="5" cy="64" r="2.5" fill="#1CA288" fillOpacity="0.06" />
        </svg>

        {/* Skoolie / School Bus conversion */}
        <svg width="140" height="60" viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="40" y="10" width="180" height="5" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <rect x="60" y="3" width="30" height="8" rx="2" fill="#7C3AED" fillOpacity="0.6" />
          <rect x="130" y="2" width="50" height="9" rx="2" fill="#1CA288" fillOpacity="0.5" stroke="#1CA288" strokeWidth="1" />
          <path d="M20 15 L20 80 L250 80 L250 40 L240 25 L230 15 Z" fill="#D97706" stroke="#92400E" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M233 19 L242 28 L250 42 L250 55 L228 55 L228 19 Z" fill="#F5F0E8" stroke="#92400E" strokeWidth="1.5" fillOpacity="0.85" />
          <rect x="185" y="28" width="22" height="22" rx="2" fill="#F5F0E8" stroke="#92400E" strokeWidth="1.5" fillOpacity="0.7" />
          <rect x="155" y="28" width="22" height="22" rx="2" fill="#F5F0E8" stroke="#92400E" strokeWidth="1.5" fillOpacity="0.7" />
          <rect x="125" y="28" width="22" height="22" rx="2" fill="#F5F0E8" stroke="#92400E" strokeWidth="1.5" fillOpacity="0.7" />
          <rect x="95" y="28" width="22" height="22" rx="2" fill="#B45309" stroke="#92400E" strokeWidth="1.5" fillOpacity="0.6" />
          <rect x="65" y="28" width="22" height="22" rx="2" fill="#B45309" stroke="#92400E" strokeWidth="1.5" fillOpacity="0.6" />
          <line x1="22" y1="58" x2="248" y2="58" stroke="#92400E" strokeWidth="2" />
          <rect x="248" y="50" width="5" height="10" rx="2" fill="#FDE68A" stroke="#92400E" strokeWidth="1" />
          <rect x="18" y="55" width="4" height="12" rx="1.5" fill="#EF4444" stroke="#92400E" strokeWidth="1" />
          <path d="M245 80 L255 80 L255 85 L245 85 Z" fill="#92400E" />
          <path d="M15 80 L25 80 L25 85 L15 85 Z" fill="#92400E" />
          <circle cx="230" cy="85" r="16" fill="#2d2d2d" stroke="#92400E" strokeWidth="2" />
          <circle cx="230" cy="85" r="8" fill="#555" />
          <circle cx="230" cy="85" r="3" fill="#888" />
          <circle cx="55" cy="85" r="16" fill="#2d2d2d" stroke="#92400E" strokeWidth="2" />
          <circle cx="55" cy="85" r="8" fill="#555" />
          <circle cx="55" cy="85" r="3" fill="#888" />
          <circle cx="75" cy="85" r="16" fill="#2d2d2d" stroke="#92400E" strokeWidth="2" />
          <circle cx="75" cy="85" r="8" fill="#555" />
          <circle cx="75" cy="85" r="3" fill="#888" />
          <ellipse cx="145" cy="104" rx="110" ry="5" fill="#D97706" fillOpacity="0.08" />
          <circle cx="8" cy="76" r="4" fill="#D97706" fillOpacity="0.12" />
          <circle cx="2" cy="72" r="3" fill="#D97706" fillOpacity="0.08" />
        </svg>

        {/* VW-style camper */}
        <svg width="90" height="50" viewBox="0 0 180 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 18 L50 10 L140 10 L140 18" fill="#F5F0E8" stroke="#6366F1" strokeWidth="1.5" />
          <path d="M25 18 L25 68 L160 68 L160 35 L150 22 L145 18 Z" fill="#6366F1" stroke="#4338CA" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M147 21 L152 24 L160 38 L160 50 L138 50 L138 21 Z" fill="#F5F0E8" stroke="#4338CA" strokeWidth="1.5" fillOpacity="0.85" />
          <rect x="100" y="28" width="30" height="18" rx="3" fill="#F5F0E8" stroke="#4338CA" strokeWidth="1.5" fillOpacity="0.75" />
          <rect x="32" y="28" width="20" height="14" rx="3" fill="#F5F0E8" stroke="#4338CA" strokeWidth="1.5" fillOpacity="0.6" />
          <line x1="27" y1="48" x2="158" y2="48" stroke="#4338CA" strokeWidth="1.5" />
          <line x1="95" y1="20" x2="95" y2="68" stroke="#4338CA" strokeWidth="1" />
          <rect x="91" y="45" width="3" height="6" rx="1" fill="#4338CA" />
          <rect x="158" y="45" width="4" height="7" rx="2" fill="#FDE68A" stroke="#4338CA" strokeWidth="1" />
          <rect x="23" y="48" width="4" height="8" rx="1.5" fill="#EF4444" stroke="#4338CA" strokeWidth="1" />
          <circle cx="140" cy="72" r="14" fill="#2d2d2d" stroke="#4338CA" strokeWidth="2" />
          <circle cx="140" cy="72" r="7" fill="#555" />
          <circle cx="140" cy="72" r="2.5" fill="#888" />
          <circle cx="50" cy="72" r="14" fill="#2d2d2d" stroke="#4338CA" strokeWidth="2" />
          <circle cx="50" cy="72" r="7" fill="#555" />
          <circle cx="50" cy="72" r="2.5" fill="#888" />
          <ellipse cx="95" cy="88" rx="65" ry="4" fill="#6366F1" fillOpacity="0.08" />
          <circle cx="16" cy="65" r="3" fill="#6366F1" fillOpacity="0.12" />
        </svg>

        {/* Transit / high-roof style */}
        <svg width="100" height="52" viewBox="0 0 200 105" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="80" y="10" width="25" height="4" rx="2" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1" />
          <path d="M28 14 L28 72 L180 72 L180 38 L170 24 L155 14 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M158 18 L172 28 L180 42 L180 52 L155 52 Z" fill="#F5F0E8" stroke="#991B1B" strokeWidth="1.5" fillOpacity="0.85" />
          <rect x="118" y="26" width="28" height="20" rx="3" fill="#F5F0E8" stroke="#991B1B" strokeWidth="1.5" fillOpacity="0.75" />
          <rect x="38" y="26" width="22" height="16" rx="3" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5" fillOpacity="0.5" />
          <line x1="30" y1="52" x2="178" y2="52" stroke="#991B1B" strokeWidth="1.5" />
          <line x1="33" y1="18" x2="33" y2="72" stroke="#991B1B" strokeWidth="1.2" />
          <rect x="178" y="47" width="4" height="8" rx="2" fill="#FDE68A" stroke="#991B1B" strokeWidth="1" />
          <rect x="26" y="52" width="4" height="10" rx="1.5" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
          <path d="M175 72 L185 72 L185 77 L175 77 Z" fill="#991B1B" />
          <path d="M23 72 L33 72 L33 77 L23 77 Z" fill="#991B1B" />
          <circle cx="160" cy="77" r="15" fill="#2d2d2d" stroke="#991B1B" strokeWidth="2" />
          <circle cx="160" cy="77" r="7.5" fill="#555" />
          <circle cx="160" cy="77" r="3" fill="#888" />
          <circle cx="55" cy="77" r="15" fill="#2d2d2d" stroke="#991B1B" strokeWidth="2" />
          <circle cx="55" cy="77" r="7.5" fill="#555" />
          <circle cx="55" cy="77" r="3" fill="#888" />
          <ellipse cx="108" cy="94" rx="80" ry="4" fill="#DC2626" fillOpacity="0.08" />
          <circle cx="14" cy="68" r="3.5" fill="#DC2626" fillOpacity="0.12" />
          <circle cx="7" cy="64" r="2.5" fill="#DC2626" fillOpacity="0.07" />
        </svg>
      </div>
    </section>
  );
}
