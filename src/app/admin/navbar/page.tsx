"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import NavbarBuilder from "@/components/admin/NavbarBuilder";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { NavbarBuilderConfig } from "@/lib/types";

interface PageOption {
  id: string;
  slug: string;
  title: string;
}

type PreviewMode = "desktop" | "mobile";

// Pending navigation destination when the confirm modal fires
interface PendingNav {
  href: string;
}

export default function NavbarEditorPage() {
  const [pages, setPages] = useState<PageOption[]>([]);
  const [previewPageId, setPreviewPageId] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  // Iframe refs for both modes
  const desktopIframeRef = useRef<HTMLIFrameElement>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  // Key to force full reload after save
  const [iframeKey, setIframeKey] = useState(0);

  // Scaled preview container measurement
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Dirty / save state exposed by NavbarBuilder
  const [isDirty, setIsDirty] = useState(false);
  const saveRef = useRef<(() => Promise<void>) | null>(null);

  // Unsaved changes guard — modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingNavRef = useRef<PendingNav | null>(null);

  // ── Fetch page list ───────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((res) => {
        const pageList = (res.pages || []) as PageOption[];
        setPages(pageList);
        const home = pageList.find((p: PageOption) => p.slug === "/");
        setPreviewPageId(home?.id || pageList[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  // ── Measure the desktop preview container ────────────────────────────────
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    obs.observe(el);

    // Initial measurement
    const rect = el.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });

    return () => obs.disconnect();
  }, []);

  // ── Real-time preview refresh via postMessage ────────────────────────────
  const triggerPreviewRefresh = useCallback((config: NavbarBuilderConfig) => {
    const msg = { type: "preview-update-navbar", config };
    desktopIframeRef.current?.contentWindow?.postMessage(msg, "*");
    mobileIframeRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

  // ── Called by NavbarBuilder when save completes ──────────────────────────
  const handleSave = useCallback(() => {
    // Hard-reload preview iframes so they fetch the freshly-saved navbar
    setIframeKey((k) => k + 1);
  }, []);

  // ── Page selector change ─────────────────────────────────────────────────
  const handlePageChange = (id: string) => {
    setPreviewPageId(id);
    setIframeKey((k) => k + 1);
  };

  // ── beforeunload guard ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Intercept sidebar link clicks ────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      // Only intercept same-origin navigation away from the current page
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;
      } catch {
        return;
      }
      e.preventDefault();
      pendingNavRef.current = { href };
      setConfirmOpen(true);
    };

    // Attach to the admin sidebar specifically (a reasonable root)
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  // ── Confirm modal actions ─────────────────────────────────────────────────
  const handleConfirmSave = async () => {
    if (saveRef.current) {
      await saveRef.current();
    }
    setConfirmOpen(false);
    const pending = pendingNavRef.current;
    pendingNavRef.current = null;
    if (pending) window.location.href = pending.href;
  };

  const handleConfirmDontSave = () => {
    setConfirmOpen(false);
    const pending = pendingNavRef.current;
    pendingNavRef.current = null;
    if (pending) window.location.href = pending.href;
  };

  const handleConfirmCancel = () => {
    setConfirmOpen(false);
    pendingNavRef.current = null;
  };

  // ── Scale calculation for desktop iframe ─────────────────────────────────
  const DESKTOP_VIEWPORT_WIDTH = 1440;
  const scale =
    containerSize.width > 0
      ? Math.min(1, containerSize.width / DESKTOP_VIEWPORT_WIDTH)
      : 1;
  // The iframe's intrinsic height needs to fill the visible container height
  // after scaling, so we invert-scale the container height.
  const iframeIntrinsicHeight =
    containerSize.height > 0 && scale > 0
      ? containerSize.height / scale
      : 900;

  return (
    <>
      <div className="flex gap-0 -m-3 md:-m-6 h-[calc(100vh-57px)]">
        {/* ── Left: Preview ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col bg-gray-100">
          {/* Preview toolbar */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display font-bold text-sm text-charcoal">Navbar Editor</h3>
              <span className="text-[10px] text-gray-400">Live Preview</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Desktop / Mobile toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    previewMode === "desktop"
                      ? "bg-white text-charcoal shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Desktop preview"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                  </svg>
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    previewMode === "mobile"
                      ? "bg-white text-charcoal shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title="Mobile preview"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
                  </svg>
                  Mobile
                </button>
              </div>

              {/* Page selector */}
              <div className="flex items-center gap-2">
                <label className="text-[10px] text-gray-500 whitespace-nowrap">Preview page:</label>
                <select
                  value={previewPageId}
                  onChange={(e) => handlePageChange(e.target.value)}
                  className="text-xs border border-gray-200 rounded px-2 py-1 max-w-[200px]"
                >
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {/* ── Desktop: scaled iframe ──────────────────────────────── */}
            {previewMode === "desktop" && (
              <div
                ref={previewContainerRef}
                className="w-full h-full overflow-hidden relative"
                style={{ background: "#f3f4f6" }}
              >
                {previewPageId && containerSize.width > 0 && (
                  <div
                    style={{
                      transformOrigin: "top left",
                      transform: `scale(${scale})`,
                      width: DESKTOP_VIEWPORT_WIDTH,
                      height: iframeIntrinsicHeight,
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      ref={desktopIframeRef}
                      key={`desktop-${iframeKey}`}
                      src={`/preview/${previewPageId}`}
                      style={{
                        width: DESKTOP_VIEWPORT_WIDTH,
                        height: iframeIntrinsicHeight,
                        border: "none",
                        display: "block",
                        background: "white",
                      }}
                      title="Navbar preview (desktop)"
                    />
                  </div>
                )}
              </div>
            )}

            {/* ── Mobile: phone frame iframe ──────────────────────────── */}
            {previewMode === "mobile" && (
              <div className="flex-1 flex items-start justify-center py-6 overflow-y-auto h-full">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                    <div className="flex justify-center mb-1">
                      <div className="w-20 h-4 bg-gray-800 rounded-full" />
                    </div>
                    <div
                      className="rounded-[2rem] overflow-hidden bg-white"
                      style={{ width: 393, height: 852 }}
                    >
                      {previewPageId && (
                        <iframe
                          ref={mobileIframeRef}
                          key={`mobile-${iframeKey}`}
                          src={`/preview/${previewPageId}`}
                          className="border-0 w-full h-full"
                          title="Navbar preview (mobile)"
                        />
                      )}
                    </div>
                    <div className="flex justify-center mt-2">
                      <div className="w-28 h-1 bg-gray-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Builder panel ──────────────────────────────────────────── */}
        <div className="w-96 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
          <div className="flex-shrink-0 bg-white p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm text-charcoal">Navbar Builder</h3>
              {isDirty && (
                <span className="text-[10px] text-amber-500 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Edit links, logo, CTAs, and style. Changes preview in real-time.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto admin-scrollbar">
            <NavbarBuilder
              onSave={handleSave}
              onDirtyChange={setIsDirty}
              saveRef={saveRef}
              onConfigChange={triggerPreviewRefresh}
            />
          </div>
        </div>
      </div>

      {/* ── Unsaved changes confirm modal ─────────────────────────────────── */}
      <ConfirmModal
        open={confirmOpen}
        title="Unsaved changes"
        message="You have unsaved changes. Save before leaving?"
        confirmLabel="Save"
        altLabel="Don't Save"
        cancelLabel="Cancel"
        onConfirm={handleConfirmSave}
        onAlt={handleConfirmDontSave}
        onCancel={handleConfirmCancel}
      />
    </>
  );
}
