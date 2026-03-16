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

interface VehicleStreamConfig {
  enabled: boolean;
  dividerType: string;
  paddingTop: string;
  paddingBottom: string;
  marginTop: string;
  marginBottom: string;
  seed: number;
  count: number;
  signs: Array<{ text: string; scale: number }>;
  fromColor: string;
  toColor: string;
  height: number;
  frequency: number;
  intensity: number;
  reverse: boolean;
  festivalElements: {
    vendorBooths: boolean;
    stage: boolean;
    dancing: boolean;
    campfireWithPeople: boolean;
    campfireSolo: boolean;
    tents: boolean;
    peopleMeandering: boolean;
  };
  festivalBgColor: string;
  festivalSeed: number;
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
        { label: "Sponsors & Vendors", href: "/sponsors-vendors" },
        { label: "Exhibit Your Rig", href: "/exhibit-your-rig" },
        { label: "Jobs @ VanFest", href: "/jobs" },
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

const EMPTY_STREAM: VehicleStreamConfig = {
  enabled: true,
  dividerType: "vehicle_stream",
  paddingTop: "0px",
  paddingBottom: "0px",
  marginTop: "0px",
  marginBottom: "0px",
  seed: 777,
  count: 14,
  signs: [
    { text: "COMMUNITY", scale: 1 },
    { text: "MUSIC", scale: 1 },
    { text: "MEMORIES", scale: 1 },
    { text: "VANFEST", scale: 2 },
  ],
  fromColor: "#ffffff",
  toColor: "#1a1a1a",
  height: 60,
  frequency: 2,
  intensity: 50,
  reverse: false,
  festivalElements: {
    vendorBooths: true,
    stage: true,
    dancing: true,
    campfireWithPeople: true,
    campfireSolo: true,
    tents: true,
    peopleMeandering: true,
  },
  festivalBgColor: "#F5F0E8",
  festivalSeed: 42,
};

interface Props {
  onSave?: () => void;
}

export default function FooterEditorInline({ onSave }: Props) {
  const [config, setConfig] = useState<FooterConfig>(EMPTY_CONFIG);
  const [stream, setStream] = useState<VehicleStreamConfig>(EMPTY_STREAM);
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
        if (s.vehicle_stream_config) {
          const raw = s.vehicle_stream_config as Record<string, unknown>;
          if (Array.isArray(raw.signs) && raw.signs.length > 0 && typeof raw.signs[0] === "string") {
            raw.signs = (raw.signs as string[]).map((t: string) => ({ text: t, scale: 1 }));
          }
          setStream({ ...EMPTY_STREAM, ...(raw as unknown as VehicleStreamConfig) });
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
        body: JSON.stringify({
          footer_config: config,
          vehicle_stream_config: stream,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Footer saved");
      onSave?.();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [config, stream, onSave]);

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

  const updateSign = (index: number, key: "text" | "scale", value: string | number) => {
    setStream((prev) => {
      const signs = [...prev.signs];
      signs[index] = { ...signs[index], [key]: value };
      return { ...prev, signs };
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
      {/* Footer Divider */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700">Footer Divider</h4>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={stream.enabled}
              onChange={(e) => setStream((prev) => ({ ...prev, enabled: e.target.checked }))}
            />
            Enabled
          </label>
        </div>
        {stream.enabled && (
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Divider Type</label>
              <select
                value={stream.dividerType}
                onChange={(e) => setStream((prev) => ({ ...prev, dividerType: e.target.value }))}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
              >
                <option value="vehicle_stream">Vehicle Stream</option>
                <option value="wave">Wave</option>
                <option value="zigzag">Zigzag</option>
                <option value="curve">Curve</option>
                <option value="straight">Straight</option>
                <option value="convoy">Vehicle Convoy</option>
                <option value="festival">Festival Scene</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">Pad Top</label>
                <input type="text" value={stream.paddingTop} onChange={(e) => setStream((prev) => ({ ...prev, paddingTop: e.target.value }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">Pad Bottom</label>
                <input type="text" value={stream.paddingBottom} onChange={(e) => setStream((prev) => ({ ...prev, paddingBottom: e.target.value }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">Margin Top</label>
                <input type="text" value={stream.marginTop} onChange={(e) => setStream((prev) => ({ ...prev, marginTop: e.target.value }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">Margin Bottom</label>
                <input type="text" value={stream.marginBottom} onChange={(e) => setStream((prev) => ({ ...prev, marginBottom: e.target.value }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
              </div>
            </div>

            {/* Vehicle Stream fields */}
            {stream.dividerType === "vehicle_stream" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Seed</label>
                    <input type="number" value={stream.seed} onChange={(e) => setStream((prev) => ({ ...prev, seed: Number(e.target.value) }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Vehicle Count</label>
                    <input type="number" value={stream.count} min={1} max={30} onChange={(e) => setStream((prev) => ({ ...prev, count: Number(e.target.value) }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[10px] text-gray-500">Road Signs</label>
                    <button onClick={() => setStream((prev) => ({ ...prev, signs: [...prev.signs, { text: "NEW", scale: 1 }] }))} className="text-teal hover:text-teal-dark text-[10px] font-semibold">+ Add Sign</button>
                  </div>
                  {stream.signs.map((sign, i) => (
                    <div key={i} className="flex items-center gap-1.5 mb-1">
                      <input type="text" value={sign.text} onChange={(e) => updateSign(i, "text", e.target.value)} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px] uppercase" />
                      <input type="number" value={sign.scale} min={0.5} max={4} step={0.25} onChange={(e) => updateSign(i, "scale", Number(e.target.value))} className="w-14 px-1 py-1 border border-gray-200 rounded text-[10px] text-center" />
                      <button onClick={() => setStream((prev) => ({ ...prev, signs: prev.signs.filter((_, idx) => idx !== i) }))} className="text-gray-300 hover:text-red-500 p-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wave / Zigzag / Curve / Straight */}
            {(stream.dividerType === "wave" || stream.dividerType === "zigzag" || stream.dividerType === "curve" || stream.dividerType === "straight") && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">From Color</label>
                    <div className="flex gap-1">
                      <input type="color" value={stream.fromColor} onChange={(e) => setStream((prev) => ({ ...prev, fromColor: e.target.value }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                      <input type="text" value={stream.fromColor} onChange={(e) => setStream((prev) => ({ ...prev, fromColor: e.target.value }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">To Color</label>
                    <div className="flex gap-1">
                      <input type="color" value={stream.toColor} onChange={(e) => setStream((prev) => ({ ...prev, toColor: e.target.value }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                      <input type="text" value={stream.toColor} onChange={(e) => setStream((prev) => ({ ...prev, toColor: e.target.value }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Height ({stream.height}px)</label>
                  <input type="range" min={20} max={200} value={stream.height} onChange={(e) => setStream((prev) => ({ ...prev, height: Number(e.target.value) }))} className="w-full" />
                </div>
                {(stream.dividerType === "wave" || stream.dividerType === "zigzag") && (
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Frequency ({stream.frequency})</label>
                    <input type="range" min={1} max={5} value={stream.frequency} onChange={(e) => setStream((prev) => ({ ...prev, frequency: Number(e.target.value) }))} className="w-full" />
                  </div>
                )}
                {stream.dividerType !== "straight" && (
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Intensity ({stream.intensity}%)</label>
                    <input type="range" min={1} max={100} value={stream.intensity} onChange={(e) => setStream((prev) => ({ ...prev, intensity: Number(e.target.value) }))} className="w-full" />
                  </div>
                )}
              </div>
            )}

            {/* Convoy */}
            {stream.dividerType === "convoy" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Seed</label>
                  <input type="number" value={stream.seed} onChange={(e) => setStream((prev) => ({ ...prev, seed: Number(e.target.value) }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Count</label>
                  <input type="number" value={stream.count} min={1} max={20} onChange={(e) => setStream((prev) => ({ ...prev, count: Number(e.target.value) }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 col-span-2">
                  <input type="checkbox" checked={stream.reverse} onChange={(e) => setStream((prev) => ({ ...prev, reverse: e.target.checked }))} />
                  Reverse
                </label>
              </div>
            )}

            {/* Festival */}
            {stream.dividerType === "festival" && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Seed</label>
                    <input type="number" value={stream.festivalSeed} onChange={(e) => setStream((prev) => ({ ...prev, festivalSeed: Number(e.target.value) }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 mb-0.5">Bg Color</label>
                    <div className="flex gap-1">
                      <input type="color" value={stream.festivalBgColor} onChange={(e) => setStream((prev) => ({ ...prev, festivalBgColor: e.target.value }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                      <input type="text" value={stream.festivalBgColor} onChange={(e) => setStream((prev) => ({ ...prev, festivalBgColor: e.target.value }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Elements</label>
                  <div className="grid grid-cols-2 gap-1">
                    {([
                      ["vendorBooths", "Vendor Booths"],
                      ["stage", "Stage / Band"],
                      ["dancing", "Dancing"],
                      ["campfireWithPeople", "Campfire w/ People"],
                      ["campfireSolo", "Campfire Solo"],
                      ["tents", "Tents"],
                      ["peopleMeandering", "People Meandering"],
                    ] as const).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-1.5 text-[10px] text-gray-600">
                        <input
                          type="checkbox"
                          checked={stream.festivalElements[key]}
                          onChange={(e) =>
                            setStream((prev) => ({
                              ...prev,
                              festivalElements: { ...prev.festivalElements, [key]: e.target.checked },
                            }))
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Brand */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <h4 className="text-xs font-semibold text-gray-700">Brand</h4>
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Tagline</label>
          <input
            type="text"
            value={config.brand.tagline}
            onChange={(e) => setConfig((prev) => ({ ...prev, brand: { ...prev.brand, tagline: e.target.value } }))}
            className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <h4 className="text-xs font-semibold text-gray-700">Contact Info</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Email</label>
            <input type="email" value={config.contactInfo.email} onChange={(e) => setConfig((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, email: e.target.value } }))} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Phone</label>
            <input type="text" value={config.contactInfo.phone} onChange={(e) => setConfig((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, phone: e.target.value } }))} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Instagram</label>
            <input type="text" value={config.contactInfo.instagram} onChange={(e) => setConfig((prev) => ({ ...prev, contactInfo: { ...prev.contactInfo, instagram: e.target.value } }))} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700">Social Links</h4>
          <button onClick={() => setConfig((prev) => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: "website", url: "" }] }))} className="text-teal hover:text-teal-dark text-[10px] font-semibold">+ Add</button>
        </div>
        {config.socialLinks.map((sl, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <select
              value={sl.platform}
              onChange={(e) => {
                const socialLinks = [...config.socialLinks];
                socialLinks[i] = { ...socialLinks[i], platform: e.target.value };
                setConfig((prev) => ({ ...prev, socialLinks }));
              }}
              className="px-1.5 py-1 border border-gray-200 rounded text-[10px] w-24"
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
              className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[10px]"
              placeholder="https://..."
            />
            <button onClick={() => setConfig((prev) => ({ ...prev, socialLinks: prev.socialLinks.filter((_, idx) => idx !== i) }))} className="text-gray-300 hover:text-red-500 p-0.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>

      {/* Footer Columns */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700">Footer Columns</h4>
          <button onClick={() => setConfig((prev) => ({ ...prev, columns: [...prev.columns, { title: "New Column", links: [] }] }))} className="text-teal hover:text-teal-dark text-[10px] font-semibold">+ Add Column</button>
        </div>

        {config.columns.map((col, ci) => (
          <div key={ci} className="border border-gray-200 rounded-lg bg-white p-2 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={col.title}
                onChange={(e) => updateColumn(ci, "title", e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs font-semibold"
              />
              <button onClick={() => setConfig((prev) => ({ ...prev, columns: prev.columns.filter((_, i) => i !== ci) }))} className="text-gray-300 hover:text-red-500 p-0.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {col.links.map((link, li) => (
              <div key={li} className="flex items-center gap-1.5 ml-3">
                <input type="text" value={link.label} onChange={(e) => updateColumnLink(ci, li, "label", e.target.value)} className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="Label" />
                <input type="text" value={link.href} onChange={(e) => updateColumnLink(ci, li, "href", e.target.value)} className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="/path" />
                <button onClick={() => removeColumnLink(ci, li)} className="text-gray-300 hover:text-red-500 p-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            <button onClick={() => addColumnLink(ci)} className="ml-3 text-teal/60 hover:text-teal text-[10px] font-semibold">+ Add Link</button>
          </div>
        ))}
      </div>

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {saving ? "Saving..." : "Save Footer"}
      </button>
    </div>
  );
}
