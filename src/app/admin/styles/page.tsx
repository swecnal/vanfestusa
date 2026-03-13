"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

// ─── Types ───

interface ButtonStyle {
  id: string;
  name: string;
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  textColor: string;
  bgColor: string;
  hoverBgColor: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  paddingX: string;
  paddingY: string;
  shadow: string;
  hoverShadow: string;
  textTransform: string;
}

interface LinkStyle {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  textDecoration: string;
  hoverTextDecoration: string;
  textTransform: string;
  letterSpacing: string;
}

interface StylesData {
  button_styles: {
    main: ButtonStyle[];
    secondary: ButtonStyle[];
  };
  link_styles: {
    primary: LinkStyle[];
    secondary: LinkStyle[];
  };
}

// ─── Defaults ───

const defaultButtonStyle = (type: "main" | "secondary", index: number): ButtonStyle => ({
  id: `${type}-${Date.now()}-${index}`,
  name: type === "main" ? `Main Style ${index + 1}` : `Secondary Style ${index + 1}`,
  fontSize: type === "main" ? "18px" : "14px",
  fontWeight: type === "main" ? "700" : "600",
  fontFamily: "Poppins",
  textColor: "#ffffff",
  bgColor: type === "main" ? "#1CA288" : "#374151",
  hoverBgColor: type === "main" ? "#17806C" : "#1f2937",
  borderWidth: type === "main" ? "0px" : "2px",
  borderColor: type === "main" ? "transparent" : "rgba(255,255,255,0.4)",
  borderRadius: "12px",
  paddingX: type === "main" ? "40px" : "32px",
  paddingY: type === "main" ? "16px" : "12px",
  shadow: type === "main" ? "0 0 30px rgba(28,162,136,0.4)" : "none",
  hoverShadow: type === "main" ? "0 0 50px rgba(28,162,136,0.6)" : "none",
  textTransform: "none",
});

const defaultLinkStyle = (type: "primary" | "secondary", index: number): LinkStyle => ({
  id: `link-${type}-${Date.now()}-${index}`,
  name: type === "primary" ? `Primary Link ${index + 1}` : `Secondary Link ${index + 1}`,
  color: type === "primary" ? "#1CA288" : "#6b7280",
  hoverColor: type === "primary" ? "#17806C" : "#1CA288",
  fontSize: "inherit",
  fontWeight: type === "primary" ? "600" : "400",
  fontFamily: "inherit",
  textDecoration: type === "primary" ? "none" : "underline",
  hoverTextDecoration: "underline",
  textTransform: "none",
  letterSpacing: "normal",
});

const FONT_OPTIONS = [
  "Poppins", "Gothic A1", "EB Garamond", "Orbitron", "inherit",
];

const FONT_WEIGHT_OPTIONS = [
  { label: "Light (300)", value: "300" },
  { label: "Normal (400)", value: "400" },
  { label: "Medium (500)", value: "500" },
  { label: "Semibold (600)", value: "600" },
  { label: "Bold (700)", value: "700" },
  { label: "Extra Bold (800)", value: "800" },
  { label: "Black (900)", value: "900" },
];

const TEXT_TRANSFORM_OPTIONS = [
  { label: "None", value: "none" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

// ─── Main Page ───

export default function StylesPage() {
  const [data, setData] = useState<StylesData>({
    button_styles: { main: [], secondary: [] },
    link_styles: { primary: [], secondary: [] },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.settings || {};
        setData({
          button_styles: s.button_styles || { main: [], secondary: [] },
          link_styles: s.link_styles || { primary: [], secondary: [] },
        });
      })
      .catch(() => toast.error("Failed to load styles"))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          button_styles: data.button_styles,
          link_styles: data.link_styles,
        }),
      });
      if (res.ok) toast.success("Styles saved");
      else toast.error("Failed to save");
    } catch {
      toast.error("Save error");
    }
    setSaving(false);
  }, [data]);

  const updateButtonStyles = (
    type: "main" | "secondary",
    styles: ButtonStyle[]
  ) => {
    setData((prev) => ({
      ...prev,
      button_styles: { ...prev.button_styles, [type]: styles },
    }));
  };

  const updateLinkStyles = (
    type: "primary" | "secondary",
    styles: LinkStyle[]
  ) => {
    setData((prev) => ({
      ...prev,
      link_styles: { ...prev.link_styles, [type]: styles },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-2xl text-charcoal">
            Styles
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Design reusable button and link styles for your site.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 text-sm"
        >
          {saving ? "Saving..." : "Save All Styles"}
        </button>
      </div>

      {/* Button Styles */}
      <div className="mb-12">
        <h3 className="font-display font-semibold text-lg text-charcoal mb-1">
          Button Styles
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Create up to 4 styles per type. These are available when configuring any button on any page.
        </p>

        <div className="space-y-8">
          {(["main", "secondary"] as const).map((type) => (
            <ButtonStyleGroup
              key={type}
              type={type}
              styles={data.button_styles[type]}
              onChange={(styles) => updateButtonStyles(type, styles)}
            />
          ))}
        </div>
      </div>

      {/* Link Styles */}
      <div className="mb-12">
        <h3 className="font-display font-semibold text-lg text-charcoal mb-1">
          Link Styles
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Create up to 4 styles per type. Available when configuring any text link.
        </p>

        <div className="space-y-8">
          {(["primary", "secondary"] as const).map((type) => (
            <LinkStyleGroup
              key={type}
              type={type}
              styles={data.link_styles[type]}
              onChange={(styles) => updateLinkStyles(type, styles)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Button Style Group ───

function ButtonStyleGroup({
  type,
  styles,
  onChange,
}: {
  type: "main" | "secondary";
  styles: ButtonStyle[];
  onChange: (styles: ButtonStyle[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addStyle = () => {
    if (styles.length >= 4) {
      toast.error("Maximum 4 styles per type");
      return;
    }
    const newStyle = defaultButtonStyle(type, styles.length);
    onChange([...styles, newStyle]);
    setEditingIndex(styles.length);
  };

  const removeStyle = (index: number) => {
    onChange(styles.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const updateStyle = (index: number, updated: ButtonStyle) => {
    const next = [...styles];
    next[index] = updated;
    onChange(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              type === "main" ? "bg-teal" : "bg-gray-400"
            }`}
          />
          <h4 className="font-semibold text-sm text-charcoal">
            {type === "main" ? "Main" : "Secondary"} Buttons
          </h4>
          <span className="text-xs text-gray-400">({styles.length}/4)</span>
        </div>
        <button
          onClick={addStyle}
          disabled={styles.length >= 4}
          className="text-xs text-teal hover:text-teal-dark font-semibold disabled:opacity-30 transition-colors"
        >
          + Add Style
        </button>
      </div>

      {styles.length === 0 && (
        <div className="px-5 py-8 text-center text-gray-400 text-sm">
          No styles yet. Click &quot;+ Add Style&quot; to create one.
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {styles.map((style, i) => (
          <div key={style.id}>
            {/* Preview row */}
            <div
              className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setEditingIndex(editingIndex === i ? null : i)}
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 w-5">#{i + 1}</span>
                {/* Live preview */}
                <button
                  style={{
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
                    color: style.textColor,
                    backgroundColor: style.bgColor,
                    border: `${style.borderWidth} solid ${style.borderColor}`,
                    borderRadius: style.borderRadius,
                    padding: `${style.paddingY} ${style.paddingX}`,
                    boxShadow: style.shadow === "none" ? undefined : style.shadow,
                    textTransform: style.textTransform as React.CSSProperties["textTransform"],
                    cursor: "default",
                  }}
                  className="transition-all pointer-events-none"
                >
                  {style.name}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeStyle(i); }}
                  className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${editingIndex === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Editor */}
            {editingIndex === i && (
              <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                <ButtonStyleEditor
                  style={style}
                  onChange={(updated) => updateStyle(i, updated)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Button Style Editor ───

function ButtonStyleEditor({
  style,
  onChange,
}: {
  style: ButtonStyle;
  onChange: (style: ButtonStyle) => void;
}) {
  const update = (key: keyof ButtonStyle, value: string) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
      <StyleField label="Style Name" span={2}>
        <input
          type="text"
          value={style.name}
          onChange={(e) => update("name", e.target.value)}
          className="style-input"
        />
      </StyleField>

      <StyleField label="Font Family">
        <select
          value={style.fontFamily}
          onChange={(e) => update("fontFamily", e.target.value)}
          className="style-input"
        >
          {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </StyleField>
      <StyleField label="Font Size">
        <input
          type="text"
          value={style.fontSize}
          onChange={(e) => update("fontSize", e.target.value)}
          className="style-input"
          placeholder="16px"
        />
      </StyleField>

      <StyleField label="Font Weight">
        <select
          value={style.fontWeight}
          onChange={(e) => update("fontWeight", e.target.value)}
          className="style-input"
        >
          {FONT_WEIGHT_OPTIONS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </StyleField>
      <StyleField label="Text Transform">
        <select
          value={style.textTransform}
          onChange={(e) => update("textTransform", e.target.value)}
          className="style-input"
        >
          {TEXT_TRANSFORM_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </StyleField>

      <StyleField label="Text Color">
        <ColorInput value={style.textColor} onChange={(v) => update("textColor", v)} />
      </StyleField>
      <StyleField label="Background Color">
        <ColorInput value={style.bgColor} onChange={(v) => update("bgColor", v)} />
      </StyleField>

      <StyleField label="Hover Background">
        <ColorInput value={style.hoverBgColor} onChange={(v) => update("hoverBgColor", v)} />
      </StyleField>
      <StyleField label="Border Radius">
        <input
          type="text"
          value={style.borderRadius}
          onChange={(e) => update("borderRadius", e.target.value)}
          className="style-input"
          placeholder="12px"
        />
      </StyleField>

      <StyleField label="Border Width">
        <input
          type="text"
          value={style.borderWidth}
          onChange={(e) => update("borderWidth", e.target.value)}
          className="style-input"
          placeholder="0px"
        />
      </StyleField>
      <StyleField label="Border Color">
        <ColorInput value={style.borderColor} onChange={(v) => update("borderColor", v)} />
      </StyleField>

      <StyleField label="Padding X">
        <input
          type="text"
          value={style.paddingX}
          onChange={(e) => update("paddingX", e.target.value)}
          className="style-input"
          placeholder="32px"
        />
      </StyleField>
      <StyleField label="Padding Y">
        <input
          type="text"
          value={style.paddingY}
          onChange={(e) => update("paddingY", e.target.value)}
          className="style-input"
          placeholder="12px"
        />
      </StyleField>

      <StyleField label="Box Shadow">
        <input
          type="text"
          value={style.shadow}
          onChange={(e) => update("shadow", e.target.value)}
          className="style-input"
          placeholder="none or CSS shadow"
        />
      </StyleField>
      <StyleField label="Hover Shadow">
        <input
          type="text"
          value={style.hoverShadow}
          onChange={(e) => update("hoverShadow", e.target.value)}
          className="style-input"
          placeholder="none or CSS shadow"
        />
      </StyleField>

      {/* Live hover preview */}
      <div className="col-span-2 mt-2">
        <p className="text-[10px] uppercase text-gray-400 font-semibold mb-2">Hover Preview</p>
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
          <span className="text-xs text-gray-400">Normal:</span>
          <span
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
              color: style.textColor,
              backgroundColor: style.bgColor,
              border: `${style.borderWidth} solid ${style.borderColor}`,
              borderRadius: style.borderRadius,
              padding: `${style.paddingY} ${style.paddingX}`,
              boxShadow: style.shadow === "none" ? undefined : style.shadow,
              textTransform: style.textTransform as React.CSSProperties["textTransform"],
              display: "inline-block",
            }}
          >
            {style.name}
          </span>
          <span className="text-xs text-gray-400">Hover:</span>
          <span
            style={{
              fontSize: style.fontSize,
              fontWeight: style.fontWeight,
              fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
              color: style.textColor,
              backgroundColor: style.hoverBgColor,
              border: `${style.borderWidth} solid ${style.borderColor}`,
              borderRadius: style.borderRadius,
              padding: `${style.paddingY} ${style.paddingX}`,
              boxShadow: style.hoverShadow === "none" ? undefined : style.hoverShadow,
              textTransform: style.textTransform as React.CSSProperties["textTransform"],
              display: "inline-block",
            }}
          >
            {style.name}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Link Style Group ───

function LinkStyleGroup({
  type,
  styles,
  onChange,
}: {
  type: "primary" | "secondary";
  styles: LinkStyle[];
  onChange: (styles: LinkStyle[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addStyle = () => {
    if (styles.length >= 4) {
      toast.error("Maximum 4 styles per type");
      return;
    }
    const newStyle = defaultLinkStyle(type, styles.length);
    onChange([...styles, newStyle]);
    setEditingIndex(styles.length);
  };

  const removeStyle = (index: number) => {
    onChange(styles.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const updateStyle = (index: number, updated: LinkStyle) => {
    const next = [...styles];
    next[index] = updated;
    onChange(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              type === "primary" ? "bg-teal" : "bg-gray-400"
            }`}
          />
          <h4 className="font-semibold text-sm text-charcoal">
            {type === "primary" ? "Primary" : "Secondary"} Links
          </h4>
          <span className="text-xs text-gray-400">({styles.length}/4)</span>
        </div>
        <button
          onClick={addStyle}
          disabled={styles.length >= 4}
          className="text-xs text-teal hover:text-teal-dark font-semibold disabled:opacity-30 transition-colors"
        >
          + Add Style
        </button>
      </div>

      {styles.length === 0 && (
        <div className="px-5 py-8 text-center text-gray-400 text-sm">
          No styles yet. Click &quot;+ Add Style&quot; to create one.
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {styles.map((style, i) => (
          <div key={style.id}>
            {/* Preview row */}
            <div
              className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setEditingIndex(editingIndex === i ? null : i)}
            >
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 w-5">#{i + 1}</span>
                <span
                  style={{
                    color: style.color,
                    fontSize: style.fontSize === "inherit" ? "14px" : style.fontSize,
                    fontWeight: style.fontWeight,
                    fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
                    textDecoration: style.textDecoration,
                    textTransform: style.textTransform as React.CSSProperties["textTransform"],
                    letterSpacing: style.letterSpacing,
                  }}
                >
                  {style.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); removeStyle(i); }}
                  className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${editingIndex === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Editor */}
            {editingIndex === i && (
              <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100">
                <LinkStyleEditor
                  style={style}
                  onChange={(updated) => updateStyle(i, updated)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Link Style Editor ───

function LinkStyleEditor({
  style,
  onChange,
}: {
  style: LinkStyle;
  onChange: (style: LinkStyle) => void;
}) {
  const update = (key: keyof LinkStyle, value: string) => {
    onChange({ ...style, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
      <StyleField label="Style Name" span={2}>
        <input
          type="text"
          value={style.name}
          onChange={(e) => update("name", e.target.value)}
          className="style-input"
        />
      </StyleField>

      <StyleField label="Color">
        <ColorInput value={style.color} onChange={(v) => update("color", v)} />
      </StyleField>
      <StyleField label="Hover Color">
        <ColorInput value={style.hoverColor} onChange={(v) => update("hoverColor", v)} />
      </StyleField>

      <StyleField label="Font Family">
        <select
          value={style.fontFamily}
          onChange={(e) => update("fontFamily", e.target.value)}
          className="style-input"
        >
          {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </StyleField>
      <StyleField label="Font Size">
        <input
          type="text"
          value={style.fontSize}
          onChange={(e) => update("fontSize", e.target.value)}
          className="style-input"
          placeholder="inherit or 14px"
        />
      </StyleField>

      <StyleField label="Font Weight">
        <select
          value={style.fontWeight}
          onChange={(e) => update("fontWeight", e.target.value)}
          className="style-input"
        >
          {FONT_WEIGHT_OPTIONS.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
          ))}
        </select>
      </StyleField>
      <StyleField label="Text Transform">
        <select
          value={style.textTransform}
          onChange={(e) => update("textTransform", e.target.value)}
          className="style-input"
        >
          {TEXT_TRANSFORM_OPTIONS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </StyleField>

      <StyleField label="Text Decoration">
        <select
          value={style.textDecoration}
          onChange={(e) => update("textDecoration", e.target.value)}
          className="style-input"
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Strikethrough</option>
        </select>
      </StyleField>
      <StyleField label="Hover Decoration">
        <select
          value={style.hoverTextDecoration}
          onChange={(e) => update("hoverTextDecoration", e.target.value)}
          className="style-input"
        >
          <option value="none">None</option>
          <option value="underline">Underline</option>
          <option value="line-through">Strikethrough</option>
        </select>
      </StyleField>

      <StyleField label="Letter Spacing">
        <input
          type="text"
          value={style.letterSpacing}
          onChange={(e) => update("letterSpacing", e.target.value)}
          className="style-input"
          placeholder="normal or 0.05em"
        />
      </StyleField>

      {/* Live hover preview */}
      <div className="col-span-2 mt-2">
        <p className="text-[10px] uppercase text-gray-400 font-semibold mb-2">Hover Preview</p>
        <div className="flex items-center gap-6 p-4 bg-white rounded-lg border border-gray-200">
          <div>
            <span className="text-[10px] text-gray-400 block mb-1">Normal</span>
            <span
              style={{
                color: style.color,
                fontSize: style.fontSize === "inherit" ? "14px" : style.fontSize,
                fontWeight: style.fontWeight,
                fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
                textDecoration: style.textDecoration,
                textTransform: style.textTransform as React.CSSProperties["textTransform"],
                letterSpacing: style.letterSpacing,
              }}
            >
              {style.name}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block mb-1">Hover</span>
            <span
              style={{
                color: style.hoverColor,
                fontSize: style.fontSize === "inherit" ? "14px" : style.fontSize,
                fontWeight: style.fontWeight,
                fontFamily: style.fontFamily === "inherit" ? undefined : style.fontFamily,
                textDecoration: style.hoverTextDecoration,
                textTransform: style.textTransform as React.CSSProperties["textTransform"],
                letterSpacing: style.letterSpacing,
              }}
            >
              {style.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Components ───

function StyleField({
  label,
  children,
  span,
}: {
  label: string;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <label className="block text-[11px] font-medium text-gray-500 mb-1">
        {label}
      </label>
      {children}
      <style jsx global>{`
        .style-input {
          width: 100%;
          padding: 6px 10px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 13px;
          outline: none;
          background: white;
        }
        .style-input:focus {
          border-color: #1CA288;
          box-shadow: 0 0 0 2px rgba(28, 162, 136, 0.1);
        }
      `}</style>
    </div>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  // Try to parse as a simple hex for the color picker
  const isSimpleHex = /^#[0-9a-fA-F]{6}$/.test(value);

  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={isSimpleHex ? value : "#000000"}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-gray-200 cursor-pointer flex-shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="style-input"
        placeholder="#hex or rgba(...)"
      />
    </div>
  );
}
