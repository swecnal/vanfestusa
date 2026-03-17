"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline as UnderlineExt } from "@tiptap/extension-underline";
import { useEffect, useRef, useState, useCallback } from "react";
import type { SiteStyles, ButtonStyle } from "@/lib/styles";
import { buttonStyleToCSS, buttonStyleToCSSString, findButtonStyle, EMPTY_SITE_STYLES } from "@/lib/styles";

interface Props {
  content: string;
  onChange: (html: string) => void;
  siteStyles?: SiteStyles;
  onSiteStylesChange?: () => void; // callback to refresh siteStyles after saving a new one
}

/* ─── Custom FontSize extension ─── */
const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

/* ─── Custom LineHeight extension ─── */
const LineHeight = Extension.create({
  name: "lineHeight",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading"],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (el) => el.style.lineHeight || null,
            renderHTML: (attrs) => {
              if (!attrs.lineHeight) return {};
              return { style: `line-height: ${attrs.lineHeight}` };
            },
          },
        },
      },
    ];
  },
});

/* ─── Custom style preservation (margin, padding, etc.) ─── */
const StylePreserver = Extension.create({
  name: "stylePreserver",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph", "heading", "bulletList", "orderedList", "listItem"],
        attributes: {
          preservedStyle: {
            default: null,
            parseHTML: (el) => {
              const s = el.getAttribute("style");
              if (!s) return null;
              const kept = s
                .split(";")
                .map((p) => p.trim())
                .filter(
                  (p) =>
                    p.startsWith("margin") ||
                    p.startsWith("padding") ||
                    p.startsWith("line-height") ||
                    p.startsWith("letter-spacing")
                )
                .join("; ");
              return kept || null;
            },
            renderHTML: (attrs) => {
              if (!attrs.preservedStyle) return {};
              return { style: attrs.preservedStyle };
            },
          },
        },
      },
    ];
  },
});

/* ─── Extended Link with data-button-style + class preservation ─── */
const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: (el) => el.getAttribute("class") || null,
        renderHTML: (attrs) => {
          if (!attrs.class) return {};
          return { class: attrs.class };
        },
      },
      "data-button-style": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-button-style") || null,
        renderHTML: (attrs) => {
          if (!attrs["data-button-style"]) return {};
          return { "data-button-style": attrs["data-button-style"] };
        },
      },
      "data-custom-style": {
        default: null,
        parseHTML: (el) => el.getAttribute("data-custom-style") || null,
        renderHTML: (attrs) => {
          if (!attrs["data-custom-style"]) return {};
          return { "data-custom-style": attrs["data-custom-style"] };
        },
      },
      style: {
        default: null,
        parseHTML: (el) => el.getAttribute("style") || null,
        renderHTML: (attrs) => {
          if (!attrs.style) return {};
          return { style: attrs.style };
        },
      },
    };
  },
});

/* ─── Text Shadow extension ─── */
const TextShadowExt = Extension.create({
  name: "textShadow",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          textShadow: {
            default: null,
            parseHTML: (el) => el.style.textShadow || null,
            renderHTML: (attrs) => {
              if (!attrs.textShadow) return {};
              return { style: `text-shadow: ${attrs.textShadow}` };
            },
          },
        },
      },
    ];
  },
});

/* ─── Text Stroke/Outline extension ─── */
const TextStrokeExt = Extension.create({
  name: "textStroke",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          textStroke: {
            default: null,
            parseHTML: (el) => el.style.getPropertyValue("-webkit-text-stroke") || null,
            renderHTML: (attrs) => {
              if (!attrs.textStroke) return {};
              return { style: `-webkit-text-stroke: ${attrs.textStroke}; paint-order: stroke fill` };
            },
          },
        },
      },
    ];
  },
});

const FONT_FAMILIES = [
  { label: "Poppins", value: "Poppins" },
  { label: "Gothic A1", value: "Gothic A1" },
  { label: "EB Garamond", value: "EB Garamond" },
  { label: "Orbitron", value: "Orbitron" },
];

const TEXT_COLORS = [
  { label: "Black", hex: "#1a1a1a" },
  { label: "White", hex: "#ffffff" },
  { label: "Teal", hex: "#1CA288" },
  { label: "Dark Teal", hex: "#17806C" },
  { label: "Cream", hex: "#F5F0E8" },
  { label: "Red", hex: "#ef4444" },
  { label: "Orange", hex: "#f97316" },
  { label: "Yellow", hex: "#eab308" },
  { label: "Blue", hex: "#3b82f6" },
  { label: "Purple", hex: "#8b5cf6" },
];

const FONT_OPTIONS = ["Poppins", "Gothic A1", "EB Garamond", "Orbitron", "inherit"];
const FONT_WEIGHT_OPTIONS = ["300", "400", "500", "600", "700", "800", "900"];

/* ─── Default custom button style ─── */
function defaultCustomStyle(): ButtonStyle {
  return {
    id: `custom-${Date.now()}`,
    name: "Custom",
    fontSize: "16px",
    fontWeight: "600",
    fontFamily: "Poppins",
    textColor: "#ffffff",
    bgColor: "#1CA288",
    hoverBgColor: "#17806C",
    borderWidth: "0px",
    borderColor: "transparent",
    borderRadius: "12px",
    paddingX: "32px",
    paddingY: "14px",
    shadow: "none",
    hoverShadow: "none",
    textTransform: "none",
    marginTop: "0px",
    marginBottom: "0px",
  };
}

export default function RichTextEditor({ content, onChange, siteStyles = EMPTY_SITE_STYLES, onSiteStylesChange }: Props) {
  const isInternalUpdate = useRef(false);
  const customColorRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  /* ─── Link popover state ─── */
  const [linkPopover, setLinkPopover] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [popoverHref, setPopoverHref] = useState("");
  const [popoverStyleId, setPopoverStyleId] = useState<string | null>(null);

  /* ─── Style picker sub-panels ─── */
  const [styleTab, setStyleTab] = useState<"primary" | "secondary" | "custom" | null>(null);
  const [customStyle, setCustomStyle] = useState<ButtonStyle>(defaultCustomStyle());
  const [savingCustom, setSavingCustom] = useState(false);
  const [customSaveName, setCustomSaveName] = useState("");
  const [customSaveType, setCustomSaveType] = useState<"main" | "secondary">("main");

  /* ─── Color / Shadow / Stroke panel state ─── */
  const [colorOpen, setColorOpen] = useState(false);
  const [shadowOpen, setShadowOpen] = useState(false);
  const [shadow, setShadow] = useState({ color: "#000000", angle: 135, distance: 2, blur: 4 });
  const [strokeOpen, setStrokeOpen] = useState(false);
  const [stroke, setStroke] = useState({ color: "#000000", width: 1 });
  const colorPanelRef = useRef<HTMLDivElement>(null);
  const shadowPanelRef = useRef<HTMLDivElement>(null);
  const strokePanelRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      LineHeight,
      StylePreserver,
      TextShadowExt,
      TextStrokeExt,
      UnderlineExt,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CustomLink.configure({
        openOnClick: false,
        HTMLAttributes: { rel: null, target: null },
      }),
      Highlight.configure({ multicolor: true }),
    ],
    content,
    editorProps: {
      handleClick: (view, pos, event) => {
        const anchor = (event.target as HTMLElement).closest("a");
        if (anchor) {
          event.preventDefault();
          event.stopPropagation();
          return true;
        }
        return false;
      },
      handleDOMEvents: {
        click: (view, event) => {
          const anchor = (event.target as HTMLElement).closest("a");
          if (anchor) {
            event.preventDefault();
            event.stopPropagation();
            return true;
          }
          return false;
        },
      },
    },
    onUpdate: ({ editor: ed }) => {
      isInternalUpdate.current = true;
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  /* ─── Intercept clicks on links inside the editor ─── */
  useEffect(() => {
    if (!editor) return;
    const editorEl = editor.view.dom;

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) {
        setLinkPopover(null);
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      // Only open popover on plain click (not drag-select)
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;

      const pos = editor.view.posAtDOM(anchor, 0);
      editor.commands.setTextSelection(pos);

      const wrapperRect = wrapperRef.current?.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      if (wrapperRect) {
        const linkAttrs = editor.getAttributes("link");
        setPopoverHref(linkAttrs.href || "");
        setPopoverStyleId(linkAttrs["data-button-style"] || null);
        setStyleTab(null);

        // If custom, load the custom style into editor
        if (linkAttrs["data-button-style"] === "custom" && linkAttrs["data-custom-style"]) {
          try {
            setCustomStyle(JSON.parse(linkAttrs["data-custom-style"]));
          } catch {
            setCustomStyle(defaultCustomStyle());
          }
        }

        setLinkPopover({
          top: anchorRect.bottom - wrapperRect.top + 4,
          left: Math.max(0, anchorRect.left - wrapperRect.left),
        });
      }
    };

    editorEl.addEventListener("click", handleClick, true);
    return () => editorEl.removeEventListener("click", handleClick, true);
  }, [editor]);

  /* ─── Close popover on click outside ─── */
  useEffect(() => {
    if (!linkPopover) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setLinkPopover(null);
        setStyleTab(null);
      }
    };
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [linkPopover]);

  /* ─── Close color/shadow/stroke panels on click outside ─── */
  useEffect(() => {
    if (!colorOpen && !shadowOpen && !strokeOpen) return;
    const handle = (e: MouseEvent) => {
      const t = e.target as Node;
      if (colorOpen && colorPanelRef.current && !colorPanelRef.current.contains(t)) setColorOpen(false);
      if (shadowOpen && shadowPanelRef.current && !shadowPanelRef.current.contains(t)) setShadowOpen(false);
      if (strokeOpen && strokePanelRef.current && !strokePanelRef.current.contains(t)) setStrokeOpen(false);
    };
    const timer = setTimeout(() => document.addEventListener("mousedown", handle), 0);
    return () => { clearTimeout(timer); document.removeEventListener("mousedown", handle); };
  }, [colorOpen, shadowOpen, strokeOpen]);

  /* ─── Shadow / Stroke helpers ─── */
  const applyShadow = useCallback((s: { color: string; angle: number; distance: number; blur: number }) => {
    if (!editor) return;
    const rad = s.angle * Math.PI / 180;
    const x = s.distance * Math.cos(rad);
    const y = s.distance * Math.sin(rad);
    const css = `${x.toFixed(1)}px ${y.toFixed(1)}px ${s.blur}px ${s.color}`;
    const { from, to } = editor.state.selection;
    editor.chain().setTextSelection({ from, to }).setMark("textStyle", { textShadow: css }).run();
  }, [editor]);

  const applyStroke = useCallback((s: { color: string; width: number }) => {
    if (!editor) return;
    const css = `${s.width}px ${s.color}`;
    const { from, to } = editor.state.selection;
    editor.chain().setTextSelection({ from, to }).setMark("textStyle", { textStroke: css }).run();
  }, [editor]);

  /* ─── Apply a global button style ─── */
  const applyButtonStyle = useCallback(
    (styleId: string, style: ButtonStyle) => {
      if (!editor) return;
      const cssStr = buttonStyleToCSSString(style);
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .updateAttributes("link", {
          "data-button-style": styleId,
          "data-custom-style": null,
          class: null,
          style: cssStr,
        })
        // Strip inline text marks to reset custom formatting
        .unsetColor()
        .unsetFontFamily()
        .unsetMark("textStyle")
        .unsetBold()
        .unsetItalic()
        .run();
      setPopoverStyleId(styleId);
    },
    [editor]
  );

  /* ─── Apply custom style ─── */
  const applyCustomStyle = useCallback(
    (style: ButtonStyle) => {
      if (!editor) return;
      const cssStr = buttonStyleToCSSString(style);
      const jsonStr = JSON.stringify(style);
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .updateAttributes("link", {
          "data-button-style": "custom",
          "data-custom-style": jsonStr,
          class: null,
          style: cssStr,
        })
        .run();
      setPopoverStyleId("custom");
    },
    [editor]
  );

  /* ─── Save custom style to global settings ─── */
  const handleSaveCustomStyle = useCallback(async () => {
    if (!customSaveName.trim()) return;
    setSavingCustom(true);
    try {
      // Fetch current settings
      const res = await fetch("/api/global-settings");
      const { settings } = await res.json();
      const currentStyles = settings.button_styles || { main: [], secondary: [] };

      const newStyle: ButtonStyle = {
        ...customStyle,
        id: `${customSaveType}-${Date.now()}`,
        name: customSaveName.trim(),
      };

      currentStyles[customSaveType] = [...currentStyles[customSaveType], newStyle];

      await fetch("/api/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ button_styles: currentStyles }),
      });

      // Apply the newly saved style to the current button
      applyButtonStyle(newStyle.id, newStyle);
      setCustomSaveName("");
      setSavingCustom(false);
      setStyleTab(null);
      onSiteStylesChange?.();
    } catch {
      setSavingCustom(false);
    }
  }, [customStyle, customSaveName, customSaveType, applyButtonStyle, onSiteStylesChange]);

  const handleAddLink = useCallback(() => {
    if (!editor) return;
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setShowLinkInput(false);
      setLinkUrl("");
    } else {
      setLinkUrl(editor.getAttributes("link").href || "");
      setShowLinkInput(true);
    }
  }, [editor, showLinkInput, linkUrl]);

  if (!editor) return null;

  const isLink = editor.isActive("link");
  const mainStyles = siteStyles.button_styles.main;
  const secondaryStyles = siteStyles.button_styles.secondary;

  return (
    <div ref={wrapperRef} className="relative border border-gray-300 rounded-lg overflow-visible">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-gray-50 border-b border-gray-200 rounded-t-lg">
        {/* Font family */}
        <select
          value={editor.getAttributes("textStyle").fontFamily || ""}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className="text-[10px] px-1 py-1 border border-gray-300 rounded bg-white h-6"
          style={{ maxWidth: "72px" }}
        >
          <option value="">Font</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {[1, 2, 3].map((level) => (
          <ToolbarButton
            key={level}
            active={editor.isActive("heading", { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
            title={`Heading ${level}`}
          >
            H{level}
          </ToolbarButton>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {(["left", "center", "right"] as const).map((align) => (
          <ToolbarButton
            key={align}
            active={editor.isActive({ textAlign: align })}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
            title={`Align ${align}`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              {align === "left" && <path d="M3 4h18v2H3V4zm0 4h12v2H3V8zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z" />}
              {align === "center" && <path d="M3 4h18v2H3V4zm3 4h12v2H6V8zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z" />}
              {align === "right" && <path d="M3 4h18v2H3V4zm6 4h12v2H9V8zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z" />}
            </svg>
          </ToolbarButton>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Text Color Dropdown */}
        <div ref={colorPanelRef} className="relative">
          <button
            onClick={() => { setColorOpen(!colorOpen); setShadowOpen(false); setStrokeOpen(false); }}
            className={`flex items-center gap-0.5 px-1.5 py-1 rounded text-xs font-bold transition-colors ${colorOpen ? "bg-teal/20 text-teal" : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}
            title="Text Color"
          >
            <span className="relative leading-none">
              A
              <span className="absolute -bottom-0.5 left-0 right-0 h-[3px] rounded-full" style={{ backgroundColor: editor.getAttributes("textStyle").color || "#1a1a1a" }} />
            </span>
            <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
          {colorOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-36 py-1">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => { editor.chain().focus().setColor(c.hex).run(); setColorOpen(false); }}
                  className="flex items-center gap-2 w-full px-2.5 py-1 hover:bg-gray-50 text-left"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0" style={{ backgroundColor: c.hex }} />
                  <span className="text-[10px] text-gray-700">{c.label}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-0.5 pt-0.5">
                <button
                  onClick={() => customColorRef.current?.click()}
                  className="flex items-center gap-2 w-full px-2.5 py-1 hover:bg-gray-50 text-left"
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0" style={{ background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)" }} />
                  <span className="text-[10px] text-gray-700">Custom...</span>
                </button>
              </div>
              <input
                ref={customColorRef}
                type="color"
                className="sr-only"
                onChange={(e) => { editor.chain().focus().setColor(e.target.value).run(); setColorOpen(false); }}
              />
            </div>
          )}
        </div>

        {/* Text Shadow */}
        <div ref={shadowPanelRef} className="relative">
          <ToolbarButton
            active={shadowOpen || !!editor.getAttributes("textStyle").textShadow}
            onClick={() => {
              if (!shadowOpen) {
                const current = editor.getAttributes("textStyle").textShadow as string | undefined;
                if (current) {
                  const m = current.match(/([-\d.]+)px\s+([-\d.]+)px\s+([-\d.]+)px\s+(.*)/);
                  if (m) {
                    const x = parseFloat(m[1]), y = parseFloat(m[2]);
                    const dist = Math.round(Math.sqrt(x * x + y * y));
                    let ang = Math.round(Math.atan2(y, x) * 180 / Math.PI);
                    if (ang < 0) ang += 360;
                    setShadow({ color: m[4].trim(), angle: ang, distance: dist, blur: parseFloat(m[3]) });
                  }
                } else {
                  setShadow({ color: "#000000", angle: 135, distance: 2, blur: 4 });
                }
              }
              setShadowOpen(!shadowOpen); setColorOpen(false); setStrokeOpen(false);
            }}
            title="Text Shadow"
          >
            <span className="text-[9px] font-bold leading-none" style={{ textShadow: "1px 1px 1px rgba(0,0,0,0.5)" }}>S</span>
          </ToolbarButton>
          {shadowOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-52 p-2.5 space-y-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-semibold text-gray-600 uppercase">Text Shadow</label>
                <button
                  onClick={() => {
                    const { from, to } = editor.state.selection;
                    editor.chain().setTextSelection({ from, to }).setMark("textStyle", { textShadow: null }).removeEmptyTextStyle().run();
                    setShadowOpen(false);
                  }}
                  className="text-[9px] text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="text-[8px] text-gray-400 block mb-0.5">Color</label>
                <div className="flex items-center gap-1">
                  <input type="color" value={shadow.color} onChange={(e) => { const n = { ...shadow, color: e.target.value }; setShadow(n); applyShadow(n); }} className="w-6 h-5 rounded border border-gray-200 cursor-pointer p-0" />
                  <input type="text" value={shadow.color} onChange={(e) => { const n = { ...shadow, color: e.target.value }; setShadow(n); applyShadow(n); }} className="flex-1 h-5 text-[9px] border border-gray-200 rounded px-1 bg-white" />
                </div>
              </div>
              <div>
                <label className="text-[8px] text-gray-400">Angle: {shadow.angle}°</label>
                <input type="range" min={0} max={360} value={shadow.angle} onChange={(e) => { const n = { ...shadow, angle: Number(e.target.value) }; setShadow(n); applyShadow(n); }} className="w-full h-1.5 accent-teal" />
              </div>
              <div>
                <label className="text-[8px] text-gray-400">Distance: {shadow.distance}px</label>
                <input type="range" min={0} max={20} value={shadow.distance} onChange={(e) => { const n = { ...shadow, distance: Number(e.target.value) }; setShadow(n); applyShadow(n); }} className="w-full h-1.5 accent-teal" />
              </div>
              <div>
                <label className="text-[8px] text-gray-400">Blur: {shadow.blur}px</label>
                <input type="range" min={0} max={20} value={shadow.blur} onChange={(e) => { const n = { ...shadow, blur: Number(e.target.value) }; setShadow(n); applyShadow(n); }} className="w-full h-1.5 accent-teal" />
              </div>
            </div>
          )}
        </div>

        {/* Text Stroke/Outline */}
        <div ref={strokePanelRef} className="relative">
          <ToolbarButton
            active={strokeOpen || !!editor.getAttributes("textStyle").textStroke}
            onClick={() => {
              if (!strokeOpen) {
                const current = editor.getAttributes("textStyle").textStroke as string | undefined;
                if (current) {
                  const m = current.match(/([\d.]+)px\s+(.*)/);
                  if (m) setStroke({ width: parseFloat(m[1]), color: m[2].trim() });
                } else {
                  setStroke({ color: "#000000", width: 1 });
                }
              }
              setStrokeOpen(!strokeOpen); setColorOpen(false); setShadowOpen(false);
            }}
            title="Text Outline"
          >
            <span className="text-[9px] font-bold leading-none" style={{ WebkitTextStroke: "0.7px currentColor" }}>O</span>
          </ToolbarButton>
          {strokeOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-52 p-2.5 space-y-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <label className="text-[9px] font-semibold text-gray-600 uppercase">Text Outline</label>
                <button
                  onClick={() => {
                    const { from, to } = editor.state.selection;
                    editor.chain().setTextSelection({ from, to }).setMark("textStyle", { textStroke: null }).removeEmptyTextStyle().run();
                    setStrokeOpen(false);
                  }}
                  className="text-[9px] text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="text-[8px] text-gray-400 block mb-0.5">Color</label>
                <div className="flex items-center gap-1">
                  <input type="color" value={stroke.color} onChange={(e) => { const n = { ...stroke, color: e.target.value }; setStroke(n); applyStroke(n); }} className="w-6 h-5 rounded border border-gray-200 cursor-pointer p-0" />
                  <input type="text" value={stroke.color} onChange={(e) => { const n = { ...stroke, color: e.target.value }; setStroke(n); applyStroke(n); }} className="flex-1 h-5 text-[9px] border border-gray-200 rounded px-1 bg-white" />
                </div>
              </div>
              <div>
                <label className="text-[8px] text-gray-400">Thickness: {stroke.width}px</label>
                <input type="range" min={0.5} max={5} step={0.5} value={stroke.width} onChange={(e) => { const n = { ...stroke, width: Number(e.target.value) }; setStroke(n); applyStroke(n); }} className="w-full h-1.5 accent-teal" />
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm4-18h14v2H8V4zm0 8h14v2H8v-2zm0 8h14v2H8v-2z" />
          </svg>
        </ToolbarButton>

        <ToolbarButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered List">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2 4h2v2H2v1h3V3H1v1zm0 7h2v1H1v1h3V9H1v1h1zm-1 7h3v1H2v1h1v1H1v1h3v-5H1v1zm5-14h16v2H6V4zm0 8h16v2H6v-2zm0 8h16v2H6v-2z" />
          </svg>
        </ToolbarButton>

        <ToolbarButton active={isLink} onClick={handleAddLink} title="Link">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolbarButton>

        {/* Add Button — inserts a new button with first available style */}
        <ToolbarButton
          active={false}
          onClick={() => {
            const firstStyle = mainStyles[0] || secondaryStyles[0];
            if (firstStyle) {
              const cssStr = buttonStyleToCSSString(firstStyle);
              editor.chain().focus().insertContent({
                type: "text",
                text: "Button Text",
                marks: [{
                  type: "link",
                  attrs: {
                    href: "https://",
                    "data-button-style": firstStyle.id,
                    style: cssStr,
                  },
                }],
              }).run();
            } else {
              // No global styles — insert plain link
              editor.chain().focus().insertContent({
                type: "text",
                text: "Button Text",
                marks: [{ type: "link", attrs: { href: "https://" } }],
              }).run();
            }
          }}
          title="Insert Button"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-4.5-4.5h6m-3-3v6" />
          </svg>
        </ToolbarButton>

        {showLinkInput && (
          <div className="w-full flex items-center gap-1 pt-1 border-t border-gray-200 mt-0.5">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 h-6 px-2 text-[11px] border border-gray-300 rounded bg-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (linkUrl) editor.chain().focus().setLink({ href: linkUrl }).run();
                  setShowLinkInput(false);
                  setLinkUrl("");
                }
                if (e.key === "Escape") { setShowLinkInput(false); setLinkUrl(""); }
              }}
              autoFocus
            />
            <button
              onClick={() => { if (linkUrl) editor.chain().focus().setLink({ href: linkUrl }).run(); setShowLinkInput(false); setLinkUrl(""); }}
              className="h-6 px-2 text-[10px] bg-teal text-white rounded font-semibold"
            >Set</button>
            <button onClick={() => { setShowLinkInput(false); setLinkUrl(""); }} className="h-6 px-1.5 text-[10px] text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        )}
      </div>

      {/* ─── Link/Button popover ─── */}
      {linkPopover && (
        <div
          ref={popoverRef}
          className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 p-3 space-y-2.5 min-w-[280px] max-w-[320px]"
          style={{ top: linkPopover.top, left: linkPopover.left, zIndex: 9999 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button onClick={() => { setLinkPopover(null); setStyleTab(null); }} className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Close">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* URL */}
          <div>
            <label className="text-[9px] uppercase text-gray-400 font-semibold block mb-0.5">URL</label>
            <input
              type="url"
              value={popoverHref}
              onChange={(e) => setPopoverHref(e.target.value)}
              onBlur={() => {
                if (popoverHref && editor) {
                  editor.chain().focus().extendMarkRange("link").updateAttributes("link", { href: popoverHref }).run();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (popoverHref && editor) editor.chain().focus().extendMarkRange("link").updateAttributes("link", { href: popoverHref }).run();
                }
              }}
              className="w-full h-6 px-2 text-[11px] border border-gray-300 rounded bg-white"
              placeholder="https://..."
            />
          </div>

          {/* Per-button margin above/below */}
          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <label className="text-[9px] uppercase text-gray-400 font-semibold block mb-0.5">Margin Above</label>
              <input
                type="text"
                value={(() => {
                  const s = editor.getAttributes("link").style || "";
                  const m = s.match(/margin-top:\s*([^;]+)/);
                  return m ? m[1].trim() : "0px";
                })()}
                onChange={(e) => {
                  if (!editor) return;
                  const currentStyle = editor.getAttributes("link").style || "";
                  let newStyle = currentStyle.replace(/margin-top:\s*[^;]+;?\s*/g, "").trim();
                  if (e.target.value && e.target.value !== "0px") {
                    newStyle = newStyle ? `${newStyle}; margin-top: ${e.target.value}` : `margin-top: ${e.target.value}`;
                  }
                  editor.chain().focus().extendMarkRange("link").updateAttributes("link", { style: newStyle || null }).run();
                }}
                className="w-full h-6 px-2 text-[11px] border border-gray-300 rounded bg-white"
                placeholder="0px"
              />
            </div>
            <div>
              <label className="text-[9px] uppercase text-gray-400 font-semibold block mb-0.5">Margin Below</label>
              <input
                type="text"
                value={(() => {
                  const s = editor.getAttributes("link").style || "";
                  const m = s.match(/margin-bottom:\s*([^;]+)/);
                  return m ? m[1].trim() : "0px";
                })()}
                onChange={(e) => {
                  if (!editor) return;
                  const currentStyle = editor.getAttributes("link").style || "";
                  let newStyle = currentStyle.replace(/margin-bottom:\s*[^;]+;?\s*/g, "").trim();
                  if (e.target.value && e.target.value !== "0px") {
                    newStyle = newStyle ? `${newStyle}; margin-bottom: ${e.target.value}` : `margin-bottom: ${e.target.value}`;
                  }
                  editor.chain().focus().extendMarkRange("link").updateAttributes("link", { style: newStyle || null }).run();
                }}
                className="w-full h-6 px-2 text-[11px] border border-gray-300 rounded bg-white"
                placeholder="0px"
              />
            </div>
          </div>

          {/* Style category buttons */}
          <div>
            <label className="text-[9px] uppercase text-gray-400 font-semibold block mb-1">Style</label>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setStyleTab(styleTab === "primary" ? null : "primary")}
                className={`text-[10px] px-2 py-1.5 rounded border transition-colors text-center ${
                  styleTab === "primary" || (popoverStyleId && mainStyles.some(s => s.id === popoverStyleId))
                    ? "border-teal bg-teal/10 text-teal font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Primary
              </button>
              <button
                onClick={() => setStyleTab(styleTab === "secondary" ? null : "secondary")}
                className={`text-[10px] px-2 py-1.5 rounded border transition-colors text-center ${
                  styleTab === "secondary" || (popoverStyleId && secondaryStyles.some(s => s.id === popoverStyleId))
                    ? "border-teal bg-teal/10 text-teal font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Secondary
              </button>
              <button
                onClick={() => {
                  if (styleTab !== "custom") {
                    // Load current custom style if exists, otherwise default
                    const linkAttrs = editor.getAttributes("link");
                    if (linkAttrs["data-button-style"] === "custom" && linkAttrs["data-custom-style"]) {
                      try { setCustomStyle(JSON.parse(linkAttrs["data-custom-style"])); } catch { setCustomStyle(defaultCustomStyle()); }
                    } else {
                      // Try to pre-fill from current style
                      const currentId = linkAttrs["data-button-style"];
                      if (currentId) {
                        const found = findButtonStyle(currentId, siteStyles);
                        if (found) { setCustomStyle({ ...found, id: `custom-${Date.now()}`, name: "Custom" }); }
                        else { setCustomStyle(defaultCustomStyle()); }
                      } else { setCustomStyle(defaultCustomStyle()); }
                    }
                    setStyleTab("custom");
                  } else {
                    setStyleTab(null);
                  }
                }}
                className={`text-[10px] px-2 py-1.5 rounded border transition-colors text-center ${
                  styleTab === "custom" || popoverStyleId === "custom"
                    ? "border-teal bg-teal/10 text-teal font-semibold"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                Custom
              </button>
            </div>
          </div>

          {/* Primary styles picker */}
          {styleTab === "primary" && (
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {mainStyles.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic py-2">No primary styles — create in Styles settings</p>
              ) : mainStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => applyButtonStyle(s.id, s)}
                  className={`w-full flex items-center gap-2 p-1.5 rounded border transition-colors ${
                    popoverStyleId === s.id ? "border-teal bg-teal/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span
                    className="pointer-events-none text-[11px] truncate"
                    style={buttonStyleToCSS(s)}
                  >
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Secondary styles picker */}
          {styleTab === "secondary" && (
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {secondaryStyles.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic py-2">No secondary styles — create in Styles settings</p>
              ) : secondaryStyles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => applyButtonStyle(s.id, s)}
                  className={`w-full flex items-center gap-2 p-1.5 rounded border transition-colors ${
                    popoverStyleId === s.id ? "border-teal bg-teal/5" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span
                    className="pointer-events-none text-[11px] truncate"
                    style={buttonStyleToCSS(s)}
                  >
                    {s.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Custom style editor */}
          {styleTab === "custom" && (
            <CustomButtonStyleEditor
              style={customStyle}
              onChange={(updated) => {
                setCustomStyle(updated);
                applyCustomStyle(updated);
              }}
              onSave={() => setSavingCustom(true)}
            />
          )}

          {/* Save custom as global style */}
          {savingCustom && (
            <div className="border-t border-gray-200 pt-2 space-y-1.5">
              <label className="text-[9px] uppercase text-gray-400 font-semibold block">Save as Style</label>
              <input
                type="text"
                value={customSaveName}
                onChange={(e) => setCustomSaveName(e.target.value)}
                placeholder="Style name..."
                className="w-full h-6 px-2 text-[11px] border border-gray-300 rounded bg-white"
                autoFocus
              />
              <div className="flex gap-1">
                <label className={`flex-1 text-center text-[10px] px-2 py-1 rounded border cursor-pointer transition-colors ${customSaveType === "main" ? "border-teal bg-teal/10 text-teal font-semibold" : "border-gray-200 text-gray-500"}`}>
                  <input type="radio" name="saveType" value="main" checked={customSaveType === "main"} onChange={() => setCustomSaveType("main")} className="sr-only" />
                  Primary
                </label>
                <label className={`flex-1 text-center text-[10px] px-2 py-1 rounded border cursor-pointer transition-colors ${customSaveType === "secondary" ? "border-teal bg-teal/10 text-teal font-semibold" : "border-gray-200 text-gray-500"}`}>
                  <input type="radio" name="saveType" value="secondary" checked={customSaveType === "secondary"} onChange={() => setCustomSaveType("secondary")} className="sr-only" />
                  Secondary
                </label>
              </div>
              <div className="flex gap-1">
                <button onClick={handleSaveCustomStyle} disabled={!customSaveName.trim()} className="flex-1 h-6 text-[10px] bg-teal text-white rounded font-semibold disabled:opacity-50">Save</button>
                <button onClick={() => setSavingCustom(false)} className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-600">Cancel</button>
              </div>
            </div>
          )}

          {/* Remove */}
          <button
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              setLinkPopover(null);
              setStyleTab(null);
            }}
            className="text-[10px] text-red-500 hover:text-red-700 font-semibold"
          >
            Remove
          </button>
        </div>
      )}

      {/* Editor */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div onClick={(e) => { const a = (e.target as HTMLElement).closest("a"); if (a) { e.preventDefault(); e.stopPropagation(); } }}>
        <EditorContent
          editor={editor}
          className="site-html-content max-w-none p-3 min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror_a]:cursor-pointer"
        />
      </div>
    </div>
  );
}

/* ─── Custom Button Style Editor (inline in popover) ─── */
function CustomButtonStyleEditor({
  style,
  onChange,
  onSave,
}: {
  style: ButtonStyle;
  onChange: (s: ButtonStyle) => void;
  onSave: () => void;
}) {
  const update = (key: keyof ButtonStyle, val: string) => {
    onChange({ ...style, [key]: val });
  };

  return (
    <div className="space-y-2 border-t border-gray-200 pt-2">
      {/* Live preview */}
      <div className="flex justify-center py-1">
        <span style={buttonStyleToCSS(style)} className="pointer-events-none text-[12px]">
          Preview
        </span>
      </div>

      {/* Colors row */}
      <div className="grid grid-cols-3 gap-1">
        <ColorField label="BG" value={style.bgColor} onChange={(v) => update("bgColor", v)} />
        <ColorField label="Text" value={style.textColor} onChange={(v) => update("textColor", v)} />
        <ColorField label="Border" value={style.borderColor} onChange={(v) => update("borderColor", v)} />
      </div>

      {/* Typography row */}
      <div className="grid grid-cols-3 gap-1">
        <div>
          <label className="text-[8px] text-gray-400 block">Font</label>
          <select value={style.fontFamily} onChange={(e) => update("fontFamily", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-0.5">
            {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[8px] text-gray-400 block">Weight</label>
          <select value={style.fontWeight} onChange={(e) => update("fontWeight", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-0.5">
            {FONT_WEIGHT_OPTIONS.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[8px] text-gray-400 block">Size</label>
          <input type="text" value={style.fontSize} onChange={(e) => update("fontSize", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-1" />
        </div>
      </div>

      {/* Border + radius row */}
      <div className="grid grid-cols-3 gap-1">
        <div>
          <label className="text-[8px] text-gray-400 block">Bdr Width</label>
          <input type="text" value={style.borderWidth} onChange={(e) => update("borderWidth", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-1" />
        </div>
        <div>
          <label className="text-[8px] text-gray-400 block">Radius</label>
          <input type="text" value={style.borderRadius} onChange={(e) => update("borderRadius", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-1" />
        </div>
        <div>
          <label className="text-[8px] text-gray-400 block">Transform</label>
          <select value={style.textTransform} onChange={(e) => update("textTransform", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-0.5">
            <option value="none">None</option>
            <option value="uppercase">Upper</option>
            <option value="lowercase">Lower</option>
            <option value="capitalize">Capital</option>
          </select>
        </div>
      </div>

      {/* Padding row */}
      <div className="grid grid-cols-2 gap-1">
        <div>
          <label className="text-[8px] text-gray-400 block">Pad X</label>
          <input type="text" value={style.paddingX} onChange={(e) => update("paddingX", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-1" />
        </div>
        <div>
          <label className="text-[8px] text-gray-400 block">Pad Y</label>
          <input type="text" value={style.paddingY} onChange={(e) => update("paddingY", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-1" />
        </div>
      </div>

      {/* Margin row */}
      <div className="grid grid-cols-2 gap-1">
        <div>
          <label className="text-[8px] text-gray-400 block">Margin Top</label>
          <input type="text" value={style.marginTop || "0px"} onChange={(e) => update("marginTop", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-1" />
        </div>
        <div>
          <label className="text-[8px] text-gray-400 block">Margin Btm</label>
          <input type="text" value={style.marginBottom || "0px"} onChange={(e) => update("marginBottom", e.target.value)} className="w-full h-5 text-[9px] border border-gray-200 rounded bg-white px-1" />
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={onSave}
        className="w-full h-6 text-[10px] border border-teal text-teal rounded font-semibold hover:bg-teal/10 transition-colors"
      >
        Save as Style
      </button>
    </div>
  );
}

/* ─── Tiny color input ─── */
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="text-[8px] text-gray-400 block">{label}</label>
      <button
        onClick={() => ref.current?.click()}
        className="relative w-full h-5 rounded border border-gray-200 overflow-hidden"
        style={{ backgroundColor: value }}
      >
        <input ref={ref} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
        <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold" style={{ color: isLightColor(value) ? "#333" : "#fff" }}>
          {value}
        </span>
      </button>
    </div>
  );
}

function ToolbarButton({ active, onClick, title, children }: { active: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded text-xs transition-colors ${active ? "bg-teal/20 text-teal" : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"}`}
    >
      {children}
    </button>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}
