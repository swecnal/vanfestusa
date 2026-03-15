"use client";

import { useState, useEffect } from "react";
import type { Section, SectionType, BackgroundConfig } from "@/lib/types";
import { SECTION_TYPE_LABELS, SPACING_PRESETS } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";
import ImagePicker from "./ImagePicker";
import BackgroundEditor from "./BackgroundEditor";
import TextStyleEditor from "./TextStyleEditor";
import {
  type SiteStyles,
  type ButtonStyle,
  type TextStyleConfig,
  EMPTY_SITE_STYLES,
  buttonStyleToCSS,
} from "@/lib/styles";

interface Props {
  section: Section;
  onSave: (data: Record<string, unknown>, settings?: Record<string, unknown>) => void;
  saving: boolean;
  onChange?: (data: Record<string, unknown>, settings: Record<string, unknown>) => void;
  stickyButtons?: boolean;
  onUngroupChild?: (accordionId: string, childIndex: number) => void;
  previewMode?: "desktop" | "mobile";
}

export default function SectionEditorPanel({ section, onSave, saving, onChange, stickyButtons, onUngroupChild, previewMode }: Props) {
  const [data, setData] = useState<Record<string, unknown>>(section.data);
  const [settings, setSettings] = useState<Record<string, unknown>>(section.settings as unknown as Record<string, unknown>);
  const [siteStyles, setSiteStyles] = useState<SiteStyles>(EMPTY_SITE_STYLES);

  useEffect(() => {
    setData(section.data);
    setSettings(section.settings as unknown as Record<string, unknown>);
  }, [section.id, section.data, section.settings]);

  // Fetch saved button/link styles once
  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.settings || {};
        setSiteStyles({
          button_styles: s.button_styles || { main: [], secondary: [] },
          link_styles: s.link_styles || { primary: [], secondary: [] },
          heading_styles: s.heading_styles || EMPTY_SITE_STYLES.heading_styles,
        });
      })
      .catch(() => {});
  }, []);

  const updateData = (key: string, value: unknown) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      onChange?.(next, settings);
      return next;
    });
  };

  const updateSettings = (key: string, value: unknown) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      onChange?.(data, next);
      return next;
    });
  };

  const handleSave = () => {
    onSave(data, settings);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Common settings */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-50">
          Section Settings
        </summary>
        <div className="p-3 space-y-3 border-t border-gray-100">
          <BackgroundEditor
            value={settings.bgConfig as BackgroundConfig | undefined}
            onChange={(cfg) => {
              const next = { ...settings, bgConfig: cfg, bgColor: undefined };
              setSettings(next);
              onChange?.(data, next);
            }}
          />

          {/* Padding */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">Padding</label>
            <div className="flex gap-1 mb-1.5">
              {(["compact", "comfortable", "spacious"] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    const vals = SPACING_PRESETS.padding[preset];
                    const next = { ...settings, paddingTop: vals.top, paddingBottom: vals.bottom, paddingLeft: vals.left, paddingRight: vals.right, paddingPreset: preset, paddingY: undefined };
                    setSettings(next);
                    onChange?.(data, next);
                  }}
                  className={`flex-1 text-[10px] py-1 rounded border transition-colors capitalize ${
                    (settings.paddingPreset as string) === preset
                      ? "bg-teal/15 border-teal text-teal font-semibold"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(["Top", "Bottom", "Left", "Right"] as const).map((dir) => {
                const key = `padding${dir}` as keyof typeof settings;
                return (
                  <div key={dir}>
                    <label className="text-[9px] text-gray-400">{dir}</label>
                    <input
                      type="text"
                      value={(settings[key] as string) || ""}
                      onChange={(e) => {
                        const next = { ...settings, [key]: e.target.value || undefined, paddingPreset: null, paddingY: undefined };
                        setSettings(next);
                        onChange?.(data, next);
                      }}
                      className="input-sm"
                      placeholder="0px"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Margin */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">Margin</label>
            <div className="flex gap-1 mb-1.5">
              {(["compact", "comfortable", "spacious"] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    const vals = SPACING_PRESETS.margin[preset];
                    const next = { ...settings, marginTop: vals.top, marginBottom: vals.bottom, marginLeft: vals.left, marginRight: vals.right, marginPreset: preset };
                    setSettings(next);
                    onChange?.(data, next);
                  }}
                  className={`flex-1 text-[10px] py-1 rounded border transition-colors capitalize ${
                    (settings.marginPreset as string) === preset
                      ? "bg-teal/15 border-teal text-teal font-semibold"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1">
              {(["Top", "Bottom", "Left", "Right"] as const).map((dir) => {
                const key = `margin${dir}` as keyof typeof settings;
                return (
                  <div key={dir}>
                    <label className="text-[9px] text-gray-400">{dir}</label>
                    <input
                      type="text"
                      value={(settings[key] as string) || ""}
                      onChange={(e) => {
                        const next = { ...settings, [key]: e.target.value || undefined, marginPreset: null };
                        setSettings(next);
                        onChange?.(data, next);
                      }}
                      className="input-sm"
                      placeholder="0px"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Field label="Section ID (anchor)">
            <input
              type="text"
              value={(settings.sectionId as string) || ""}
              onChange={(e) => updateSettings("sectionId", e.target.value || undefined)}
              className="input-sm"
              placeholder="e.g. schedule"
            />
          </Field>
          <Field label="Max Width">
            <select
              value={(settings.maxWidth as string) || ""}
              onChange={(e) => updateSettings("maxWidth", e.target.value || undefined)}
              className="input-sm"
            >
              <option value="">Default</option>
              <option value="max-w-3xl">Narrow</option>
              <option value="max-w-4xl">Medium</option>
              <option value="max-w-5xl">Wide</option>
              <option value="max-w-6xl">Extra Wide</option>
              <option value="max-w-7xl">Full</option>
            </select>
          </Field>

          {/* Device Visibility */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">Device Visibility</label>
            <div className="flex gap-1">
              {([
                { value: "both", label: "Both" },
                { value: "desktop_only", label: "Desktop" },
                { value: "mobile_only", label: "Mobile" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const next = { ...settings, deviceVisibility: opt.value === "both" ? undefined : opt.value };
                    setSettings(next);
                    onChange?.(data, next);
                  }}
                  className={`flex-1 text-[10px] py-1 rounded border transition-colors ${
                    ((settings.deviceVisibility as string) || "both") === opt.value
                      ? "bg-teal/15 border-teal text-teal font-semibold"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* Mobile Settings */}
      <details className="border border-gray-200 rounded-lg" open={previewMode === "mobile"}>
        <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-50">
          Mobile Settings
        </summary>
        <div className="p-3 space-y-3 border-t border-gray-100">
          {/* Auto / Custom toggle */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1">Mobile Mode</label>
            <div className="flex gap-1">
              {([
                { value: "auto", label: "Auto", desc: "Tailwind handles responsive" },
                { value: "custom", label: "Custom", desc: "Configure mobile overrides" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    const next = { ...settings, mobileMode: opt.value === "auto" ? undefined : opt.value };
                    setSettings(next);
                    onChange?.(data, next);
                  }}
                  className={`flex-1 text-[10px] py-1 rounded border transition-colors ${
                    ((settings.mobileMode as string) || "auto") === opt.value
                      ? "bg-teal/15 border-teal text-teal font-semibold"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-1">
              {((settings.mobileMode as string) || "auto") === "auto"
                ? "Responsive layout handled automatically"
                : "Configure custom mobile padding, margin, max width & background"}
            </p>
          </div>

          {(settings.mobileMode as string) === "custom" && (
            <>
              {/* Mobile Padding */}
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Mobile Padding</label>
                <div className="flex gap-1 mb-1.5">
                  {(["compact", "comfortable", "spacious"] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        const vals = SPACING_PRESETS.padding[preset];
                        const next = { ...settings, mobilePaddingTop: vals.top, mobilePaddingBottom: vals.bottom, mobilePaddingLeft: vals.left, mobilePaddingRight: vals.right, mobilePaddingPreset: preset };
                        setSettings(next);
                        onChange?.(data, next);
                      }}
                      className={`flex-1 text-[10px] py-1 rounded border transition-colors capitalize ${
                        (settings.mobilePaddingPreset as string) === preset
                          ? "bg-teal/15 border-teal text-teal font-semibold"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {(["Top", "Bottom", "Left", "Right"] as const).map((dir) => {
                    const key = `mobilePadding${dir}` as keyof typeof settings;
                    return (
                      <div key={dir}>
                        <label className="text-[9px] text-gray-400">{dir}</label>
                        <input
                          type="text"
                          value={(settings[key] as string) || ""}
                          onChange={(e) => {
                            const next = { ...settings, [key]: e.target.value || undefined, mobilePaddingPreset: null };
                            setSettings(next);
                            onChange?.(data, next);
                          }}
                          className="input-sm"
                          placeholder="0px"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Margin */}
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Mobile Margin</label>
                <div className="flex gap-1 mb-1.5">
                  {(["compact", "comfortable", "spacious"] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        const vals = SPACING_PRESETS.margin[preset];
                        const next = { ...settings, mobileMarginTop: vals.top, mobileMarginBottom: vals.bottom, mobileMarginLeft: vals.left, mobileMarginRight: vals.right, mobileMarginPreset: preset };
                        setSettings(next);
                        onChange?.(data, next);
                      }}
                      className={`flex-1 text-[10px] py-1 rounded border transition-colors capitalize ${
                        (settings.mobileMarginPreset as string) === preset
                          ? "bg-teal/15 border-teal text-teal font-semibold"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {(["Top", "Bottom", "Left", "Right"] as const).map((dir) => {
                    const key = `mobileMargin${dir}` as keyof typeof settings;
                    return (
                      <div key={dir}>
                        <label className="text-[9px] text-gray-400">{dir}</label>
                        <input
                          type="text"
                          value={(settings[key] as string) || ""}
                          onChange={(e) => {
                            const next = { ...settings, [key]: e.target.value || undefined, mobileMarginPreset: null };
                            setSettings(next);
                            onChange?.(data, next);
                          }}
                          className="input-sm"
                          placeholder="0px"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Max Width */}
              <Field label="Mobile Max Width">
                <select
                  value={(settings.mobileMaxWidth as string) || ""}
                  onChange={(e) => {
                    const next = { ...settings, mobileMaxWidth: e.target.value || undefined };
                    setSettings(next);
                    onChange?.(data, next);
                  }}
                  className="input-sm"
                >
                  <option value="">Default</option>
                  <option value="max-w-sm">Small</option>
                  <option value="max-w-md">Medium</option>
                  <option value="max-w-lg">Large</option>
                  <option value="max-w-xl">XL</option>
                  <option value="max-w-full">Full</option>
                </select>
              </Field>

              {/* Mobile Background */}
              <BackgroundEditor
                value={settings.mobileBgConfig as BackgroundConfig | undefined}
                onChange={(cfg) => {
                  const next = { ...settings, mobileBgConfig: cfg };
                  setSettings(next);
                  onChange?.(data, next);
                }}
              />
            </>
          )}
        </div>
      </details>

      {/* Dynamic editor based on section type */}
      <SectionFields
        type={section.section_type}
        data={data}
        updateData={updateData}
        siteStyles={siteStyles}
        sectionId={section.id}
        onUngroupChild={onUngroupChild}
      />

      {/* Save button */}
      <div className={stickyButtons ? "sticky bottom-0 bg-white pt-2 pb-1 border-t border-gray-100 -mx-4 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]" : ""}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <style jsx>{`
        .input-sm {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #c4c8cf;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
        }
        .input-sm:focus {
          border-color: #1CA288;
          box-shadow: 0 0 0 2px rgba(28, 162, 136, 0.1);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionFields({
  type,
  data,
  updateData,
  siteStyles,
  sectionId,
  onUngroupChild,
}: {
  type: string;
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
  siteStyles: SiteStyles;
  sectionId?: string;
  onUngroupChild?: (accordionId: string, childIndex: number) => void;
}) {
  switch (type) {
    case "hero_carousel":
      return (
        <HeroCarouselEditor data={data} updateData={updateData} siteStyles={siteStyles} />
      );

    case "hero_simple":
      return (
        <div className="space-y-3">
          <Field label="Title">
            <RichTextEditor content={(data.title as string) || ""} onChange={(html) => updateData("title", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Subtitle">
            <RichTextEditor content={(data.subtitle as string) || ""} onChange={(html) => updateData("subtitle", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Background Image">
            <ImagePicker
              value={(data.bgImage as string) || ""}
              onChange={(url) => updateData("bgImage", url)}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(data.light as boolean) || false}
              onChange={(e) => updateData("light", e.target.checked)}
            />
            Light text (dark background)
          </label>
        </div>
      );

    case "text_block":
      return (
        <TextBlockEditor data={data} updateData={updateData} siteStyles={siteStyles} />
      );

    case "feature_grid":
      return (
        <FeatureGridEditor data={data} updateData={updateData} siteStyles={siteStyles} />
      );

    case "accordion_parent": {
      const accChildren = (data.children as Array<Record<string, string>>) || [];
      const updateAccChild = (index: number, key: string, value: string) => {
        const next = [...accChildren];
        next[index] = { ...next[index], [key]: value };
        updateData("children", next);
      };
      const removeAccChild = (index: number) => {
        updateData("children", accChildren.filter((_, i) => i !== index));
      };
      const moveAccChild = (from: number, to: number) => {
        if (to < 0 || to >= accChildren.length) return;
        const next = [...accChildren];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        updateData("children", next);
      };
      return (
        <div className="space-y-3">
          <Field label="Title">
            <RichTextEditor content={(data.title as string) || ""} onChange={(html) => updateData("title", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Image">
            <ImagePicker
              value={(data.image as string) || ""}
              onChange={(url) => updateData("image", url)}
            />
          </Field>
          {(data.image as string) && (
            <Field label="Image Position">
              <select
                value={(data.imagePosition as string) || "full-width"}
                onChange={(e) => updateData("imagePosition", e.target.value)}
                className="input-sm"
              >
                <option value="full-width">Full Width</option>
                <option value="small-left">Small Left</option>
                <option value="small-right">Small Right</option>
                <option value="background">Background</option>
              </select>
            </Field>
          )}
          <Field label="Description">
            <RichTextEditor content={(data.description as string) || ""} onChange={(html) => updateData("description", html)} siteStyles={siteStyles} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(data.showExpandAll as boolean) ?? true}
              onChange={(e) => updateData("showExpandAll", e.target.checked)}
            />
            Show Expand/Collapse All
          </label>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-700">Accordion Items ({accChildren.length})</p>
              <button
                onClick={() => updateData("children", [...accChildren, { title: "New Item", body: "<p>Content</p>" }])}
                className="text-teal hover:text-teal-dark text-xs font-semibold"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {accChildren.map((child, i) => (
                <details key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <summary className="px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                    <span className="text-gray-400 text-xs w-5">{i + 1}.</span>
                    <span className="flex-1 truncate">{child.title || "Untitled"}</span>
                    {child.sectionType && (
                      <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal/10 text-teal flex-shrink-0">
                        {SECTION_TYPE_LABELS[child.sectionType as SectionType] || child.sectionType}
                      </span>
                    )}
                    <span className="flex gap-0.5">
                      <button
                        onClick={(e) => { e.preventDefault(); moveAccChild(i, i - 1); }}
                        disabled={i === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); moveAccChild(i, i + 1); }}
                        disabled={i === accChildren.length - 1}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); removeAccChild(i); }}
                        className="text-gray-300 hover:text-red-500 p-0.5"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  </summary>
                  <div className="p-3 border-t border-gray-100 space-y-2">
                    <Field label="Title">
                      <input
                        type="text"
                        value={child.title || ""}
                        onChange={(e) => updateAccChild(i, "title", e.target.value)}
                        className="input-sm"
                      />
                    </Field>
                    {child.sectionType ? (
                      <div className="flex items-center gap-2 py-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-teal/10 text-teal border border-teal/20">
                          {SECTION_TYPE_LABELS[child.sectionType as SectionType] || child.sectionType}
                        </span>
                        <span className="text-xs text-gray-400 flex-1">Embedded section</span>
                        {onUngroupChild && sectionId && (
                          <button
                            onClick={() => onUngroupChild(sectionId, i)}
                            className="text-[10px] font-semibold text-orange-500 hover:text-orange-700 transition-colors flex items-center gap-1"
                            title="Extract back to standalone section"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                            </svg>
                            Ungroup
                          </button>
                        )}
                      </div>
                    ) : (
                      <Field label="Content">
                        <RichTextEditor
                          content={child.body || ""}
                          onChange={(html) => updateAccChild(i, "body", html)}
                          siteStyles={siteStyles}
                        />
                      </Field>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "faq_accordion":
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <RichTextEditor content={(data.heading as string) || ""} onChange={(html) => updateData("heading", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="FAQ Items">
            <ArrayEditor
              items={(data.items as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("items", items)}
              fields={["question", "answer"]}
            />
          </Field>
        </div>
      );

    case "cta_section": {
      const ctaButtons = (data.buttons as Array<Record<string, unknown>>) || [];
      const updateCtaButton = (index: number, key: string, value: unknown) => {
        const next = [...ctaButtons];
        next[index] = { ...next[index], [key]: value };
        updateData("buttons", next);
      };
      return (
        <div className="space-y-3">
          <Field label="Title">
            <RichTextEditor content={(data.title as string) || ""} onChange={(html) => updateData("title", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Subtitle">
            <RichTextEditor content={(data.subtitle as string) || ""} onChange={(html) => updateData("subtitle", html)} siteStyles={siteStyles} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(data.light as boolean) || false}
              onChange={(e) => updateData("light", e.target.checked)}
            />
            Light text
          </label>
          {ctaButtons.map((btn, i) => (
            <details key={i} open={i === 0} className="border border-gray-200 rounded-lg">
              <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
                Button {i + 1}: {(btn.text as string) || "Untitled"}
              </summary>
              <div className="p-3 space-y-3 border-t border-gray-100">
                <Field label="Text">
                  <input type="text" value={(btn.text as string) || ""} onChange={(e) => updateCtaButton(i, "text", e.target.value)} className="input-sm" />
                </Field>
                <Field label="URL">
                  <input type="text" value={(btn.href as string) || ""} onChange={(e) => updateCtaButton(i, "href", e.target.value)} className="input-sm" />
                </Field>
                <Field label="Variant">
                  <select value={(btn.variant as string) || "primary"} onChange={(e) => updateCtaButton(i, "variant", e.target.value)} className="input-sm">
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                  </select>
                </Field>
                <ButtonStylePicker
                  value={btn.styleId as string | undefined}
                  onChange={(id) => updateCtaButton(i, "styleId", id)}
                  siteStyles={siteStyles}
                />
                <button
                  onClick={() => updateData("buttons", ctaButtons.filter((_, idx) => idx !== i))}
                  className="text-red-400 hover:text-red-600 text-xs font-semibold"
                >
                  Remove Button
                </button>
              </div>
            </details>
          ))}
          <button
            onClick={() => updateData("buttons", [...ctaButtons, { text: "Button", href: "#", variant: "primary" }])}
            className="text-teal hover:text-teal-dark text-xs font-semibold"
          >
            + Add Button
          </button>
        </div>
      );
    }

    case "wave_divider": {
      const dividerType = (data.dividerType as string) || "wave";
      const showShapeColors = ["wave", "zigzag", "curve", "straight", "gradient", "clouds", "bubbles", "paint_spill", "digital_fade"].includes(dividerType);
      const showFrequency = ["wave", "zigzag"].includes(dividerType);
      const showIntensity = ["wave", "zigzag", "curve", "clouds", "bubbles", "paint_spill", "digital_fade"].includes(dividerType);
      const showConvoyFields = dividerType === "convoy";
      const showStreamFields = dividerType === "stream";
      const showFestivalFields = dividerType === "festival";
      const festivalEls = (data.festivalElements as Record<string, boolean>) || {};
      return (
        <div className="space-y-3">
          <Field label="Divider Type">
            <select
              value={dividerType}
              onChange={(e) => updateData("dividerType", e.target.value)}
              className="input-sm"
            >
              <option value="wave">Wave</option>
              <option value="zigzag">Zigzag</option>
              <option value="curve">Curve</option>
              <option value="straight">Straight</option>
              <option value="convoy">Scroll Convoy</option>
              <option value="stream">Auto Stream</option>
              <option value="festival">Festival Scene</option>
              <option value="gradient">Gradient</option>
              <option value="clouds">Clouds</option>
              <option value="bubbles">Bubbles</option>
              <option value="paint_spill">Paint Spill</option>
              <option value="digital_fade">Digital Fade</option>
            </select>
          </Field>

          {showShapeColors && (
            <>
              <Field label="Top Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(() => { const c = (data.fromColor as string) || "#ffffff"; return c === "white" ? "#ffffff" : c; })()}
                    onChange={(e) => updateData("fromColor", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={(data.fromColor as string) || "white"}
                    onChange={(e) => updateData("fromColor", e.target.value)}
                    className="input-sm flex-1"
                    placeholder="#hex or name"
                  />
                </div>
              </Field>
              <Field label={`Top Opacity: ${(data.fromColorOpacity as number) ?? 100}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={(data.fromColorOpacity as number) ?? 100}
                  onChange={(e) => updateData("fromColorOpacity", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label="Bottom Color">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(data.toColor as string) || "#1a1a1a"}
                    onChange={(e) => updateData("toColor", e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  />
                  <input
                    type="text"
                    value={(data.toColor as string) || "#1a1a1a"}
                    onChange={(e) => updateData("toColor", e.target.value)}
                    className="input-sm flex-1"
                    placeholder="#hex or name"
                  />
                </div>
              </Field>
              <Field label={`Bottom Opacity: ${(data.toColorOpacity as number) ?? 100}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={(data.toColorOpacity as number) ?? 100}
                  onChange={(e) => updateData("toColorOpacity", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label={`Height: ${(data.height as number) || 60}px`}>
                <input
                  type="range"
                  min={20}
                  max={200}
                  value={(data.height as number) || 60}
                  onChange={(e) => updateData("height", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(data.flip as boolean) || false}
                  onChange={(e) => updateData("flip", e.target.checked)}
                />
                Flip vertically
              </label>
            </>
          )}

          {showFrequency && (
            <Field label={`Frequency: ${(data.frequency as number) || 2}`}>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={(data.frequency as number) || 2}
                onChange={(e) => updateData("frequency", Number(e.target.value))}
                className="w-full"
              />
            </Field>
          )}

          {showIntensity && (
            <Field label={`Intensity: ${(data.intensity as number) || 50}%`}>
              <input
                type="range"
                min={1}
                max={100}
                value={(data.intensity as number) || 50}
                onChange={(e) => updateData("intensity", Number(e.target.value))}
                className="w-full"
              />
            </Field>
          )}

          {showConvoyFields && (
            <>
              <Field label="Seed">
                <input
                  type="number"
                  value={(data.seed as number) || 42}
                  onChange={(e) => updateData("seed", Number(e.target.value))}
                  className="input-sm"
                />
              </Field>
              <Field label="Vehicle Count">
                <input
                  type="number"
                  value={(data.count as number) || 6}
                  onChange={(e) => updateData("count", Number(e.target.value))}
                  className="input-sm"
                  min={1}
                  max={20}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(data.reverse as boolean) || false}
                  onChange={(e) => updateData("reverse", e.target.checked)}
                />
                Reverse direction
              </label>
              <Field label={`Speed: ${((data.convoySpeed as number) || 1).toFixed(1)}x`}>
                <input
                  type="range"
                  min={0.3}
                  max={3}
                  step={0.1}
                  value={(data.convoySpeed as number) || 1}
                  onChange={(e) => updateData("convoySpeed", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label={`Randomness: ${(data.convoyRandomness as number) || 50}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={(data.convoyRandomness as number) || 50}
                  onChange={(e) => updateData("convoyRandomness", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label={`Vehicle Gap: ${(data.vehicleGap as number) || 60}px`}>
                <input
                  type="range"
                  min={20}
                  max={200}
                  value={(data.vehicleGap as number) || 60}
                  onChange={(e) => updateData("vehicleGap", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
            </>
          )}

          {showStreamFields && (
            <>
              <Field label="Seed">
                <input
                  type="number"
                  value={(data.streamSeed as number) || 777}
                  onChange={(e) => updateData("streamSeed", Number(e.target.value))}
                  className="input-sm"
                />
              </Field>
              <Field label="Vehicle Count">
                <input
                  type="number"
                  value={(data.streamCount as number) || 14}
                  onChange={(e) => updateData("streamCount", Number(e.target.value))}
                  className="input-sm"
                  min={1}
                  max={30}
                />
              </Field>
              <Field label={`Speed: ${((data.streamSpeed as number) || 1).toFixed(1)}x`}>
                <input
                  type="range"
                  min={0.3}
                  max={3}
                  step={0.1}
                  value={(data.streamSpeed as number) || 1}
                  onChange={(e) => updateData("streamSpeed", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <Field label={`Randomness: ${(data.streamRandomness as number) || 50}%`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={(data.streamRandomness as number) || 50}
                  onChange={(e) => updateData("streamRandomness", Number(e.target.value))}
                  className="w-full"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(data.showDrivers as boolean) || false}
                  onChange={(e) => updateData("showDrivers", e.target.checked)}
                />
                Show drivers
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(data.showPassengers as boolean) || false}
                  onChange={(e) => updateData("showPassengers", e.target.checked)}
                />
                Show passengers
              </label>
            </>
          )}

          {showFestivalFields && (
            <>
              <Field label="Seed">
                <input
                  type="number"
                  value={(data.festivalSeed as number) || 42}
                  onChange={(e) => updateData("festivalSeed", Number(e.target.value))}
                  className="input-sm"
                />
              </Field>
              <Field label="Background Color">
                <input
                  type="text"
                  value={(data.festivalBgColor as string) || "#F5F0E8"}
                  onChange={(e) => updateData("festivalBgColor", e.target.value)}
                  className="input-sm"
                  placeholder="#F5F0E8"
                />
              </Field>
              <p className="text-xs text-gray-500 font-semibold mt-1">Scene Elements</p>
              {([
                ["tents", "Camping Tents"],
                ["vendorBooths", "Vendor Booths"],
                ["stage", "Stage & Band"],
                ["dancing", "Dancing People"],
                ["campfireWithPeople", "Campfire w/ People"],
                ["campfireSolo", "Solo Campfire"],
                ["convertedVans", "Converted Vans & Buses"],
                ["peopleMeandering", "People Walking"],
                ["walkingPeople", "Walking Across Scene"],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={festivalEls[key] ?? (key !== "campfireSolo")}
                    onChange={(e) => {
                      const els = { ...festivalEls, [key]: e.target.checked };
                      updateData("festivalElements", els);
                    }}
                  />
                  {label}
                </label>
              ))}
            </>
          )}
        </div>
      );
    }

    case "vehicle_convoy":
    case "vehicle_stream":
      return (
        <div className="p-3 text-sm text-gray-500 italic">
          This section type has been consolidated into the Divider section. Add a new Divider and select the appropriate type from the dropdown.
        </div>
      );

    case "html_block":
      return (
        <div className="space-y-3">
          <Field label="HTML Content">
            <textarea
              value={(data.html as string) || ""}
              onChange={(e) => updateData("html", e.target.value)}
              className="input-sm font-mono"
              rows={10}
            />
          </Field>
        </div>
      );

    case "image_gallery":
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <RichTextEditor content={(data.heading as string) || ""} onChange={(html) => updateData("heading", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Columns">
            <select
              value={String(data.columns || 3)}
              onChange={(e) => updateData("columns", Number(e.target.value))}
              className="input-sm"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(data.enableLightbox as boolean) !== false}
              onChange={(e) => updateData("enableLightbox", e.target.checked)}
            />
            Enable lightbox
          </label>
        </div>
      );

    case "two_column_cards":
      return (
        <ColumnCardsEditor data={data} updateData={updateData} siteStyles={siteStyles} />
      );

    case "event_cards":
      return (
        <EventCardsEditor data={data} updateData={updateData} siteStyles={siteStyles} />
      );

    case "cta_cards":
      return (
        <div className="space-y-3">
          <Field label="Heading Title">
            <RichTextEditor content={((data.heading as Record<string, unknown>)?.title as string) || ""} onChange={(html) => updateData("heading", { ...(data.heading as Record<string, unknown>), title: html })} siteStyles={siteStyles} />
          </Field>
          <Field label="Columns">
            <select
              value={String(data.columns || 3)}
              onChange={(e) => updateData("columns", Number(e.target.value))}
              className="input-sm"
            >
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </Field>
          <Field label="Cards">
            <ArrayEditor
              items={(data.cards as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("cards", items)}
              fields={["title", "description", "href"]}
            />
          </Field>
        </div>
      );

    case "sponsor_marquee":
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <RichTextEditor content={(data.heading as string) || "Our Sponsors"} onChange={(html) => updateData("heading", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Subheading">
            <RichTextEditor content={(data.subheading as string) || "Proudly supported by these amazing brands"} onChange={(html) => updateData("subheading", html)} siteStyles={siteStyles} />
          </Field>
          <details className="border border-gray-200 rounded-lg" open>
            <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-50">Button</summary>
            <div className="p-3 space-y-2 border-t border-gray-100">
              <Field label="Text">
                <input
                  type="text"
                  value={(data.ctaText as string) || "Become a Sponsor"}
                  onChange={(e) => updateData("ctaText", e.target.value)}
                  className="input-sm"
                />
              </Field>
              <Field label="URL">
                <input
                  type="text"
                  value={(data.ctaHref as string) || "/get-involved#sponsors"}
                  onChange={(e) => updateData("ctaHref", e.target.value)}
                  className="input-sm"
                />
              </Field>
              <ButtonStylePicker
                value={data.ctaStyleId as string | undefined}
                onChange={(id) => updateData("ctaStyleId", id)}
                siteStyles={siteStyles}
                label="Style"
              />
            </div>
          </details>
          <Field label="Sponsors">
            <ArrayEditor
              items={(data.sponsors as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("sponsors", items)}
              fields={["name", "logo", "websiteUrl"]}
            />
          </Field>
        </div>
      );

    case "image_carousel": {
      const icHeading = typeof data.heading === "string"
        ? { title: data.heading, subtitle: (data.subheading as string) || "" }
        : (data.heading as Record<string, unknown>) || {};
      const updateICHeading = (key: string, value: unknown) => {
        updateData("heading", { ...icHeading, [key]: value });
      };
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <RichTextEditor content={(icHeading.title as string) || ""} onChange={(html) => updateICHeading("title", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Subheading">
            <RichTextEditor content={(icHeading.subtitle as string) || ""} onChange={(html) => updateICHeading("subtitle", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Background Image">
            <ImagePicker
              value={(data.bgImage as string) || ""}
              onChange={(url) => updateData("bgImage", url)}
            />
          </Field>
          <Field label="Autoplay (ms)">
            <input
              type="number"
              value={(data.autoplayInterval as number) || 4000}
              onChange={(e) => updateData("autoplayInterval", Number(e.target.value))}
              className="input-sm"
              min={1000}
              step={500}
            />
          </Field>
          <Field label="Images">
            <ImageArrayEditor
              images={(data.images as Array<{ src: string; alt: string }>) || []}
              onChange={(images) => updateData("images", images)}
            />
          </Field>
          {/* CTA Buttons */}
          {((data.ctaButtons as Array<Record<string, unknown>>) || []).map((btn, i) => {
            const ctaBtns = (data.ctaButtons as Array<Record<string, unknown>>) || [];
            const updateCtaBtn = (key: string, value: unknown) => {
              const next = [...ctaBtns];
              next[i] = { ...next[i], [key]: value };
              updateData("ctaButtons", next);
            };
            return (
              <details key={i} className="border border-gray-200 rounded-lg">
                <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
                  Button {i + 1}: {(btn.text as string) || "Untitled"}
                </summary>
                <div className="p-3 space-y-3 border-t border-gray-100">
                  <Field label="Text">
                    <input type="text" value={(btn.text as string) || ""} onChange={(e) => updateCtaBtn("text", e.target.value)} className="input-sm" />
                  </Field>
                  <Field label="URL">
                    <input type="text" value={(btn.href as string) || ""} onChange={(e) => updateCtaBtn("href", e.target.value)} className="input-sm" />
                  </Field>
                  <Field label="Variant">
                    <select value={(btn.variant as string) || "primary"} onChange={(e) => updateCtaBtn("variant", e.target.value)} className="input-sm">
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="outline">Outline</option>
                    </select>
                  </Field>
                  <ButtonStylePicker
                    value={btn.styleId as string | undefined}
                    onChange={(id) => updateCtaBtn("styleId", id)}
                    siteStyles={siteStyles}
                  />
                  <button
                    onClick={() => updateData("ctaButtons", ctaBtns.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-600 text-xs font-semibold"
                  >
                    Remove Button
                  </button>
                </div>
              </details>
            );
          })}
          <button
            onClick={() => updateData("ctaButtons", [...((data.ctaButtons as Array<Record<string, unknown>>) || []), { text: "Button", href: "#", variant: "primary" }])}
            className="text-teal hover:text-teal-dark text-xs font-semibold"
          >
            + Add Button
          </button>
        </div>
      );
    }

    case "photo_strip":
      return (
        <div className="space-y-3">
          <Field label="Height">
            <input
              type="text"
              value={(data.height as string) || ""}
              onChange={(e) => updateData("height", e.target.value)}
              className="input-sm"
              placeholder="e.g. 200px"
            />
          </Field>
          <Field label="Columns">
            <input
              type="number"
              value={(data.columns as number) || 4}
              onChange={(e) => updateData("columns", Number(e.target.value))}
              className="input-sm"
              min={1}
              max={8}
            />
          </Field>
          <Field label="Images">
            <ImageArrayEditor
              images={(data.images as Array<{ src: string; alt: string }>) || []}
              onChange={(images) => updateData("images", images)}
            />
          </Field>
        </div>
      );

    case "contact_form":
      return (
        <div className="space-y-3">
          <Field label="Recipient Email">
            <input
              type="email"
              value={(data.recipientEmail as string) || ""}
              onChange={(e) => updateData("recipientEmail", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Form Heading">
            <RichTextEditor content={(data.formHeading as string) || ""} onChange={(html) => updateData("formHeading", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Intro Text">
            <textarea
              value={(data.introText as string) || ""}
              onChange={(e) => updateData("introText", e.target.value)}
              className="input-sm"
              rows={3}
            />
          </Field>
        </div>
      );

    case "schedule_accordion":
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <RichTextEditor content={(data.heading as string) || ""} onChange={(html) => updateData("heading", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Disclaimer">
            <input
              type="text"
              value={(data.disclaimer as string) || ""}
              onChange={(e) => updateData("disclaimer", e.target.value)}
              className="input-sm"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(data.showExpandAll as boolean) !== false}
              onChange={(e) => updateData("showExpandAll", e.target.checked)}
            />
            Show expand all button
          </label>
          <details className="border border-gray-200 rounded-lg">
            <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer">
              Days (JSON)
            </summary>
            <textarea
              value={JSON.stringify(data.days || [], null, 2)}
              onChange={(e) => {
                try { updateData("days", JSON.parse(e.target.value)); } catch {}
              }}
              className="w-full p-3 border-t border-gray-200 font-mono text-xs"
              rows={12}
            />
          </details>
        </div>
      );

    case "sponsor_tiers":
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <RichTextEditor content={(data.heading as string) || ""} onChange={(html) => updateData("heading", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Intro Text">
            <textarea
              value={(data.introText as string) || ""}
              onChange={(e) => updateData("introText", e.target.value)}
              className="input-sm"
              rows={2}
            />
          </Field>
          <Field label="CTA Text">
            <input
              type="text"
              value={(data.ctaText as string) || ""}
              onChange={(e) => updateData("ctaText", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Accent Color">
            <input
              type="text"
              value={(data.accentColor as string) || ""}
              onChange={(e) => updateData("accentColor", e.target.value)}
              className="input-sm"
              placeholder="#hex or color name"
            />
          </Field>
          <details className="border border-gray-200 rounded-lg">
            <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer">
              Tiers (JSON)
            </summary>
            <textarea
              value={JSON.stringify(data.tiers || [], null, 2)}
              onChange={(e) => {
                try { updateData("tiers", JSON.parse(e.target.value)); } catch {}
              }}
              className="w-full p-3 border-t border-gray-200 font-mono text-xs"
              rows={15}
            />
          </details>
        </div>
      );

    case "sponsor_list": {
      const slHeading = (data.heading as Record<string, unknown>) || {};
      const slSponsors = (data.sponsors as Array<Record<string, unknown>>) || [];
      const updateSLHeading = (key: string, value: unknown) => {
        updateData("heading", { ...slHeading, [key]: value });
      };
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <RichTextEditor content={(slHeading.title as string) || ""} onChange={(html) => updateSLHeading("title", html)} siteStyles={siteStyles} />
          </Field>
          <Field label="Subtitle">
            <RichTextEditor content={(slHeading.subtitle as string) || ""} onChange={(html) => updateSLHeading("subtitle", html)} siteStyles={siteStyles} />
          </Field>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(slHeading.light as boolean) || false}
              onChange={(e) => updateSLHeading("light", e.target.checked)}
              className="accent-teal"
            />
            <span className="text-xs text-gray-600">Light text (for dark backgrounds)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(data.showExpandAll as boolean) !== false}
              onChange={(e) => updateData("showExpandAll", e.target.checked)}
              className="accent-teal"
            />
            <span className="text-xs text-gray-600">Show Expand/Collapse All</span>
          </label>
          <details className="border border-gray-200 rounded-lg">
            <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer">
              Sponsors ({slSponsors.length})
            </summary>
            <div className="p-3 space-y-3 border-t border-gray-100 max-h-[400px] overflow-y-auto">
              {slSponsors.map((sp, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-gray-400">Sponsor {i + 1}</span>
                    <button
                      onClick={() => updateData("sponsors", slSponsors.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <Field label="Name">
                    <input
                      type="text"
                      value={(sp.name as string) || ""}
                      onChange={(e) => {
                        const next = [...slSponsors];
                        next[i] = { ...next[i], name: e.target.value };
                        updateData("sponsors", next);
                      }}
                      className="input-sm"
                    />
                  </Field>
                  <Field label="Logo">
                    <ImagePicker
                      value={(sp.logo as string) || ""}
                      onChange={(url) => {
                        const next = [...slSponsors];
                        next[i] = { ...next[i], logo: url };
                        updateData("sponsors", next);
                      }}
                    />
                  </Field>
                  <Field label="Website URL">
                    <input
                      type="text"
                      value={(sp.websiteUrl as string) || ""}
                      onChange={(e) => {
                        const next = [...slSponsors];
                        next[i] = { ...next[i], websiteUrl: e.target.value };
                        updateData("sponsors", next);
                      }}
                      className="input-sm"
                      placeholder="https://..."
                    />
                  </Field>
                  <Field label="Category">
                    <select
                      value={(sp.category as string) || "official_sponsor"}
                      onChange={(e) => {
                        const next = [...slSponsors];
                        next[i] = { ...next[i], category: e.target.value };
                        updateData("sponsors", next);
                      }}
                      className="input-sm"
                    >
                      <option value="presenting_partner">Presenting Partner</option>
                      <option value="premier_sponsor">Premier Sponsor</option>
                      <option value="feature_sponsor">Feature Sponsor</option>
                      <option value="official_sponsor">Official Sponsor</option>
                      <option value="digital_sponsor">Digital Sponsor</option>
                      <option value="exhibiting_vendor">Exhibiting Vendor</option>
                      <option value="community_partner">Community Partner</option>
                    </select>
                  </Field>
                  <Field label="Description">
                    <input
                      type="text"
                      value={(sp.description as string) || ""}
                      onChange={(e) => {
                        const next = [...slSponsors];
                        next[i] = { ...next[i], description: e.target.value };
                        updateData("sponsors", next);
                      }}
                      className="input-sm"
                    />
                  </Field>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(sp.darkBg as boolean) || false}
                      onChange={(e) => {
                        const next = [...slSponsors];
                        next[i] = { ...next[i], darkBg: e.target.checked };
                        updateData("sponsors", next);
                      }}
                      className="accent-teal"
                    />
                    <span className="text-xs text-gray-600">Dark logo background</span>
                  </label>
                </div>
              ))}
              <button
                onClick={() => updateData("sponsors", [...slSponsors, { name: "", logo: "", category: "official_sponsor" }])}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500 hover:border-teal hover:text-teal transition-colors"
              >
                + Add Sponsor
              </button>
            </div>
          </details>
        </div>
      );
    }

    default:
      return (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 italic">
            Edit the JSON data for this section:
          </p>
          <textarea
            value={JSON.stringify(data, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                Object.keys(parsed).forEach((key) => updateData(key, parsed[key]));
              } catch {
                // Invalid JSON, ignore
              }
            }}
            className="w-full p-3 border border-gray-200 rounded-lg font-mono text-xs"
            rows={15}
          />
        </div>
      );
  }
}

function ArrayEditor({
  items,
  onChange,
  fields,
}: {
  items: Array<Record<string, string>>;
  onChange: (items: Array<Record<string, string>>) => void;
  fields: string[];
}) {
  const updateItem = (index: number, field: string, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const addItem = () => {
    const empty: Record<string, string> = {};
    fields.forEach((f) => (empty[f] = ""));
    onChange([...items, empty]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-2 space-y-1.5 relative">
          <button
            onClick={() => removeItem(i)}
            className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm transition-colors"
            title="Remove"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {fields.map((field) => (
            <div key={field}>
              <label className="text-[10px] text-gray-400 uppercase">{field}</label>
              {field === "answer" || field === "description" || field === "body" ? (
                <textarea
                  value={item[field] || ""}
                  onChange={(e) => updateItem(i, field, e.target.value)}
                  className="w-full p-1.5 border border-gray-200 rounded text-xs"
                  rows={2}
                />
              ) : (
                <input
                  type="text"
                  value={item[field] || ""}
                  onChange={(e) => updateItem(i, field, e.target.value)}
                  className="w-full p-1.5 border border-gray-200 rounded text-xs"
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={addItem}
        className="text-teal hover:text-teal-dark text-xs font-semibold transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}

function ImageArrayEditor({
  images,
  onChange,
}: {
  images: Array<{ src: string; alt: string }>;
  onChange: (images: Array<{ src: string; alt: string }>) => void;
}) {
  const updateImage = (index: number, field: "src" | "alt", value: string) => {
    const next = [...images];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {images.map((img, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-2 relative">
          <div className="flex items-start gap-2">
            {img.src && (
              <img src={img.src} alt={img.alt} className="w-16 h-12 object-cover rounded flex-shrink-0" />
            )}
            <div className="flex-1 space-y-1">
              <ImagePicker
                value={img.src}
                onChange={(url) => updateImage(i, "src", url)}
              />
              <input
                type="text"
                value={img.alt}
                onChange={(e) => updateImage(i, "alt", e.target.value)}
                className="w-full p-1.5 border border-gray-200 rounded text-xs"
                placeholder="Alt text"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => moveImage(i, i - 1)}
                disabled={i === 0}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => moveImage(i, i + 1)}
                disabled={i === images.length - 1}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-20 p-0.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="text-gray-300 hover:text-red-500 p-0.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...images, { src: "", alt: "" }])}
        className="text-teal hover:text-teal-dark text-xs font-semibold transition-colors"
      >
        + Add Image
      </button>
    </div>
  );
}

function HeroCarouselEditor({
  data,
  updateData,
  siteStyles,
}: {
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
  siteStyles: SiteStyles;
}) {
  const [showJson, setShowJson] = useState(false);
  const slides = (data.slides as Array<{ image: string; alt: string }>) || [];
  const overlay = (data.overlay as Record<string, unknown>) || {};
  const primaryCta = (overlay.primaryCta as Record<string, unknown>) || {};
  const secondaryCta = (overlay.secondaryCta as Record<string, unknown>) || {};

  const updateOverlay = (key: string, value: unknown) => {
    updateData("overlay", { ...overlay, [key]: value });
  };

  const updatePrimaryCta = (key: string, value: unknown) => {
    updateData("overlay", {
      ...overlay,
      primaryCta: { ...primaryCta, [key]: value },
    });
  };

  const updateSecondaryCta = (key: string, value: unknown) => {
    updateData("overlay", {
      ...overlay,
      secondaryCta: { ...secondaryCta, [key]: value },
    });
  };

  if (showJson) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500">JSON Editor</p>
          <button
            onClick={() => setShowJson(false)}
            className="text-xs text-teal hover:text-teal-dark font-semibold"
          >
            Switch to UI
          </button>
        </div>
        <textarea
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              Object.keys(parsed).forEach((key) => updateData(key, parsed[key]));
            } catch {}
          }}
          className="w-full p-3 border border-gray-200 rounded-lg font-mono text-xs"
          rows={20}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500">Hero Carousel</p>
        <button
          onClick={() => setShowJson(true)}
          className="text-xs text-teal hover:text-teal-dark font-semibold"
        >
          Edit as JSON
        </button>
      </div>

      {/* Slides */}
      <details open className="border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
          Slides ({slides.length})
        </summary>
        <div className="p-3 border-t border-gray-100">
          <ImageArrayEditor
            images={slides.map((s) => ({ src: s.image, alt: s.alt }))}
            onChange={(imgs) =>
              updateData(
                "slides",
                imgs.map((img) => ({ image: img.src, alt: img.alt }))
              )
            }
          />
        </div>
      </details>

      {/* Overlay */}
      <details open className="border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
          Overlay Content
        </summary>
        <div className="p-3 space-y-3 border-t border-gray-100">
          <Field label="Label (above title)">
            <RichTextEditor
              content={(overlay.label as string) || ""}
              onChange={(html) => updateOverlay("label", html)}
              siteStyles={siteStyles}
            />
          </Field>
          <Field label="Main Text">
            <RichTextEditor
              content={(overlay.eventName as string) || ""}
              onChange={(html) => updateOverlay("eventName", html)}
              siteStyles={siteStyles}
            />
          </Field>
          <Field label="Tagline">
            <RichTextEditor
              content={(overlay.tagline as string) || ""}
              onChange={(html) => updateOverlay("tagline", html)}
              siteStyles={siteStyles}
            />
          </Field>
          <Field label="Location">
            <RichTextEditor
              content={(overlay.location as string) || ""}
              onChange={(html) => updateOverlay("location", html)}
              siteStyles={siteStyles}
            />
          </Field>
          <Field label="Location URL (Google Maps)">
            <input
              type="url"
              value={(overlay.locationUrl as string) || ""}
              onChange={(e) => updateOverlay("locationUrl", e.target.value)}
              className="input-sm"
              placeholder="https://www.google.com/maps/..."
            />
          </Field>
          <Field label="Dates">
            <RichTextEditor
              content={(overlay.dates as string) || ""}
              onChange={(html) => updateOverlay("dates", html)}
              siteStyles={siteStyles}
            />
          </Field>
        </div>
      </details>

      {/* Primary CTA */}
      <details open className="border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
          Primary Button
        </summary>
        <div className="p-3 space-y-3 border-t border-gray-100">
          <Field label="Button Text">
            <input
              type="text"
              value={(primaryCta.text as string) || ""}
              onChange={(e) => updatePrimaryCta("text", e.target.value)}
              className="input-sm"
              placeholder="Get Tickets"
            />
          </Field>
          <Field label="Button URL">
            <input
              type="url"
              value={(primaryCta.href as string) || ""}
              onChange={(e) => updatePrimaryCta("href", e.target.value)}
              className="input-sm"
              placeholder="https://..."
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(primaryCta.external as boolean) !== false}
              onChange={(e) => updatePrimaryCta("external", e.target.checked)}
            />
            Open in new tab
          </label>
          <ButtonStylePicker
            value={primaryCta.styleId as string | undefined}
            onChange={(id) => updatePrimaryCta("styleId", id)}
            siteStyles={siteStyles}
          />
        </div>
      </details>

      {/* Secondary CTA */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
          Secondary Button
        </summary>
        <div className="p-3 space-y-3 border-t border-gray-100">
          <Field label="Button Text">
            <input
              type="text"
              value={(secondaryCta.text as string) || ""}
              onChange={(e) => updateSecondaryCta("text", e.target.value)}
              className="input-sm"
              placeholder="Learn More"
            />
          </Field>
          <Field label="Button URL">
            <input
              type="text"
              value={(secondaryCta.href as string) || ""}
              onChange={(e) => updateSecondaryCta("href", e.target.value)}
              className="input-sm"
              placeholder="/events/escape"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={(secondaryCta.external as boolean) || false}
              onChange={(e) => updateSecondaryCta("external", e.target.checked)}
            />
            Open in new tab
          </label>
          <ButtonStylePicker
            value={secondaryCta.styleId as string | undefined}
            onChange={(id) => updateSecondaryCta("styleId", id)}
            siteStyles={siteStyles}
          />
        </div>
      </details>

      {/* Autoplay */}
      <Field label="Autoplay Interval (ms)">
        <input
          type="number"
          value={(data.autoplayInterval as number) || 5000}
          onChange={(e) => updateData("autoplayInterval", Number(e.target.value))}
          className="input-sm"
          min={1000}
          step={500}
        />
      </Field>
    </div>
  );
}

function TextBlockEditor({
  data,
  updateData,
  siteStyles,
  onSiteStylesChange,
}: {
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
  siteStyles: SiteStyles;
  onSiteStylesChange?: () => void;
}) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const html = (data.html as string) || "";
  const alignment = (data.alignment as string) || "left";

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {(["visual", "html"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === m
                ? "bg-teal text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {m === "visual" ? "Editor" : "HTML"}
          </button>
        ))}
      </div>

      {mode === "visual" && (
        <RichTextEditor
          content={html}
          onChange={(newHtml) => updateData("html", newHtml)}
          siteStyles={siteStyles}
          onSiteStylesChange={onSiteStylesChange}
        />
      )}

      {mode === "html" && (
        <textarea
          value={html}
          onChange={(e) => updateData("html", e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-lg font-mono text-xs leading-relaxed"
          rows={12}
          spellCheck={false}
        />
      )}

      <Field label="Alignment">
        <select
          value={alignment}
          onChange={(e) => updateData("alignment", e.target.value)}
          className="input-sm"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={(data.prose as boolean) !== false}
          onChange={(e) => updateData("prose", e.target.checked)}
        />
        Apply prose typography
      </label>
    </div>
  );
}

function EventCardsEditor({
  data,
  updateData,
  siteStyles,
}: {
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
  siteStyles: SiteStyles;
}) {
  const heading = (data.heading as Record<string, unknown>) || {};
  const events = (data.events as Array<Record<string, unknown>>) || [];

  const updateEvent = (index: number, key: string, value: unknown) => {
    const next = [...events];
    next[index] = { ...next[index], [key]: value };
    updateData("events", next);
  };

  return (
    <div className="space-y-3">
      <Field label="Heading Title">
        <RichTextEditor content={(heading.title as string) || ""} onChange={(html) => updateData("heading", { ...heading, title: html })} siteStyles={siteStyles} />
      </Field>
      <Field label="Heading Subtitle">
        <RichTextEditor content={(heading.subtitle as string) || ""} onChange={(html) => updateData("heading", { ...heading, subtitle: html })} siteStyles={siteStyles} />
      </Field>

      {/* Layout controls */}
      <Field label="Columns">
        <select
          value={String(data.columns || 2)}
          onChange={(e) => updateData("columns", Number(e.target.value))}
          className="input-sm"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </Field>
      <Field label="Layout">
        <select
          value={(data.layout as string) || "equal"}
          onChange={(e) => updateData("layout", e.target.value)}
          className="input-sm"
        >
          <option value="equal">Equal</option>
          <option value="featured">Featured (one larger)</option>
        </select>
      </Field>
      {(data.layout as string) === "featured" && (
        <Field label="Featured Index (0-based)">
          <input
            type="number"
            value={(data.featuredIndex as number) ?? 0}
            onChange={(e) => updateData("featuredIndex", Number(e.target.value))}
            className="input-sm"
            min={0}
            max={events.length - 1}
          />
        </Field>
      )}

      {/* Element-level text styles */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-50">
          Text Styles (all cards)
        </summary>
        <div className="p-3 space-y-2 border-t border-gray-100">
          <TextStyleEditor label="Title Style" value={(data.titleStyle as TextStyleConfig) || {}} onChange={(s) => updateData("titleStyle", s)} defaults={{ fontSize: "text-3xl / text-5xl (featured)", fontWeight: "900", fontFamily: "Gothic A1" }} />
          <TextStyleEditor label="Location Style" value={(data.locationStyle as TextStyleConfig) || {}} onChange={(s) => updateData("locationStyle", s)} defaults={{ fontSize: "14px", fontWeight: "600" }} />
          <TextStyleEditor label="Date Style" value={(data.dateStyle as TextStyleConfig) || {}} onChange={(s) => updateData("dateStyle", s)} defaults={{ fontSize: "14px", fontWeight: "600" }} />
          <TextStyleEditor label="Description Style" value={(data.descriptionStyle as TextStyleConfig) || {}} onChange={(s) => updateData("descriptionStyle", s)} defaults={{ fontSize: "14px" }} />
          <TextStyleEditor label="Tag Style" value={(data.tagStyle as TextStyleConfig) || {}} onChange={(s) => updateData("tagStyle", s)} defaults={{ fontSize: "12px", fontWeight: "700" }} />
        </div>
      </details>

      {/* Individual events */}
      {events.map((ev, i) => (
        <details key={i} className="border border-gray-200 rounded-lg">
          <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
            Event {i + 1}: {(ev.name as string) || "Untitled"}
          </summary>
          <div className="p-3 space-y-3 border-t border-gray-100">
            <Field label="Event Name">
              <input type="text" value={(ev.name as string) || ""} onChange={(e) => updateEvent(i, "name", e.target.value)} className="input-sm" />
            </Field>
            <Field label="Location">
              <input type="text" value={(ev.location as string) || ""} onChange={(e) => updateEvent(i, "location", e.target.value)} className="input-sm" />
            </Field>
            <Field label="Dates">
              <input type="text" value={(ev.dates as string) || ""} onChange={(e) => updateEvent(i, "dates", e.target.value)} className="input-sm" />
            </Field>
            <Field label="Description">
              <textarea value={(ev.description as string) || ""} onChange={(e) => updateEvent(i, "description", e.target.value)} className="input-sm" rows={2} />
            </Field>
            <Field label="Tag">
              <input type="text" value={(ev.tag as string) || ""} onChange={(e) => updateEvent(i, "tag", e.target.value)} className="input-sm" />
            </Field>
            <Field label="Link (href)">
              <input type="text" value={(ev.href as string) || ""} onChange={(e) => updateEvent(i, "href", e.target.value)} className="input-sm" />
            </Field>
            <Field label="Ticket URL">
              <input type="text" value={(ev.ticketUrl as string) || ""} onChange={(e) => updateEvent(i, "ticketUrl", e.target.value)} className="input-sm" />
            </Field>
            <Field label="Gradient (CSS)">
              <input type="text" value={(ev.gradient as string) || ""} onChange={(e) => updateEvent(i, "gradient", e.target.value)} className="input-sm" placeholder="from-teal to-charcoal" />
            </Field>
            <Field label="Image">
              <ImagePicker value={(ev.image as string) || ""} onChange={(url) => updateEvent(i, "image", url)} />
            </Field>
            <Field label="Font Override">
              <input type="text" value={(ev.fontOverride as string) || ""} onChange={(e) => updateEvent(i, "fontOverride", e.target.value)} className="input-sm" placeholder="e.g. EB Garamond" />
            </Field>

            {/* Per-event overlay */}
            <Field label="Overlay Color">
              <div className="flex gap-2">
                <input type="color" value={(ev.overlayColor as string) || "#000000"} onChange={(e) => updateEvent(i, "overlayColor", e.target.value)} className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={(ev.overlayColor as string) || ""} onChange={(e) => updateEvent(i, "overlayColor", e.target.value)} className="flex-1 p-1.5 border border-gray-200 rounded text-xs" placeholder="Default (from gradient)" />
              </div>
            </Field>
            <Field label="Overlay Opacity (0-100)">
              <input type="number" value={(ev.overlayOpacity as number) ?? ""} onChange={(e) => updateEvent(i, "overlayOpacity", e.target.value ? Number(e.target.value) : undefined)} className="input-sm" min={0} max={100} placeholder="Default" />
            </Field>

            <button
              onClick={() => updateData("events", events.filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-600 text-xs font-semibold"
            >
              Remove Event
            </button>
          </div>
        </details>
      ))}
      <button
        onClick={() => updateData("events", [...events, { name: "New Event", location: "", dates: "", description: "", gradient: "from-teal to-charcoal", tag: "", image: "", href: "#", ticketUrl: "#" }])}
        className="text-teal hover:text-teal-dark text-xs font-semibold transition-colors"
      >
        + Add Event
      </button>
    </div>
  );
}

function FeatureGridEditor({
  data,
  updateData,
  siteStyles,
}: {
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
  siteStyles: SiteStyles;
}) {
  const heading = (data.heading as Record<string, unknown>) || {};
  const items = (data.items as Array<Record<string, unknown>>) || [];

  const updateItem = (index: number, key: string, value: unknown) => {
    const next = [...items];
    next[index] = { ...next[index], [key]: value };
    updateData("items", next);
  };

  const updateItemAction = (index: number, key: string, value: unknown) => {
    const next = [...items];
    const action = (next[index].action as Record<string, unknown>) || { type: "button", text: "", href: "" };
    next[index] = { ...next[index], action: { ...action, [key]: value } };
    updateData("items", next);
  };

  return (
    <div className="space-y-3">
      <Field label="Heading Title">
        <RichTextEditor content={(heading.title as string) || ""} onChange={(html) => updateData("heading", { ...heading, title: html })} siteStyles={siteStyles} />
      </Field>
      <Field label="Heading Subtitle">
        <RichTextEditor content={(heading.subtitle as string) || ""} onChange={(html) => updateData("heading", { ...heading, subtitle: html })} siteStyles={siteStyles} />
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={(heading.light as boolean) || false}
          onChange={(e) => updateData("heading", { ...heading, light: e.target.checked })}
        />
        Light text (dark background)
      </label>
      <Field label="Columns">
        <select
          value={String(data.columns || 3)}
          onChange={(e) => updateData("columns", Number(e.target.value))}
          className="input-sm"
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </Field>

      {items.map((item, i) => (
        <details key={i} className="border border-gray-200 rounded-lg">
          <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50">
            Item {i + 1}: {(item.title as string) || "Untitled"}
          </summary>
          <div className="p-3 space-y-3 border-t border-gray-100">
            <Field label="Title">
              <input type="text" value={(item.title as string) || ""} onChange={(e) => updateItem(i, "title", e.target.value)} className="input-sm" />
            </Field>
            <TextStyleEditor label="Title Style" value={(item.titleStyle as TextStyleConfig) || {}} onChange={(s) => updateItem(i, "titleStyle", s)} defaults={{ fontSize: "18px (text-lg)", fontWeight: "700", fontFamily: "Gothic A1" }} />
            <Field label="Subtitle">
              <input type="text" value={(item.subtitle as string) || ""} onChange={(e) => updateItem(i, "subtitle", e.target.value)} className="input-sm" />
            </Field>
            <TextStyleEditor label="Subtitle Style" value={(item.subtitleStyle as TextStyleConfig) || {}} onChange={(s) => updateItem(i, "subtitleStyle", s)} defaults={{ fontSize: "14px", fontWeight: "400" }} />
            <Field label="Description">
              <textarea value={(item.description as string) || ""} onChange={(e) => updateItem(i, "description", e.target.value)} className="input-sm" rows={2} />
            </Field>
            <TextStyleEditor label="Description Style" value={(item.descriptionStyle as TextStyleConfig) || {}} onChange={(s) => updateItem(i, "descriptionStyle", s)} defaults={{ fontSize: "14px" }} />

            {/* Icon */}
            <Field label="Icon SVG">
              <textarea
                value={(item.iconSvg as string) || ""}
                onChange={(e) => updateItem(i, "iconSvg", e.target.value)}
                className="input-sm font-mono"
                rows={2}
                placeholder='<svg>...</svg>'
              />
            </Field>
            <Field label="Icon Image (alternative to SVG)">
              <ImagePicker value={(item.iconImage as string) || ""} onChange={(url) => updateItem(i, "iconImage", url)} />
            </Field>
            <p className="text-[10px] text-gray-400 italic">Recommended: 64x64px. Icon image overrides SVG if both set.</p>

            {/* Action */}
            <details className="border border-gray-100 rounded-lg">
              <summary className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase cursor-pointer hover:bg-gray-50">
                Action (Button/Link)
              </summary>
              <div className="p-2 space-y-2 border-t border-gray-100">
                <Field label="Type">
                  <select
                    value={((item.action as Record<string, unknown>)?.type as string) || "button"}
                    onChange={(e) => updateItemAction(i, "type", e.target.value)}
                    className="input-sm"
                  >
                    <option value="button">Button</option>
                    <option value="link">Link</option>
                  </select>
                </Field>
                <Field label="Text">
                  <input type="text" value={((item.action as Record<string, unknown>)?.text as string) || ""} onChange={(e) => updateItemAction(i, "text", e.target.value)} className="input-sm" />
                </Field>
                <Field label="URL">
                  <input type="text" value={((item.action as Record<string, unknown>)?.href as string) || ""} onChange={(e) => updateItemAction(i, "href", e.target.value)} className="input-sm" />
                </Field>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={((item.action as Record<string, unknown>)?.external as boolean) || false} onChange={(e) => updateItemAction(i, "external", e.target.checked)} />
                  Open in new tab
                </label>
                {((item.action as Record<string, unknown>)?.type as string) === "button" && (
                  <ButtonStylePicker
                    value={(item.action as Record<string, unknown>)?.styleId as string | undefined}
                    onChange={(id) => updateItemAction(i, "styleId", id)}
                    siteStyles={siteStyles}
                  />
                )}
                {((item.action as Record<string, unknown>)?.text as string) && (
                  <button
                    onClick={() => updateItem(i, "action", undefined)}
                    className="text-red-400 hover:text-red-600 text-[10px] font-semibold"
                  >
                    Remove Action
                  </button>
                )}
              </div>
            </details>

            <button
              onClick={() => updateData("items", items.filter((_, idx) => idx !== i))}
              className="text-red-400 hover:text-red-600 text-xs font-semibold"
            >
              Remove Item
            </button>
          </div>
        </details>
      ))}
      <button
        onClick={() => updateData("items", [...items, { title: "New Feature", description: "" }])}
        className="text-teal hover:text-teal-dark text-xs font-semibold transition-colors"
      >
        + Add Item
      </button>
    </div>
  );
}

function ColumnCardsEditor({
  data,
  updateData,
  siteStyles,
}: {
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
  siteStyles: SiteStyles;
}) {
  const cards = (data.cards as Array<Record<string, unknown>>) || [];
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  // Derive layout: use explicit layout or fall back to legacy columns
  const legacyCols = (data.columns as number) || 2;
  const layout: number[] = (data.layout as number[]) || (cards.length > 0
    ? (() => {
        const rows: number[] = [];
        let remaining = cards.length;
        while (remaining > 0) {
          const rowSize = Math.min(remaining, legacyCols);
          rows.push(rowSize);
          remaining -= rowSize;
        }
        return rows;
      })()
    : [2]);

  const setLayout = (newLayout: number[], newCards?: Array<Record<string, unknown>>) => {
    updateData("layout", newLayout);
    if (newCards) updateData("cards", newCards);
    // Clear legacy columns field
    updateData("columns", undefined);
  };

  // Convert layout to card index ranges
  const rowRanges: Array<{ start: number; count: number }> = [];
  let idx = 0;
  for (const count of layout) {
    rowRanges.push({ start: idx, count });
    idx += count;
  }

  const updateCard = (index: number, key: string, value: unknown) => {
    const next = [...cards];
    next[index] = { ...next[index], [key]: value };
    updateData("cards", next);
  };

  const updateCardButton = (index: number, key: string, value: unknown) => {
    const next = [...cards];
    const btn = (next[index].button as Record<string, unknown>) || {};
    next[index] = { ...next[index], button: { ...btn, [key]: value } };
    updateData("cards", next);
  };

  const addCardToRow = (rowIndex: number) => {
    if (layout[rowIndex] >= 4) return;
    const insertAt = rowRanges[rowIndex].start + rowRanges[rowIndex].count;
    const newCards = [...cards];
    newCards.splice(insertAt, 0, { title: "New Card", body: "" });
    const newLayout = [...layout];
    newLayout[rowIndex] += 1;
    setLayout(newLayout, newCards);
  };

  const removeCard = (cardIndex: number) => {
    // Find which row this card is in
    let rowIdx = 0;
    let sum = 0;
    for (let r = 0; r < layout.length; r++) {
      if (cardIndex < sum + layout[r]) { rowIdx = r; break; }
      sum += layout[r];
    }
    const newCards = cards.filter((_, i) => i !== cardIndex);
    const newLayout = [...layout];
    newLayout[rowIdx] -= 1;
    // Remove empty rows
    const filtered = newLayout.filter((n) => n > 0);
    setLayout(filtered.length > 0 ? filtered : [1], newCards.length > 0 ? newCards : [{ title: "New Card", body: "" }]);
  };

  const addRow = () => {
    const newCards = [...cards, { title: "New Card", body: "" }];
    const newLayout = [...layout, 1];
    setLayout(newLayout, newCards);
  };

  return (
    <div className="space-y-3">
      <Field label="Heading">
        <RichTextEditor content={(data.heading as string) || ""} onChange={(html) => updateData("heading", html)} siteStyles={siteStyles} />
      </Field>
      <Field label="Heading Subtitle">
        <RichTextEditor content={(data.headingSubtitle as string) || ""} onChange={(html) => updateData("headingSubtitle", html)} siteStyles={siteStyles} />
      </Field>

      {/* Visual tile layout editor */}
      <div>
        <label className="block text-[11px] font-medium text-gray-600 mb-1.5">Card Layout</label>
        <div className="space-y-1.5">
          {rowRanges.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1">
              {Array.from({ length: row.count }).map((_, tileIdx) => {
                const cardIdx = row.start + tileIdx;
                const card = cards[cardIdx];
                const isExpanded = expandedCard === cardIdx;
                return (
                  <button
                    key={tileIdx}
                    onClick={() => setExpandedCard(isExpanded ? null : cardIdx)}
                    className={`relative flex-1 h-10 rounded border text-[9px] font-medium transition-all truncate px-1 ${
                      isExpanded
                        ? "bg-teal/15 border-teal text-teal ring-1 ring-teal/30"
                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    title={card ? (card.title as string) || `Card ${cardIdx + 1}` : `Card ${cardIdx + 1}`}
                  >
                    <span className="block truncate leading-tight mt-0.5">
                      {card ? (card.title as string)?.replace(/<[^>]*>/g, "").substring(0, 12) || `Card ${cardIdx + 1}` : `Card ${cardIdx + 1}`}
                    </span>
                    {/* Red X delete button */}
                    <span
                      onClick={(e) => { e.stopPropagation(); removeCard(cardIdx); }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[8px] leading-none cursor-pointer shadow-sm"
                      title="Remove card"
                    >
                      ✕
                    </span>
                  </button>
                );
              })}
              {/* Add card tile (faded) */}
              {row.count < 4 && (
                <button
                  onClick={() => addCardToRow(rowIdx)}
                  className="flex-1 h-10 rounded border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-300 hover:border-teal/40 hover:text-teal hover:bg-teal/5 flex items-center justify-center transition-all"
                  title="Add card to this row"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        {/* Add row button */}
        <button
          onClick={addRow}
          className="mt-1.5 w-full h-8 rounded border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-300 hover:border-teal/40 hover:text-teal hover:bg-teal/5 flex items-center justify-center gap-1 transition-all text-[10px] font-medium"
          title="Add new row"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Row
        </button>
      </div>

      {/* Expanded card editor */}
      {expandedCard !== null && cards[expandedCard] && (() => {
        const i = expandedCard;
        const card = cards[i];
        return (
          <div className="border border-teal/30 rounded-lg bg-teal/5">
            <div className="px-3 py-2 text-xs font-semibold text-teal border-b border-teal/20 flex items-center justify-between">
              <span>Card {i + 1}: {(card.title as string)?.replace(/<[^>]*>/g, "").substring(0, 30) || "Untitled"}</span>
              <button onClick={() => setExpandedCard(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-3 space-y-3">
              <Field label="Title">
                <input type="text" value={(card.title as string) || ""} onChange={(e) => updateCard(i, "title", e.target.value)} className="input-sm" />
              </Field>
              <TextStyleEditor label="Title Style" value={(card.titleStyle as TextStyleConfig) || {}} onChange={(s) => updateCard(i, "titleStyle", s)} defaults={{ fontSize: "20px (text-xl)", fontWeight: "700", fontFamily: "Gothic A1" }} />
              <Field label="Subtitle">
                <input type="text" value={(card.subtitle as string) || ""} onChange={(e) => updateCard(i, "subtitle", e.target.value)} className="input-sm" />
              </Field>
              <TextStyleEditor label="Subtitle Style" value={(card.subtitleStyle as TextStyleConfig) || {}} onChange={(s) => updateCard(i, "subtitleStyle", s)} defaults={{ fontSize: "12px", fontWeight: "400" }} />
              <Field label="Body">
                <textarea value={(card.body as string) || ""} onChange={(e) => updateCard(i, "body", e.target.value)} className="input-sm" rows={3} />
              </Field>
              <TextStyleEditor label="Body Style" value={(card.bodyStyle as TextStyleConfig) || {}} onChange={(s) => updateCard(i, "bodyStyle", s)} defaults={{ fontSize: "14px" }} />
              <Field label="Background Color">
                <input type="text" value={(card.bgColor as string) || ""} onChange={(e) => updateCard(i, "bgColor", e.target.value)} className="input-sm" placeholder="e.g. bg-sand, #hex" />
              </Field>
              <Field label="Card Image">
                <ImagePicker value={(card.image as string) || ""} onChange={(url) => updateCard(i, "image", url)} />
              </Field>
              {(card.image as string) && (
                <Field label="Image Position">
                  <select value={(card.imagePosition as string) || "full-width"} onChange={(e) => updateCard(i, "imagePosition", e.target.value)} className="input-sm">
                    <option value="full-width">Full Width (top)</option>
                    <option value="small-left">Small Left</option>
                    <option value="small-right">Small Right</option>
                    <option value="small-center">Small Center</option>
                    <option value="background">Background</option>
                  </select>
                </Field>
              )}

              {/* Card Button */}
              <details className="border border-gray-100 rounded-lg">
                <summary className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase cursor-pointer hover:bg-gray-50">
                  Card Button
                </summary>
                <div className="p-2 space-y-2 border-t border-gray-100">
                  <Field label="Text">
                    <input type="text" value={((card.button as Record<string, unknown>)?.text as string) || ""} onChange={(e) => updateCardButton(i, "text", e.target.value)} className="input-sm" placeholder="Button text" />
                  </Field>
                  <Field label="URL">
                    <input type="text" value={((card.button as Record<string, unknown>)?.href as string) || ""} onChange={(e) => updateCardButton(i, "href", e.target.value)} className="input-sm" placeholder="/page or https://..." />
                  </Field>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={((card.button as Record<string, unknown>)?.external as boolean) || false} onChange={(e) => updateCardButton(i, "external", e.target.checked)} />
                    Open in new tab
                  </label>
                  <ButtonStylePicker
                    value={(card.button as Record<string, unknown>)?.styleId as string | undefined}
                    onChange={(id) => updateCardButton(i, "styleId", id)}
                    siteStyles={siteStyles}
                  />
                  {((card.button as Record<string, unknown>)?.text as string) && (
                    <button
                      onClick={() => updateCard(i, "button", undefined)}
                      className="text-red-400 hover:text-red-600 text-[10px] font-semibold"
                    >
                      Remove Button
                    </button>
                  )}
                </div>
              </details>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ButtonStylePicker({
  value,
  onChange,
  siteStyles,
  label,
}: {
  value: string | undefined;
  onChange: (styleId: string | undefined) => void;
  siteStyles: SiteStyles;
  label?: string;
}) {
  const allStyles = [
    ...siteStyles.button_styles.main.map((s) => ({ ...s, group: "Main" })),
    ...siteStyles.button_styles.secondary.map((s) => ({ ...s, group: "Secondary" })),
  ];

  const selected = allStyles.find((s) => s.id === value);

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-500">
        {label || "Button Style"}
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="input-sm"
      >
        <option value="">Default (no style)</option>
        {siteStyles.button_styles.main.length > 0 && (
          <optgroup label="Main Styles">
            {siteStyles.button_styles.main.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
        )}
        {siteStyles.button_styles.secondary.length > 0 && (
          <optgroup label="Secondary Styles">
            {siteStyles.button_styles.secondary.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </optgroup>
        )}
      </select>
      {selected && (
        <div className="mt-1">
          <span
            style={buttonStyleToCSS(selected)}
            className="pointer-events-none"
          >
            {selected.name}
          </span>
        </div>
      )}
      {allStyles.length === 0 && (
        <p className="text-[10px] text-gray-400 italic">
          No styles defined yet. Create them in Styles settings.
        </p>
      )}
    </div>
  );
}
