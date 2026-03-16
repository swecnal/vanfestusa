"use client";

import { useEffect } from "react";

export default function PreviewClickBridge() {
  useEffect(() => {
    // Only run inside an iframe
    if (window === window.parent) return;

    const handleClick = (e: MouseEvent) => {
      // Walk up the DOM to find the nearest element with a section- id
      let el = e.target as HTMLElement | null;
      while (el) {
        if (el.id && el.id.startsWith("section-")) {
          const sectionId = el.id.replace("section-", "");
          window.parent.postMessage({ type: "preview-select-section", sectionId }, "*");
          return;
        }
        el = el.parentElement;
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
