"use client";

import { useState, useEffect } from "react";
import type { Section } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";
import ImagePicker from "./ImagePicker";
import {
  type SiteStyles,
  type ButtonStyle,
  EMPTY_SITE_STYLES,
  buttonStyleToCSS,
} from "@/lib/styles";

interface Props {
  section: Section;
  onSave: (data: Record<string, unknown>, settings?: Record<string, unknown>) => void;
  saving: boolean;
}

export default function SectionEditorPanel({ section, onSave, saving }: Props) {
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
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateSettings = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <style jsx>{`
        .input-sm {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #e5e7eb;
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
        <div className="space-y-3">
          <Field label="Heading Title">
            <input
              type="text"
              value={((data.heading as Record<string, unknown>)?.title as string) || ""}
              onChange={(e) =>
                updateData("heading", {
                  ...(data.heading as Record<string, unknown>),
                  title: e.target.value,
                })
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
          <Field label="Items">
            <ArrayEditor
              items={(data.items as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("items", items)}
              fields={["title", "description"]}
            />
          </Field>
        </div>
      );

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

    case "wave_divider":
      return (
        <div className="space-y-3">
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
        </div>
      );

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
        <div className="space-y-3">
          <Field label="Heading">
            <input
              type="text"
              value={(data.heading as string) || ""}
              onChange={(e) => updateData("heading", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Cards">
            <ArrayEditor
              items={(data.cards as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("cards", items)}
              fields={["title", "subtitle", "body"]}
            />
          </Field>
        </div>
      );

    case "event_cards":
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
          <Field label="Events">
            <ArrayEditor
              items={(data.events as Array<Record<string, string>>) || []}
              onChange={(items) => updateData("events", items)}
              fields={["name", "location", "dates", "description", "tag", "href", "ticketUrl"]}
            />
          </Field>
        </div>
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
          <Field label="Event Name">
            <input
              type="text"
              value={(overlay.eventName as string) || ""}
              onChange={(e) => updateOverlay("eventName", e.target.value)}
              className="input-sm"
            />
          </Field>
          <Field label="Tagline">
            <input
              type="text"
              value={(overlay.tagline as string) || ""}
              onChange={(e) => updateOverlay("tagline", e.target.value)}
              className="input-sm"
            />
          </Field>
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
          <Field label="Dates">
            <input
              type="text"
              value={(overlay.dates as string) || ""}
              onChange={(e) => updateOverlay("dates", e.target.value)}
              className="input-sm"
              placeholder="e.g. August 20th - 24th, 2026"
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
