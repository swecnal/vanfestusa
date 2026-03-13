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

export default function NavbarEditorPage() {
  const [config, setConfig] = useState<GlobalNavbarConfig>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.settings || {};
        if (s.navbar_config) {
          setConfig(s.navbar_config as GlobalNavbarConfig);
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
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [config]);

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
      <div className="max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-charcoal">Navbar Editor</h2>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? "Saving..." : "Save Navbar"}
        </button>
      </div>

      {/* CTA Button */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">CTA Button</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Button Text</label>
            <input
              type="text"
              value={config.ctaButton.text}
              onChange={(e) => setConfig((prev) => ({ ...prev, ctaButton: { ...prev.ctaButton, text: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Button URL</label>
            <input
              type="text"
              value={config.ctaButton.href}
              onChange={(e) => setConfig((prev) => ({ ...prev, ctaButton: { ...prev.ctaButton, href: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={config.ctaButton.external !== false}
            onChange={(e) => setConfig((prev) => ({ ...prev, ctaButton: { ...prev.ctaButton, external: e.target.checked } }))}
          />
          Open in new tab
        </label>
      </div>

      {/* Navigation Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Navigation Links</h3>
          <button onClick={addLink} className="text-teal hover:text-teal-dark text-xs font-semibold">
            + Add Link
          </button>
        </div>

        {config.links.length === 0 && (
          <p className="text-xs text-gray-400 italic py-4 text-center">
            No links configured. The navbar will use built-in defaults.
          </p>
        )}

        <div className="space-y-2">
          {config.links.map((link, i) => (
            <div key={link.id} className="border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 p-3">
                {/* Reorder */}
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
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateLink(i, "href", e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm"
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
                <button onClick={() => removeLink(i)} className="text-gray-300 hover:text-red-500 p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Children / submenu */}
              <div className="px-3 pb-3 space-y-1.5">
                {(link.children || []).map((child, ci) => (
                  <div key={child.id} className="flex items-center gap-2 ml-8">
                    <span className="text-gray-300 text-xs">↳</span>
                    <input
                      type="text"
                      value={child.label}
                      onChange={(e) => updateChild(i, ci, "label", e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                      placeholder="Sub Label"
                    />
                    <input
                      type="text"
                      value={child.href}
                      onChange={(e) => updateChild(i, ci, "href", e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                      placeholder="/path"
                    />
                    <button onClick={() => removeChild(i, ci)} className="text-gray-300 hover:text-red-500 p-0.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addChild(i)}
                  className="ml-8 text-teal/60 hover:text-teal text-[10px] font-semibold"
                >
                  + Add Sub Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event overrides */}
      <details className="bg-white rounded-xl border border-gray-200">
        <summary className="px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-50">
          Event Page Overrides
        </summary>
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-400 mb-3">
            Configure different nav links for specific event pages. Leave empty to use defaults.
            Edit via JSON for now — a visual editor is coming soon.
          </p>
          <textarea
            value={JSON.stringify(config.eventOverrides || {}, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setConfig((prev) => ({ ...prev, eventOverrides: parsed }));
              } catch { /* invalid JSON */ }
            }}
            className="w-full p-3 border border-gray-200 rounded-lg font-mono text-xs"
            rows={10}
            placeholder="{}"
          />
        </div>
      </details>

      {/* Bottom save */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {saving ? "Saving..." : "Save Navbar"}
      </button>
    </div>
  );
}
