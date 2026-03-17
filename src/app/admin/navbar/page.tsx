"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import NavbarBuilder, { EMPTY_CONFIG, convertLegacyToV2 } from "@/components/admin/NavbarBuilder";
import ConfirmModal from "@/components/admin/ConfirmModal";
import type { NavbarBuilderConfig, SavedNavbar } from "@/lib/types";
import { toast } from "sonner";

function genNavbarId() {
  return `nb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function buildEventNavbars(): SavedNavbar[] {
  const escapeLinks = [
    { id: "esc-1", label: "About", href: "/events/escape" },
    { id: "esc-2", label: "Schedule", href: "/events/escape/schedule" },
    { id: "esc-3", label: "Map", href: "/events/escape/map" },
    { id: "esc-4", label: "Get Involved", href: "/events/escape/sponsors-vendors", children: [
      { id: "esc-4a", label: "Jobs & Volunteers", href: "/events/escape/jobs" },
      { id: "esc-4b", label: "Sponsors & Vendors", href: "/events/escape/sponsors-vendors" },
      { id: "esc-4c", label: "Exhibit Your Rig", href: "/events/escape/exhibit-your-rig" },
    ]},
    { id: "esc-5", label: "FAQ", href: "/events/escape/faq" },
    { id: "esc-6", label: "Contact", href: "/contact" },
  ];

  const liftoffLinks = [
    { id: "lft-1", label: "About", href: "/events/liftoff" },
    { id: "lft-2", label: "Schedule", href: "/events/liftoff/schedule" },
    { id: "lft-3", label: "Map", href: "/events/liftoff/map" },
    { id: "lft-4", label: "Get Involved", href: "/events/liftoff/sponsors-vendors", children: [
      { id: "lft-4a", label: "Jobs & Volunteers", href: "/events/liftoff/jobs" },
      { id: "lft-4b", label: "Sponsors & Vendors", href: "/events/liftoff/sponsors-vendors" },
      { id: "lft-4c", label: "Exhibit Your Rig", href: "/events/liftoff/exhibit-your-rig" },
    ]},
    { id: "lft-5", label: "FAQ", href: "/events/liftoff/faq" },
    { id: "lft-6", label: "Contact", href: "/contact" },
  ];

  const baseConfig: NavbarBuilderConfig = {
    ...EMPTY_CONFIG,
    ctaButtons: [
      { text: "Get Tickets", href: "https://vanfest.ticketspice.com/escape2026", external: true, variant: "primary", bounce: true },
    ],
  };

  return [
    {
      id: genNavbarId(),
      name: "Escape to the Cape",
      config: { ...baseConfig, links: escapeLinks, badge: { text: "Escape to the Cape", bgColor: "#f97316", bgColorEnd: "#eab308", textColor: "#ffffff" } },
      isDefault: false,
    },
    {
      id: genNavbarId(),
      name: "LIFTOFF!",
      config: { ...baseConfig, links: liftoffLinks, badge: { text: "LIFTOFF!", bgColor: "#6366f1", bgColorEnd: "#a855f7", textColor: "#ffffff" }, ctaButtons: [{ text: "Get Tickets", href: "https://tickets.vanfestusa.com", external: true, variant: "primary", bounce: true }] },
      isDefault: false,
    },
  ];
}

interface PageOption {
  id: string;
  slug: string;
  title: string;
}

type PreviewMode = "desktop" | "mobile";

export default function NavbarEditorPage() {
  const [navbars, setNavbars] = useState<SavedNavbar[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewNavbarId, setPreviewNavbarId] = useState<string | null>(null);

  // Preview state
  const [pages, setPages] = useState<PageOption[]>([]);
  const [previewPageId, setPreviewPageId] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const desktopIframeRef = useRef<HTMLIFrameElement>(null);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<SavedNavbar | null>(null);
  const [deleteUsage, setDeleteUsage] = useState<Array<{ id: string; title: string; slug: string }>>([]);
  const [replacementId, setReplacementId] = useState<string>("");

  // Navbar-page usage map
  const [usageMap, setUsageMap] = useState<Record<string, Array<{ id: string; title: string; slug: string }>>>({});

  // Unsaved changes guard
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingNavRef = useRef<{ href: string } | null>(null);

  // ── Load navbars + pages ─────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/api/global-settings").then((r) => r.json()),
      fetch("/api/pages").then((r) => r.json()),
      fetch("/api/navbar-usage").then((r) => r.json()),
    ])
      .then(([settingsRes, pagesRes, usageRes]) => {
        const s = settingsRes.settings || {};
        let loaded: SavedNavbar[];

        if (s.navbars) {
          loaded = s.navbars as SavedNavbar[];
          // Ensure event navbars exist — add them if missing
          const eventNavbars = buildEventNavbars();
          let added = false;
          for (const en of eventNavbars) {
            if (!loaded.some((n) => n.name === en.name)) {
              loaded.push(en);
              added = true;
            }
          }
          if (added) {
            fetch("/api/global-settings", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ navbars: loaded }),
            });
          }
        } else if (s.navbar_builder_config || s.navbar_config) {
          // Auto-migrate: create Main + event navbars
          const mainConfig = s.navbar_builder_config
            ? (s.navbar_builder_config as NavbarBuilderConfig)
            : convertLegacyToV2(s.navbar_config as Record<string, unknown>);
          loaded = [
            { id: genNavbarId(), name: "Main Navigation", config: mainConfig, isDefault: true },
            ...buildEventNavbars(),
          ];
          fetch("/api/global-settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navbars: loaded }),
          });
        } else {
          loaded = [
            { id: genNavbarId(), name: "Main Navigation", config: EMPTY_CONFIG, isDefault: true },
            ...buildEventNavbars(),
          ];
        }

        setNavbars(loaded);

        const pageList = (pagesRes.pages || []) as PageOption[];
        setPages(pageList);
        const home = pageList.find((p) => p.slug === "/");
        setPreviewPageId(home?.id || pageList[0]?.id || "");

        setUsageMap(usageRes.usage || {});
      })
      .catch(() => toast.error("Failed to load navbar data"))
      .finally(() => setLoading(false));
  }, []);

  // ── Container measurement ─────────────────────────────────────────────────
  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height });
      }
    });
    obs.observe(el);
    const rect = el.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });
    return () => obs.disconnect();
  }, []);

  // ── beforeunload guard ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // ── Intercept sidebar navigation when dirty ───────────────────────────────
  useEffect(() => {
    if (!dirty) return;
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
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
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [dirty]);

  // ── Save all navbars ──────────────────────────────────────────────────────
  const saveAll = useCallback(async () => {
    setSaving(true);
    try {
      const defaultNav = navbars.find((n) => n.isDefault);
      const payload: Record<string, unknown> = { navbars };
      if (defaultNav) {
        payload.navbar_builder_config = defaultNav.config;
      }
      const res = await fetch("/api/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("All navbars saved");
      setDirty(false);
      setIframeKey((k) => k + 1);
    } catch {
      toast.error("Failed to save navbars");
    } finally {
      setSaving(false);
    }
  }, [navbars]);

  // ── Navbar CRUD operations ────────────────────────────────────────────────
  const addNavbar = () => {
    const newNav: SavedNavbar = {
      id: genNavbarId(),
      name: "New Navbar",
      config: EMPTY_CONFIG,
      isDefault: navbars.length === 0,
    };
    setNavbars((prev) => [...prev, newNav]);
    setExpandedId(newNav.id);
    setDirty(true);
  };

  const cloneNavbar = (source: SavedNavbar) => {
    const clone: SavedNavbar = {
      id: genNavbarId(),
      name: `COPY - ${source.name}`,
      config: JSON.parse(JSON.stringify(source.config)),
      isDefault: false,
    };
    setNavbars((prev) => {
      const idx = prev.findIndex((n) => n.id === source.id);
      const next = [...prev];
      next.splice(idx + 1, 0, clone);
      return next;
    });
    setExpandedId(clone.id);
    setDirty(true);
  };

  const initiateDelete = (nav: SavedNavbar) => {
    const pagesUsing = usageMap[nav.id] || [];
    setDeleteTarget(nav);
    setDeleteUsage(pagesUsing);
    const alt = navbars.find((n) => n.id !== nav.id);
    setReplacementId(alt?.id || "");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const navId = deleteTarget.id;
    const pagesUsing = deleteUsage;

    // If in use, reassign sections to replacement navbar
    if (pagesUsing.length > 0 && replacementId) {
      try {
        for (const page of pagesUsing) {
          const sectionsRes = await fetch(`/api/pages/${page.id}/sections`);
          if (!sectionsRes.ok) continue;
          const { sections } = await sectionsRes.json();
          for (const section of sections || []) {
            if (section.section_type === "navbar" && section.data?.navbarId === navId) {
              await fetch(`/api/pages/${page.id}/sections/${section.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  data: { ...section.data, navbarId: replacementId },
                }),
              });
            }
          }
        }
      } catch {
        toast.error("Failed to reassign pages");
        return;
      }
    }

    const wasDefault = deleteTarget.isDefault;
    setNavbars((prev) => {
      let next = prev.filter((n) => n.id !== navId);
      if (wasDefault && next.length > 0) {
        next = next.map((n, i) => (i === 0 ? { ...n, isDefault: true } : n));
      }
      return next;
    });

    // Update usage map
    setUsageMap((prev) => {
      const next = { ...prev };
      delete next[navId];
      if (replacementId && pagesUsing.length > 0) {
        next[replacementId] = [...(next[replacementId] || []), ...pagesUsing];
      }
      return next;
    });

    setDirty(true);
    setDeleteTarget(null);
    setDeleteUsage([]);
    if (expandedId === navId) {
      setExpandedId(navbars.find((n) => n.id !== navId)?.id || null);
    }
    toast.success(`Deleted "${deleteTarget.name}"`);
  };

  const setDefault = (id: string) => {
    setNavbars((prev) => prev.map((n) => ({ ...n, isDefault: n.id === id })));
    setDirty(true);
  };

  const updateNavbarName = (id: string, name: string) => {
    setNavbars((prev) => prev.map((n) => (n.id === id ? { ...n, name } : n)));
    setDirty(true);
  };

  const updateNavbarConfig = (id: string, config: NavbarBuilderConfig) => {
    setNavbars((prev) => prev.map((n) => (n.id === id ? { ...n, config } : n)));
    setDirty(true);
  };

  // ── Real-time preview refresh ─────────────────────────────────────────────
  const triggerPreviewRefresh = useCallback((config: NavbarBuilderConfig) => {
    const msg = { type: "preview-update-navbar", config };
    desktopIframeRef.current?.contentWindow?.postMessage(msg, "*");
    mobileIframeRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

  // When preview navbar changes or its config updates, push to preview
  useEffect(() => {
    if (!previewNavbarId) return;
    const nav = navbars.find((n) => n.id === previewNavbarId);
    if (nav) {
      const timer = setTimeout(() => triggerPreviewRefresh(nav.config), 100);
      return () => clearTimeout(timer);
    }
  }, [previewNavbarId, navbars, triggerPreviewRefresh]);

  const handlePageChange = (id: string) => {
    setPreviewPageId(id);
    setIframeKey((k) => k + 1);
  };

  // ── Confirm modal actions ─────────────────────────────────────────────────
  const handleConfirmSave = async () => {
    await saveAll();
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

  // ── Scale calc ────────────────────────────────────────────────────────────
  const DESKTOP_VIEWPORT_WIDTH = 1440;
  const scale = containerSize.width > 0 ? Math.min(1, containerSize.width / DESKTOP_VIEWPORT_WIDTH) : 1;
  const iframeIntrinsicHeight = containerSize.height > 0 && scale > 0 ? containerSize.height / scale : 900;

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Loading navbars...</div>;
  }

  return (
    <>
      <div className="flex gap-0 -m-3 md:-m-6 h-[calc(100vh-57px)]">
        {/* ── Left: Preview ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col bg-gray-100">
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-display font-bold text-sm text-charcoal">Navbar Manager</h3>
              <span className="text-[10px] text-gray-400">Live Preview</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    previewMode === "desktop" ? "bg-white text-charcoal shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                  </svg>
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    previewMode === "mobile" ? "bg-white text-charcoal shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3" />
                  </svg>
                  Mobile
                </button>
              </div>
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

          <div className="flex-1 min-h-0 overflow-hidden">
            {previewMode === "desktop" && (
              <div ref={previewContainerRef} className="w-full h-full overflow-hidden relative" style={{ background: "#f3f4f6" }}>
                {previewPageId && containerSize.width > 0 && (
                  <div style={{ transformOrigin: "top left", transform: `scale(${scale})`, width: DESKTOP_VIEWPORT_WIDTH, height: iframeIntrinsicHeight, overflow: "hidden" }}>
                    <iframe
                      ref={desktopIframeRef}
                      key={`desktop-${iframeKey}`}
                      src={`/preview/${previewPageId}`}
                      style={{ width: DESKTOP_VIEWPORT_WIDTH, height: iframeIntrinsicHeight, border: "none", display: "block", background: "white" }}
                      title="Navbar preview (desktop)"
                    />
                  </div>
                )}
              </div>
            )}
            {previewMode === "mobile" && (
              <div className="flex-1 flex items-start justify-center py-6 overflow-y-auto h-full">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                    <div className="flex justify-center mb-1"><div className="w-20 h-4 bg-gray-800 rounded-full" /></div>
                    <div className="rounded-[2rem] overflow-hidden bg-white" style={{ width: 393, height: 852 }}>
                      {previewPageId && (
                        <iframe ref={mobileIframeRef} key={`mobile-${iframeKey}`} src={`/preview/${previewPageId}`} className="border-0 w-full h-full" title="Navbar preview (mobile)" />
                      )}
                    </div>
                    <div className="flex justify-center mt-2"><div className="w-28 h-1 bg-gray-600 rounded-full" /></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Multi-navbar panel ──────────────────────────────────────── */}
        <div className="w-96 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
          <div className="flex-shrink-0 bg-white p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-sm text-charcoal">Navbar Manager</h3>
              {dirty && (
                <span className="text-[10px] text-amber-500 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Manage multiple navbars. Assign them to pages as elements.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto admin-scrollbar">
            <div className="p-3 space-y-2">
              {navbars.map((nav) => {
                const isExpanded = expandedId === nav.id;
                const isPreviewing = previewNavbarId === nav.id;
                const pagesUsing = usageMap[nav.id] || [];
                return (
                  <div key={nav.id} className={`border rounded-lg overflow-hidden ${isPreviewing ? "border-teal" : "border-gray-200"}`}>
                    <div className="flex items-center justify-between gap-2 hover:bg-gray-50 transition-colors">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : nav.id)}
                        className="flex-1 text-left px-3 py-2.5 flex items-center gap-2 min-w-0"
                      >
                        <svg
                          className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm font-semibold text-charcoal truncate">{nav.name}</span>
                        {nav.isDefault && (
                          <span className="text-[9px] bg-teal/10 text-teal font-bold px-1.5 py-0.5 rounded flex-shrink-0">DEFAULT</span>
                        )}
                        {pagesUsing.length > 0 && (
                          <span className="text-[9px] text-gray-400 flex-shrink-0">
                            {pagesUsing.length} page{pagesUsing.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </button>
                      <div className="flex items-center gap-1 pr-2">
                        {/* Eye icon — toggle preview */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setPreviewNavbarId(isPreviewing ? null : nav.id); }}
                          className={`p-1.5 rounded transition-colors ${isPreviewing ? "text-teal bg-teal/10" : "text-gray-300 hover:text-gray-500"}`}
                          title={isPreviewing ? "Stop previewing" : "Preview this navbar"}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {isPreviewing ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            )}
                          </svg>
                        </button>
                        {/* Red X — delete */}
                        {navbars.length > 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); initiateDelete(nav); }}
                            className="p-1.5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete navbar"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        <div className="px-3 py-2 bg-gray-50/50 border-b border-gray-100">
                          <div className="flex items-center gap-2 mb-2">
                            <input
                              type="text"
                              value={nav.name}
                              onChange={(e) => updateNavbarName(nav.id, e.target.value)}
                              className="flex-1 text-xs font-medium px-2 py-1 border border-gray-200 rounded"
                              placeholder="Navbar name"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => cloneNavbar(nav)}
                              className="text-[10px] text-gray-500 hover:text-charcoal bg-white border border-gray-200 px-2 py-0.5 rounded transition-colors"
                            >
                              Clone
                            </button>
                            {!nav.isDefault && (
                              <button
                                onClick={() => setDefault(nav.id)}
                                className="text-[10px] text-teal hover:text-teal-dark bg-white border border-gray-200 px-2 py-0.5 rounded transition-colors"
                              >
                                Set as Default
                              </button>
                            )}
                          </div>
                          {pagesUsing.length > 0 && (
                            <div className="mt-2 text-[10px] text-gray-400">
                              <span className="font-semibold">Used by:</span>{" "}
                              {pagesUsing.map((p) => p.title).join(", ")}
                            </div>
                          )}
                        </div>

                        <NavbarBuilder
                          externalConfig={nav.config}
                          onExternalConfigChange={(config) => updateNavbarConfig(nav.id, config)}
                          hideSaveButton
                          onConfigChange={isPreviewing ? triggerPreviewRefresh : undefined}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={addNavbar}
                className="w-full text-center py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-400 hover:text-teal hover:border-teal/30 transition-colors"
              >
                + Add Navbar
              </button>
            </div>
          </div>

          <div className="bg-white border-t border-gray-100 p-4 sticky bottom-0 z-10">
            <button
              onClick={saveAll}
              disabled={saving}
              className={`w-full font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 text-sm ${
                dirty ? "bg-teal hover:bg-teal-dark text-white" : "bg-gray-100 text-gray-400 cursor-default"
              }`}
            >
              {saving ? "Saving..." : dirty ? "Save All Navbars" : "No Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Unsaved changes confirm modal ──────────────────────────────────── */}
      <ConfirmModal
        open={confirmOpen}
        title="Unsaved changes"
        message="You have unsaved changes. Save before leaving?"
        confirmLabel="Save"
        altLabel="Don't Save"
        cancelLabel="Cancel"
        onConfirm={handleConfirmSave}
        onAlt={handleConfirmDontSave}
        onCancel={() => { setConfirmOpen(false); pendingNavRef.current = null; }}
      />

      {/* ── Delete navbar modal ────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="font-display font-bold text-lg text-charcoal mb-3">Delete Navbar</h3>
            {deleteUsage.length > 0 ? (
              <>
                <p className="text-sm text-charcoal/70 mb-2">
                  This navbar is currently in use on the following pages:
                </p>
                <ul className="mb-4 space-y-1">
                  {deleteUsage.map((p) => (
                    <li key={p.id} className="text-sm text-charcoal font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-teal rounded-full flex-shrink-0" />
                      {p.title} <span className="text-gray-400 text-xs">({p.slug})</span>
                    </li>
                  ))}
                </ul>
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Reassign these pages to:</label>
                  <select
                    value={replacementId}
                    onChange={(e) => setReplacementId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {navbars.filter((n) => n.id !== deleteTarget.id).map((n) => (
                      <option key={n.id} value={n.id}>{n.name}{n.isDefault ? " (Default)" : ""}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setDeleteTarget(null); setDeleteUsage([]); }} className="px-4 py-2 text-sm text-gray-600 hover:text-charcoal transition-colors">Cancel</button>
                  <button onClick={confirmDelete} disabled={!replacementId} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">Delete &amp; Reassign</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-charcoal/70 mb-6">Delete &ldquo;{deleteTarget.name}&rdquo;? This cannot be undone.</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setDeleteTarget(null); setDeleteUsage([]); }} className="px-4 py-2 text-sm text-gray-600 hover:text-charcoal transition-colors">Cancel</button>
                  <button onClick={confirmDelete} className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
