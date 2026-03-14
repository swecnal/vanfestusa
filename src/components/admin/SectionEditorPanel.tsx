"use client";

import { useState, useEffect } from "react";
import type { Section, SectionType } from "@/lib/types";
import { SECTION_TYPE_LABELS } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";
import ImagePicker from "./ImagePicker";
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
}

export default function SectionEditorPanel({ section, onSave, saving, onChange, stickyButtons }: Props) {
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
      {/* Dynamic editor based on section type */}
      <SectionFields
        type={section.section_type}
        data={data}
        updateData={updateData}
        siteStyles={siteStyles}
      />

      {/* Common settings */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-3 py-2 text-xs font-semibold text-gray-500 cursor-pointer hover:bg-gray-50">
          Section Settings
        </summary>
        <div className="p-3 space-y-3 border-t border-gray-100">
          <Field label="Background Color">
            <select
              value={(settings.bgColor as string) || ""}
              onChange={(e) => updateSettings("bgColor", e.target.value || undefined)}
              className="input-sm"
            >
              <option value="">Default</option>
              <option value="white">White</option>
              <option value="sand">Sand</option>
              <option value="charcoal">Charcoal</option>
            </select>
          </Field>
          <Field label="Padding">
            <select
              value={(settings.paddingY as string) || ""}
              onChange={(e) => updateSettings("paddingY", e.target.value || undefined)}
              className="input-sm"
            >
              <option value="">Default</option>
              <option value="py-8">Small</option>
              <option value="py-12">Medium</option>
              <option value="py-16">Large</option>
              <option value="py-20">Extra Large</option>
            </select>
          </Field>
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
        </div>
      </details>

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
}: {
  type: string;
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
  siteStyles: SiteStyles;
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
            <input
              type="text"
              value={(data.title as string) || ""}
              onChange={(e) => updateData("title", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Subtitle">
            <input
              type="text"
              value={(data.subtitle as string) || ""}
              onChange={(e) => updateData("subtitle", e.target.value)}
              className="input-sm"
            />
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
        <TextBlockEditor data={data} updateData={updateData} />
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
            <input
              type="text"
              value={(data.title as string) || ""}
              onChange={(e) => updateData("title", e.target.value)}
              className="input-sm"
            />
          </Field>
          <TextStyleEditor
            label="Title Style"
            value={(data.titleStyle as TextStyleConfig) || {}}
            onChange={(s) => updateData("titleStyle", s)}
            defaults={{ fontSize: "clamp(1.875rem, 4vw, 2.25rem)", fontWeight: "900" }}
          />
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
            <textarea
              value={(data.description as string) || ""}
              onChange={(e) => updateData("description", e.target.value)}
              className="input-sm"
              rows={3}
            />
          </Field>
          <TextStyleEditor
            label="Description Style"
            value={(data.descriptionStyle as TextStyleConfig) || {}}
            onChange={(s) => updateData("descriptionStyle", s)}
            defaults={{ fontSize: "16px" }}
          />
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
                        <span className="text-xs text-gray-400">Embedded section</span>
                      </div>
                    ) : (
                      <Field label="Content">
                        <RichTextEditor
                          content={child.body || ""}
                          onChange={(html) => updateAccChild(i, "body", html)}
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
            <input
              type="text"
              value={(data.heading as string) || ""}
              onChange={(e) => updateData("heading", e.target.value)}
              className="input-sm"
            />
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
            <input
              type="text"
              value={(data.title as string) || ""}
              onChange={(e) => updateData("title", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Subtitle">
            <input
              type="text"
              value={(data.subtitle as string) || ""}
              onChange={(e) => updateData("subtitle", e.target.value)}
              className="input-sm"
            />
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
      const showShapeColors = ["wave", "zigzag", "curve", "straight"].includes(dividerType);
      const showFrequency = ["wave", "zigzag"].includes(dividerType);
      const showIntensity = ["wave", "zigzag", "curve"].includes(dividerType);
      const showConvoyFields = dividerType === "convoy";
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
              <option value="convoy">Vehicle Convoy</option>
              <option value="festival">Festival Scene</option>
            </select>
          </Field>

          {showShapeColors && (
            <>
              <Field label="From Color">
                <input
                  type="text"
                  value={(data.fromColor as string) || "white"}
                  onChange={(e) => updateData("fromColor", e.target.value)}
                  className="input-sm"
                  placeholder="white or #hex"
                />
              </Field>
              <Field label="To Color">
                <input
                  type="text"
                  value={(data.toColor as string) || "#1a1a1a"}
                  onChange={(e) => updateData("toColor", e.target.value)}
                  className="input-sm"
                  placeholder="#1a1a1a or color name"
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
                ["peopleMeandering", "People Walking"],
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
      return (
        <div className="space-y-3">
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
            <input
              type="text"
              value={(data.heading as string) || ""}
              onChange={(e) => updateData("heading", e.target.value)}
              className="input-sm"
            />
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
        <EventCardsEditor data={data} updateData={updateData} />
      );

    case "cta_cards":
      return (
        <div className="space-y-3">
          <Field label="Heading Title">
            <input
              type="text"
              value={((data.heading as Record<string, unknown>)?.title as string) || ""}
              onChange={(e) =>
                updateData("heading", { ...(data.heading as Record<string, unknown>), title: e.target.value })
              }
              className="input-sm"
            />
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
            <input
              type="text"
              value={(data.heading as string) || "Our Sponsors"}
              onChange={(e) => updateData("heading", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Subheading">
            <input
              type="text"
              value={(data.subheading as string) || ""}
              onChange={(e) => updateData("subheading", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="CTA Text">
            <input
              type="text"
              value={(data.ctaText as string) || "Become a Sponsor"}
              onChange={(e) => updateData("ctaText", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="CTA Link">
            <input
              type="text"
              value={(data.ctaHref as string) || "/get-involved#sponsors"}
              onChange={(e) => updateData("ctaHref", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Sponsors">
            <ArrayEditor
              items={(data.sponsors as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("sponsors", items)}
              fields={["name", "logo", "websiteUrl"]}
            />
          </Field>
        </div>
      );

    case "image_carousel":
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <input
              type="text"
              value={typeof data.heading === "string" ? data.heading : ((data.heading as Record<string, unknown>)?.title as string) || ""}
              onChange={(e) => updateData("heading", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Subheading">
            <input
              type="text"
              value={(data.subheading as string) || ""}
              onChange={(e) => updateData("subheading", e.target.value)}
              className="input-sm"
            />
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
          <Field label="CTA Buttons">
            <ArrayEditor
              items={(data.ctaButtons as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("ctaButtons", items)}
              fields={["text", "href", "variant"]}
            />
          </Field>
        </div>
      );

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
            <input
              type="text"
              value={(data.formHeading as string) || ""}
              onChange={(e) => updateData("formHeading", e.target.value)}
              className="input-sm"
            />
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
            <input
              type="text"
              value={(data.heading as string) || ""}
              onChange={(e) => updateData("heading", e.target.value)}
              className="input-sm"
            />
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
            <input
              type="text"
              value={(data.heading as string) || ""}
              onChange={(e) => updateData("heading", e.target.value)}
              className="input-sm"
            />
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
            className="absolute top-1 right-1 text-gray-300 hover:text-red-500 p-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            <input
              type="text"
              value={(overlay.label as string) || "Next Event"}
              onChange={(e) => updateOverlay("label", e.target.value)}
              className="input-sm"
              placeholder="e.g. Next Event"
            />
          </Field>
          <TextStyleEditor
            label="Label Style"
            value={(overlay.labelStyle as TextStyleConfig) || {}}
            onChange={(s) => updateOverlay("labelStyle", s)}
            defaults={{ fontSize: "text-sm md:text-base", fontWeight: "600", fontFamily: "Gothic A1" }}
          />
          <Field label="Event Name">
            <input
              type="text"
              value={(overlay.eventName as string) || ""}
              onChange={(e) => updateOverlay("eventName", e.target.value)}
              className="input-sm"
            />
          </Field>
          <TextStyleEditor
            label="Event Name Style"
            value={(overlay.eventNameStyle as TextStyleConfig) || {}}
            onChange={(s) => updateOverlay("eventNameStyle", s)}
            defaults={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: "700", fontFamily: "EB Garamond" }}
          />
          <Field label="Tagline">
            <textarea
              value={(overlay.tagline as string) || ""}
              onChange={(e) => updateOverlay("tagline", e.target.value)}
              className="input-sm"
              rows={2}
            />
          </Field>
          <TextStyleEditor
            label="Tagline Style"
            value={(overlay.taglineStyle as TextStyleConfig) || {}}
            onChange={(s) => updateOverlay("taglineStyle", s)}
            defaults={{ fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)", fontWeight: "700" }}
          />
          <Field label="Location">
            <input
              type="text"
              value={(overlay.location as string) || ""}
              onChange={(e) => updateOverlay("location", e.target.value)}
              className="input-sm"
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
          <TextStyleEditor
            label="Location Style"
            value={(overlay.locationStyle as TextStyleConfig) || {}}
            onChange={(s) => updateOverlay("locationStyle", s)}
            defaults={{ fontSize: "text-base md:text-xl", fontWeight: "600" }}
          />
          <Field label="Dates">
            <input
              type="text"
              value={(overlay.dates as string) || ""}
              onChange={(e) => updateOverlay("dates", e.target.value)}
              className="input-sm"
              placeholder="e.g. August 20th - 24th, 2026"
            />
          </Field>
          <TextStyleEditor
            label="Dates Style"
            value={(overlay.datesStyle as TextStyleConfig) || {}}
            onChange={(s) => updateOverlay("datesStyle", s)}
            defaults={{ fontSize: "text-base md:text-xl", fontWeight: "600" }}
          />
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
}: {
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
}) {
  const [mode, setMode] = useState<"visual" | "html" | "preview">("preview");
  const html = (data.html as string) || "";
  const alignment = (data.alignment as string) || "left";

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {(["preview", "visual", "html"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 px-3 py-1.5 text-xs font-semibold transition-colors ${
              mode === m
                ? "bg-teal text-white"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {m === "preview" ? "Preview" : m === "visual" ? "Editor" : "HTML"}
          </button>
        ))}
      </div>

      {mode === "preview" && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-200">
            <p className="text-[10px] text-gray-400 uppercase font-semibold">Live Preview</p>
          </div>
          <div
            className={`p-6 bg-white ${
              alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"
            }`}
          >
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      )}

      {mode === "visual" && (
        <RichTextEditor
          content={html}
          onChange={(newHtml) => updateData("html", newHtml)}
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
}: {
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
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
        <input
          type="text"
          value={(heading.title as string) || ""}
          onChange={(e) => updateData("heading", { ...heading, title: e.target.value })}
          className="input-sm"
        />
      </Field>
      <Field label="Heading Subtitle">
        <input
          type="text"
          value={(heading.subtitle as string) || ""}
          onChange={(e) => updateData("heading", { ...heading, subtitle: e.target.value })}
          className="input-sm"
        />
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
        <input
          type="text"
          value={(heading.title as string) || ""}
          onChange={(e) => updateData("heading", { ...heading, title: e.target.value })}
          className="input-sm"
        />
      </Field>
      <Field label="Heading Subtitle">
        <input
          type="text"
          value={(heading.subtitle as string) || ""}
          onChange={(e) => updateData("heading", { ...heading, subtitle: e.target.value })}
          className="input-sm"
        />
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

  const removeCard = (index: number) => {
    updateData("cards", cards.filter((_, i) => i !== index));
  };

  const addCard = () => {
    updateData("cards", [...cards, { title: "New Card", body: "" }]);
  };

  return (
    <div className="space-y-3">
      <Field label="Heading">
        <input
          type="text"
          value={(data.heading as string) || ""}
          onChange={(e) => updateData("heading", e.target.value)}
          className="input-sm"
        />
      </Field>
      <Field label="Heading Subtitle">
        <input
          type="text"
          value={(data.headingSubtitle as string) || ""}
          onChange={(e) => updateData("headingSubtitle", e.target.value)}
          className="input-sm"
        />
      </Field>
      <Field label="Columns">
        <select
          value={String(data.columns || 2)}
          onChange={(e) => updateData("columns", Number(e.target.value))}
          className="input-sm"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
      </Field>

      {cards.map((card, i) => (
        <details key={i} className="border border-gray-200 rounded-lg">
          <summary className="px-3 py-2 text-xs font-semibold text-gray-600 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
            <span>Card {i + 1}: {(card.title as string) || "Untitled"}</span>
          </summary>
          <div className="p-3 space-y-3 border-t border-gray-100">
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

            <button
              onClick={() => removeCard(i)}
              className="text-red-400 hover:text-red-600 text-xs font-semibold"
            >
              Remove Card
            </button>
          </div>
        </details>
      ))}
      <button
        onClick={addCard}
        className="text-teal hover:text-teal-dark text-xs font-semibold transition-colors"
      >
        + Add Card
      </button>
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
