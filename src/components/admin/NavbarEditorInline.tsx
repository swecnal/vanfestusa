"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { NavbarLink, GlobalNavbarConfig } from "@/lib/types";

function genId() {
  return `nav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const EMPTY_CONFIG: GlobalNavbarConfig = {
  links: [],
  ctaButton: { text: "Get Tickets", href: "https://tickets.vanfestusa.com", external: true },
};

// Default nav links to pre-populate when CMS has none
const DEFAULT_LINKS: NavbarLink[] = [
  { id: "def-1", label: "Events", href: "/events", children: [
    { id: "def-1a", label: "Escape to the Cape — MA 2026", href: "/events/escape" },
    { id: "def-1b", label: "LIFTOFF!", href: "/events/liftoff" },
  ]},
  { id: "def-2", label: "About", href: "/about", children: [
    { id: "def-2a", label: "About VanFest", href: "/about" },
    { id: "def-2b", label: "Found a Magnet?", href: "/magnet" },
    { id: "def-2c", label: "Terms & Conduct", href: "/terms" },
  ]},
  { id: "def-3", label: "FAQ", href: "/faq" },
  { id: "def-4", label: "Get Involved", href: "/get-involved", children: [
    { id: "def-4a", label: "Sponsors & Vendors", href: "/sponsors-vendors" },
    { id: "def-4b", label: "Exhibit Your Rig", href: "/exhibit-your-rig" },
    { id: "def-4c", label: "Jobs @ VanFest", href: "/jobs" },
  ]},
  { id: "def-5", label: "Media", href: "/media", children: [
    { id: "def-5a", label: "Gallery", href: "/media#gallery" },
    { id: "def-5b", label: "Community Media", href: "/media#community" },
  ]},
  { id: "def-6", label: "Sponsors", href: "/sponsors" },
  { id: "def-7", label: "Merch", href: "https://merch.vanfestusa.com/", external: true },
  { id: "def-8", label: "Contact", href: "/contact" },
];

interface Props {
  onSave?: () => void;
}

export default function NavbarEditorInline({ onSave }: Props) {
  const [config, setConfig] = useState<GlobalNavbarConfig>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.settings || {};
        if (s.navbar_config) {
          const nc = s.navbar_config as GlobalNavbarConfig;
          if (nc.links?.length > 0) {
            setConfig(nc);
          } else {
            // Pre-populate with defaults so user sees what's actually showing
            setConfig({ ...nc, links: DEFAULT_LINKS });
          }
        } else {
          setConfig({ ...EMPTY_CONFIG, links: DEFAULT_LINKS });
        }
      })
      .catch(() => toast.error("Failed to load navbar config"))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navbar_config: config }),
      });
      if (!res.ok) throw new Error();
      toast.success("Navbar saved");
      onSave?.();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [config, onSave]);

  const addLink = () => {
    setConfig((prev) => ({
      ...prev,
      links: [...prev.links, { id: genId(), label: "New Link", href: "/" }],
    }));
  };

  const updateLink = (index: number, key: string, value: unknown) => {
    setConfig((prev) => {
      const links = [...prev.links];
      links[index] = { ...links[index], [key]: value };
      return { ...prev, links };
    });
  };

  const removeLink = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }));
  };

  const moveLink = (from: number, to: number) => {
    if (to < 0 || to >= config.links.length) return;
    setConfig((prev) => {
      const links = [...prev.links];
      const [moved] = links.splice(from, 1);
      links.splice(to, 0, moved);
      return { ...prev, links };
    });
  };

  const addChild = (linkIndex: number) => {
    setConfig((prev) => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      children.push({ id: genId(), label: "Sub Link", href: "/" });
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  const updateChild = (linkIndex: number, childIndex: number, key: string, value: string) => {
    setConfig((prev) => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      children[childIndex] = { ...children[childIndex], [key]: value };
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  const removeChild = (linkIndex: number, childIndex: number) => {
    setConfig((prev) => {
      const links = [...prev.links];
      const children = (links[linkIndex].children || []).filter((_, i) => i !== childIndex);
      links[linkIndex] = { ...links[linkIndex], children: children.length ? children : undefined };
      return { ...prev, links };
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* CTA Button */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <h4 className="text-xs font-semibold text-gray-700">CTA Button</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Button Text</label>
            <input
              type="text"
              value={config.ctaButton.text}
              onChange={(e) => setConfig((prev) => ({ ...prev, ctaButton: { ...prev.ctaButton, text: e.target.value } }))}
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Button URL</label>
            <input
              type="text"
              value={config.ctaButton.href}
              onChange={(e) => setConfig((prev) => ({ ...prev, ctaButton: { ...prev.ctaButton, href: e.target.value } }))}
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={config.ctaButton.external !== false}
              onChange={(e) => setConfig((prev) => ({ ...prev, ctaButton: { ...prev.ctaButton, external: e.target.checked } }))}
            />
            Open in new tab
          </label>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700">Navigation Links</h4>
          <button onClick={addLink} className="text-teal hover:text-teal-dark text-[10px] font-semibold">
            + Add Link
          </button>
        </div>

        <div className="space-y-1.5">
          {config.links.map((link, i) => (
            <div key={link.id} className="border border-gray-200 rounded-lg bg-white">
              <div className="flex flex-wrap items-center gap-1.5 p-2">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveLink(i, i - 1)} disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <button onClick={() => moveLink(i, i + 1)} disabled={i === config.links.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(i, "label", e.target.value)}
                  className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-xs"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateLink(i, "href", e.target.value)}
                  className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-xs"
                  placeholder="/path"
                />
                <label className="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={link.external || false}
                    onChange={(e) => updateLink(i, "external", e.target.checked)}
                  />
                  Ext
                </label>
                <button onClick={() => removeLink(i)} className="text-gray-300 hover:text-red-500 p-0.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Children / submenu */}
              <div className="px-2 pb-2 space-y-1">
                {(link.children || []).map((child, ci) => (
                  <div key={child.id} className="flex items-center gap-1.5 ml-6">
                    <span className="text-gray-300 text-xs">↳</span>
                    <input
                      type="text"
                      value={child.label}
                      onChange={(e) => updateChild(i, ci, "label", e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[11px]"
                      placeholder="Sub Label"
                    />
                    <input
                      type="text"
                      value={child.href}
                      onChange={(e) => updateChild(i, ci, "href", e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[11px]"
                      placeholder="/path"
                    />
                    <button onClick={() => removeChild(i, ci)} className="text-gray-300 hover:text-red-500 p-0.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addChild(i)}
                  className="ml-6 text-teal/60 hover:text-teal text-[10px] font-semibold"
                >
                  + Add Sub Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event overrides */}
      <details className="bg-gray-50 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
          Event Page Overrides
        </summary>
        <div className="px-3 pb-3 border-t border-gray-100 pt-2">
          <p className="text-[10px] text-gray-400 mb-2">
            Configure different nav links for specific event pages. Edit via JSON.
          </p>
          <textarea
            value={JSON.stringify(config.eventOverrides || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setConfig((prev) => ({ ...prev, eventOverrides: parsed }));
              } catch { /* invalid JSON */ }
            }}
            className="w-full p-2 border border-gray-200 rounded-lg font-mono text-[10px]"
            rows={8}
            placeholder="{}"
          />
        </div>
      </details>

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {saving ? "Saving..." : "Save Navbar"}
      </button>
    </div>
  );
}
