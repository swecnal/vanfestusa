"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollingVan() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [vanX, setVanX] = useState(-120);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how far through the viewport the section has traveled
      // When top of section enters bottom of viewport: progress = 0
      // When bottom of section exits top of viewport: progress = 1
      const sectionHeight = rect.height;
      const totalTravel = windowHeight + sectionHeight;
      const distanceTraveled = windowHeight - rect.top;
      const progress = Math.max(0, Math.min(1, distanceTraveled / totalTravel));

      // Map progress to X position: from -120px (off left) to container width + 120px (off right)
      const containerWidth = sectionRef.current.offsetWidth;
      const startX = -120;
      const endX = containerWidth + 120;
      setVanX(startX + progress * (endX - startX));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-sand"
      style={{ height: "80px" }}
    >
      {/* Dashed road line */}
      <div className="absolute bottom-4 left-0 w-full">
        <svg width="100%" height="4" className="block">
          <line
            x1="0"
            y1="2"
            x2="100%"
            y2="2"
            stroke="#1CA288"
            strokeWidth="2"
            strokeDasharray="12 8"
            strokeOpacity="0.35"
          />
        </svg>
      </div>

      {/* Scrolling van */}
      <div
        className="absolute bottom-5"
        style={{
          transform: `translateX(${vanX}px)`,
          willChange: "transform",
          transition: "transform 0.05s linear",
        }}
      >
        {/* Mercedes Sprinter Van - Side Profile SVG */}
        <svg
          width="110"
          height="55"
          viewBox="0 0 220 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Solar panels on roof */}
          <rect
            x="60"
            y="8"
            width="55"
            height="6"
            rx="1"
            fill="#1CA288"
            fillOpacity="0.6"
            stroke="#1CA288"
            strokeWidth="1.5"
          />
          <line x1="72" y1="8" x2="72" y2="14" stroke="#1CA288" strokeWidth="0.8" />
          <line x1="84" y1="8" x2="84" y2="14" stroke="#1CA288" strokeWidth="0.8" />
          <line x1="96" y1="8" x2="96" y2="14" stroke="#1CA288" strokeWidth="0.8" />
          <line x1="104" y1="8" x2="104" y2="14" stroke="#1CA288" strokeWidth="0.8" />

          {/* Roof rack bars */}
          <line x1="50" y1="14" x2="125" y2="14" stroke="#1CA288" strokeWidth="2" />
          <line x1="55" y1="14" x2="55" y2="20" stroke="#1CA288" strokeWidth="1.5" />
          <line x1="120" y1="14" x2="120" y2="20" stroke="#1CA288" strokeWidth="1.5" />

          {/* Main body - Sprinter proportions: high roof, long body */}
          <path
            d="M30 20 L30 75 L195 75 L195 45 L180 28 L165 20 Z"
            fill="#1CA288"
            stroke="#17806C"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Windshield */}
          <path
            d="M168 24 L182 32 L195 48 L195 55 L168 55 Z"
            fill="#F5F0E8"
            stroke="#17806C"
            strokeWidth="1.5"
            fillOpacity="0.85"
          />

          {/* Side windows - small vanlife-style */}
          <rect
            x="130"
            y="30"
            width="28"
            height="20"
            rx="3"
            fill="#F5F0E8"
            stroke="#17806C"
            strokeWidth="1.5"
            fillOpacity="0.75"
          />

          {/* Small rear window */}
          <rect
            x="40"
            y="32"
            width="18"
            height="16"
            rx="3"
            fill="#F5F0E8"
            stroke="#17806C"
            strokeWidth="1.5"
            fillOpacity="0.6"
          />

          {/* Body accent line */}
          <line
            x1="32"
            y1="55"
            x2="193"
            y2="55"
            stroke="#17806C"
            strokeWidth="1.5"
          />

          {/* Rear door line */}
          <line
            x1="35"
            y1="24"
            x2="35"
            y2="75"
            stroke="#17806C"
            strokeWidth="1.2"
          />

          {/* Door handle */}
          <rect x="37" y="50" width="6" height="2" rx="1" fill="#17806C" />

          {/* Headlight */}
          <rect
            x="193"
            y="50"
            width="5"
            height="8"
            rx="2"
            fill="#FDE68A"
            stroke="#17806C"
            strokeWidth="1"
          />

          {/* Tail light */}
          <rect
            x="28"
            y="55"
            width="4"
            height="10"
            rx="1.5"
            fill="#EF4444"
            stroke="#17806C"
            strokeWidth="1"
          />

          {/* Front bumper */}
          <path
            d="M190 75 L200 75 L200 80 L190 80 Z"
            fill="#17806C"
            stroke="#17806C"
            strokeWidth="1"
          />

          {/* Rear bumper */}
          <path
            d="M25 75 L35 75 L35 80 L25 80 Z"
            fill="#17806C"
            stroke="#17806C"
            strokeWidth="1"
          />

          {/* Front wheel */}
          <circle cx="175" cy="80" r="16" fill="#2d2d2d" stroke="#17806C" strokeWidth="2" />
          <circle cx="175" cy="80" r="8" fill="#555" />
          <circle cx="175" cy="80" r="3" fill="#888" />

          {/* Rear wheel */}
          <circle cx="60" cy="80" r="16" fill="#2d2d2d" stroke="#17806C" strokeWidth="2" />
          <circle cx="60" cy="80" r="8" fill="#555" />
          <circle cx="60" cy="80" r="3" fill="#888" />

          {/* Ground shadow */}
          <ellipse
            cx="118"
            cy="98"
            rx="85"
            ry="4"
            fill="#1CA288"
            fillOpacity="0.08"
          />

          {/* Exhaust puff */}
          <circle cx="18" cy="72" r="4" fill="#1CA288" fillOpacity="0.15" />
          <circle cx="10" cy="68" r="3" fill="#1CA288" fillOpacity="0.1" />
          <circle cx="5" cy="64" r="2.5" fill="#1CA288" fillOpacity="0.06" />
        </svg>
      </div>
    </section>
  );
}
