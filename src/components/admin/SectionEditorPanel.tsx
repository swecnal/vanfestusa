"use client";

import { useState, useEffect } from "react";
import type { Section } from "@/lib/types";
import RichTextEditor from "./RichTextEditor";
import ImagePicker from "./ImagePicker";

interface Props {
  section: Section;
  onSave: (data: Record<string, unknown>, settings?: Record<string, unknown>) => void;
  saving: boolean;
}

export default function SectionEditorPanel({ section, onSave, saving }: Props) {
  const [data, setData] = useState<Record<string, unknown>>(section.data);
  const [settings, setSettings] = useState<Record<string, unknown>>(section.settings as unknown as Record<string, unknown>);

  useEffect(() => {
    setData(section.data);
    setSettings(section.settings as unknown as Record<string, unknown>);
  }, [section.id, section.data, section.settings]);

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
}: {
  type: string;
  data: Record<string, unknown>;
  updateData: (key: string, value: unknown) => void;
}) {
  switch (type) {
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
        <div className="space-y-3">
          <Field label="Content">
            <RichTextEditor
              content={(data.html as string) || ""}
              onChange={(html) => updateData("html", html)}
            />
          </Field>
          <Field label="Alignment">
            <select
              value={(data.alignment as string) || "left"}
              onChange={(e) => updateData("alignment", e.target.value)}
              className="input-sm"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Field>
        </div>
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

    case "cta_section":
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
        </div>
      );

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
