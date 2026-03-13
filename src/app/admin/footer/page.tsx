"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterConfig {
  brand: { tagline: string };
  socialLinks: Array<{ platform: string; url: string }>;
  columns: FooterColumn[];
  contactInfo: { email: string; phone: string; instagram: string };
}

const EMPTY_CONFIG: FooterConfig = {
  brand: { tagline: "The ULTIMATE vanlife experience!" },
  socialLinks: [
    { platform: "instagram", url: "https://instagram.com/vanfestusa" },
    { platform: "facebook", url: "https://facebook.com/vanfestusa" },
  ],
  columns: [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
        { label: "About", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Get Involved",
      links: [
        { label: "Sponsors & Vendors", href: "/get-involved#sponsors" },
        { label: "Exhibit Your Rig", href: "/get-involved#exhibit" },
        { label: "Jobs @ VanFest", href: "/get-involved#jobs" },
        { label: "Merch", href: "/merch" },
      ],
    },
  ],
  contactInfo: {
    email: "hello@vanfestusa.com",
    phone: "805.826.3378",
    instagram: "@vanfestusa",
  },
};

export default function FooterEditorPage() {
  const [config, setConfig] = useState<FooterConfig>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.settings || {};
        if (s.footer_config) {
          setConfig(s.footer_config as FooterConfig);
        }
      })
      .catch(() => toast.error("Failed to load footer config"))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footer_config: config }),
      });
      if (!res.ok) throw new Error();
      toast.success("Footer saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [config]);

  const updateColumn = (colIdx: number, key: string, value: unknown) => {
    setConfig((prev) => {
      const columns = [...prev.columns];
      columns[colIdx] = { ...columns[colIdx], [key]: value };
      return { ...prev, columns };
    });
  };

  const updateColumnLink = (colIdx: number, linkIdx: number, key: string, value: string | boolean) => {
    setConfig((prev) => {
      const columns = [...prev.columns];
      const links = [...columns[colIdx].links];
      links[linkIdx] = { ...links[linkIdx], [key]: value };
      columns[colIdx] = { ...columns[colIdx], links };
      return { ...prev, columns };
    });
  };

  const addColumnLink = (colIdx: number) => {
    setConfig((prev) => {
      const columns = [...prev.columns];
      columns[colIdx] = {
        ...columns[colIdx],
        links: [...columns[colIdx].links, { label: "New Link", href: "/" }],
      };
      return { ...prev, columns };
    });
  };

  const removeColumnLink = (colIdx: number, linkIdx: number) => {
    setConfig((prev) => {
      const columns = [...prev.columns];
      columns[colIdx] = {
        ...columns[colIdx],
        links: columns[colIdx].links.filter((_, i) => i !== linkIdx),
      };
      return { ...prev, columns };
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
        <h2 className="text-xl font-display font-bold text-charcoal">Footer Editor</h2>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? "Saving..." : "Save Footer"}
        </button>
      </div>

      {/* Brand */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Brand</h3>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Tagline</label>
          <input
            type="text"
            value={config.brand.tagline}
            onChange={(e) => setConfig((prev) => ({ ...prev, brand: { ...prev.brand, tagline: e.target.value } }))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Contact Info</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={config.contactInfo.email}
              onChange={(e) => setConfig((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, email: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input
              type="text"
              value={config.contactInfo.phone}
              onChange={(e) => setConfig((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, phone: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Instagram</label>
            <input
              type="text"
              value={config.contactInfo.instagram}
              onChange={(e) => setConfig((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, instagram: e.target.value } }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Social Links</h3>
          <button
            onClick={() => setConfig((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: "website", url: "" }] }))}
            className="text-teal hover:text-teal-dark text-xs font-semibold"
          >
            + Add
          </button>
        </div>
        {config.socialLinks.map((sl, i) => (
          <div key={i} className="flex items-center gap-2">
            <select
              value={sl.platform}
              onChange={(e) => {
                const socialLinks = [...config.socialLinks];
                socialLinks[i] = { ...socialLinks[i], platform: e.target.value };
                setConfig((prev) => ({ ...prev, socialLinks }));
              }}
              className="px-2 py-1.5 border border-gray-200 rounded text-xs w-28"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter/X</option>
              <option value="website">Website</option>
            </select>
            <input
              type="url"
              value={sl.url}
              onChange={(e) => {
                const socialLinks = [...config.socialLinks];
                socialLinks[i] = { ...socialLinks[i], url: e.target.value };
                setConfig((prev) => ({ ...prev, socialLinks }));
              }}
              className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs"
              placeholder="https://..."
            />
            <button
              onClick={() => setConfig((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((_, idx) => idx !== i) }))}
              className="text-gray-300 hover:text-red-500 p-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>

      {/* Footer Columns */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Footer Columns</h3>
          <button
            onClick={() => setConfig((prev) => ({ ...prev, columns: [...prev.columns, { title: "New Column", links: [] }] }))}
            className="text-teal hover:text-teal-dark text-xs font-semibold"
          >
            + Add Column
          </button>
        </div>

        {config.columns.map((col, ci) => (
          <div key={ci} className="border border-gray-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={col.title}
                onChange={(e) => updateColumn(ci, "title", e.target.value)}
                className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm font-semibold"
              />
              <button
                onClick={() => setConfig((prev) => ({ ...prev, columns: prev.columns.filter((_, i) => i !== ci) }))}
                className="text-gray-300 hover:text-red-500 p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {col.links.map((link, li) => (
              <div key={li} className="flex items-center gap-2 ml-4">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateColumnLink(ci, li, "label", e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateColumnLink(ci, li, "href", e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                  placeholder="/path"
                />
                <button
                  onClick={() => removeColumnLink(ci, li)}
                  className="text-gray-300 hover:text-red-500 p-0.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => addColumnLink(ci)}
              className="ml-4 text-teal/60 hover:text-teal text-[10px] font-semibold"
            >
              + Add Link
            </button>
          </div>
        ))}
      </div>

      {/* Bottom save */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {saving ? "Saving..." : "Save Footer"}
      </button>
    </div>
  );
}
