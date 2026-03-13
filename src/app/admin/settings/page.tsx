"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.settings || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

        {/* Editor Preferences */}
        <SettingsCard title="Editor">
          <SettingsField label="Edit Pane Mode">
            <div className="flex gap-3">
              {(["floating", "static"] as const).map((mode) => (
                <label
                  key={mode}
                  className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    (settings.edit_pane_mode as string || "floating") === mode
                      ? "border-teal bg-teal/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="edit_pane_mode"
                    value={mode}
                    checked={(settings.edit_pane_mode as string || "floating") === mode}
                    onChange={() => updateSetting("edit_pane_mode", mode)}
                    className="accent-teal"
                  />
                  <div>
                    <p className="text-sm font-semibold text-charcoal capitalize">{mode}</p>
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
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
