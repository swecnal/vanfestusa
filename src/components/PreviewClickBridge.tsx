"use client";

import { useEffect } from "react";

export default function PreviewClickBridge() {
  useEffect(() => {
    // Only run inside an iframe
    if (window === window.parent) return;

    // Use capture phase so we intercept before links navigate away
    const handleClick = (e: MouseEvent) => {
      // Walk up the DOM to find the nearest element with a section- id
      let el = e.target as HTMLElement | null;
      while (el) {
        if (el.id && el.id.startsWith("section-")) {
          e.preventDefault();
          e.stopPropagation();
          const sectionId = el.id.replace("section-", "");
          window.parent.postMessage({ type: "preview-select-section", sectionId }, "*");
          return;
        }
        el = el.parentElement;
      }
    };

    // Also block navigation from links inside the preview
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        e.preventDefault();
      }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("click", handleLinkClick, false);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("click", handleLinkClick, false);
    };
  }, []);

  return null;
}
