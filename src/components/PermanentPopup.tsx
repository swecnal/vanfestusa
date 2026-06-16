"use client";

import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

export default function PermanentPopup({ children }: Props) {
  useEffect(() => {
    // Lock body scroll while popup is mounted
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
}
