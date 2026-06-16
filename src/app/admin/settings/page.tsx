"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PageRef {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editPaneMode, setEditPaneMode] = useState<"floating" | "static">("floating");
  const [pages, setPages] = useState<PageRef[]>([]);

  useEffect(() => {
    // Read editor pane mode from localStorage
    const stored = localStorage.getItem("vf_editPaneMode") as "floating" | "static" | null;
    if (stored) setEditPaneMode(stored);
  }, []);

  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => setPages((data.pages || []) as PageRef[]))
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/global-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  const updateSetting = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-charcoal">
          Global Settings
        </h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Site Metadata */}
        <SettingsCard title="Site Metadata">
          <SettingsField label="Site Title">
            <input
              type="text"
              value={((settings.site_metadata as Record<string, string>)?.title) || ""}
              onChange={(e) =>
                updateSetting("site_metadata", {
                  ...(settings.site_metadata as Record<string, string>),
                  title: e.target.value,
                })
              }
              className="settings-input"
            />
          </SettingsField>
          <SettingsField label="Site Description">
            <input
              type="text"
              value={((settings.site_metadata as Record<string, string>)?.description) || ""}
              onChange={(e) =>
                updateSetting("site_metadata", {
                  ...(settings.site_metadata as Record<string, string>),
                  description: e.target.value,
                })
              }
              className="settings-input"
            />
          </SettingsField>
        </SettingsCard>

        {/* Social Links */}
        <SettingsCard title="Social Links">
          <SettingsField label="Instagram URL">
            <input
              type="url"
              value={((settings.social_links as Record<string, string>)?.instagram) || ""}
              onChange={(e) =>
                updateSetting("social_links", {
                  ...(settings.social_links as Record<string, string>),
                  instagram: e.target.value,
                })
              }
              className="settings-input"
            />
          </SettingsField>
          <SettingsField label="Facebook URL">
            <input
              type="url"
              value={((settings.social_links as Record<string, string>)?.facebook) || ""}
              onChange={(e) =>
                updateSetting("social_links", {
                  ...(settings.social_links as Record<string, string>),
                  facebook: e.target.value,
                })
              }
              className="settings-input"
            />
          </SettingsField>
        </SettingsCard>

        {/* Contact Info */}
        <SettingsCard title="Contact Info">
          <SettingsField label="Email">
            <input
              type="email"
              value={((settings.contact as Record<string, string>)?.email) || ""}
              onChange={(e) =>
                updateSetting("contact", {
                  ...(settings.contact as Record<string, string>),
                  email: e.target.value,
                })
              }
              className="settings-input"
            />
          </SettingsField>
          <SettingsField label="Phone">
            <input
              type="text"
              value={((settings.contact as Record<string, string>)?.phone) || ""}
              onChange={(e) =>
                updateSetting("contact", {
                  ...(settings.contact as Record<string, string>),
                  phone: e.target.value,
                })
              }
              className="settings-input"
            />
          </SettingsField>
        </SettingsCard>

        {/* Site Behavior */}
        <SettingsCard title="Site Behavior">
          <SettingsField label="Homepage Override">
            <select
              value={((settings.site_behavior as Record<string, unknown>)?.homepage_page_id as string) || ""}
              onChange={(e) =>
                updateSetting("site_behavior", {
                  ...(settings.site_behavior as Record<string, unknown>),
                  homepage_page_id: e.target.value || null,
                })
              }
              className="settings-input"
            >
              <option value="">Use page with slug "/" (default)</option>
              {pages
                .filter((p) => p.is_published)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.slug}
                  </option>
                ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              The selected page will load when visitors go to your root URL.
            </p>
          </SettingsField>
          <SettingsField label="Hide Site Navbar">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean((settings.site_behavior as Record<string, unknown>)?.hide_navbar)}
                onChange={(e) =>
                  updateSetting("site_behavior", {
                    ...(settings.site_behavior as Record<string, unknown>),
                    hide_navbar: e.target.checked,
                  })
                }
                className="accent-teal w-4 h-4"
              />
              <span className="text-sm text-charcoal">
                Disable the global navbar on every page
              </span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              Per-page navbar sections still render.
            </p>
          </SettingsField>
          <SettingsField label="Permanent Popup">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={Boolean((settings.site_behavior as Record<string, unknown>)?.popup_enabled)}
                onChange={(e) =>
                  updateSetting("site_behavior", {
                    ...(settings.site_behavior as Record<string, unknown>),
                    popup_enabled: e.target.checked,
                  })
                }
                className="accent-teal w-4 h-4"
              />
              <span className="text-sm text-charcoal">
                Enable a permanent popup over every page
              </span>
            </label>
            <select
              value={((settings.site_behavior as Record<string, unknown>)?.popup_page_id as string) || ""}
              onChange={(e) =>
                updateSetting("site_behavior", {
                  ...(settings.site_behavior as Record<string, unknown>),
                  popup_page_id: e.target.value || null,
                })
              }
              className="settings-input"
              disabled={!((settings.site_behavior as Record<string, unknown>)?.popup_enabled)}
            >
              <option value="">— Select popup content page —</option>
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.slug}{p.is_published ? "" : " (draft)"}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Build the popup like any page — pick which page renders inside the modal.
              When enabled, background clicks and scrolling are disabled.
            </p>
          </SettingsField>
        </SettingsCard>

        {/* Editor Preferences */}
        <SettingsCard title="Editor">
          <SettingsField label="Edit Pane Mode">
            <div className="flex flex-col sm:flex-row gap-3">
              {(["floating", "static"] as const).map((mode) => (
                <label
                  key={mode}
                  className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    editPaneMode === mode
                      ? "border-teal bg-teal/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="edit_pane_mode"
                    value={mode}
                    checked={editPaneMode === mode}
                    onChange={() => {
                      setEditPaneMode(mode);
                      localStorage.setItem("vf_editPaneMode", mode);
                    }}
                    className="accent-teal"
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal capitalize">{mode === "static" ? "Docked" : "Floating"}</p>
                    <p className="text-xs text-gray-400">
                      {mode === "floating"
                        ? "Editor overlays page content"
                        : "Editor docks to side, content resizes"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </SettingsField>
        </SettingsCard>

        {/* Raw JSON editor for advanced settings */}
        <SettingsCard title="Advanced (JSON)">
          <textarea
            value={JSON.stringify(settings, null, 2)}
            onChange={(e) => {
              try {
                setSettings(JSON.parse(e.target.value));
              } catch {
                // Invalid JSON
              }
            }}
            className="w-full p-3 border border-gray-200 rounded-lg font-mono text-xs"
            rows={15}
          />
        </SettingsCard>
      </div>

      <style jsx>{`
        :global(.settings-input) {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }
        :global(.settings-input:focus) {
          border-color: #1CA288;
          box-shadow: 0 0 0 2px rgba(28, 162, 136, 0.1);
        }
      `}</style>
    </div>
  );
}

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
      <h3 className="font-display font-semibold text-charcoal mb-4">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SettingsField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
