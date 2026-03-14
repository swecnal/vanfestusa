"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
}

/* ─── Button style presets ─── */
const BUTTON_STYLES = [
  {
    label: "Text Link",
    value: "",
    preview: "text-teal underline",
  },
  {
    label: "Primary Button",
    value: "inline-block bg-teal hover:bg-teal-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors no-underline",
    preview: "bg-teal text-white px-3 py-1 rounded-lg text-xs",
  },
  {
    label: "Outline Button",
    value: "inline-block border-2 border-teal text-teal hover:bg-teal hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors no-underline",
    preview: "border-2 border-teal text-teal px-3 py-1 rounded-lg text-xs",
  },
  {
    label: "White Button",
    value: "inline-block bg-white text-charcoal font-semibold px-6 py-3 rounded-xl transition-colors hover:bg-gray-100 no-underline",
    preview: "bg-white text-charcoal border px-3 py-1 rounded-lg text-xs",
  },
];

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

/* ─── Extended Link with class preservation ─── */
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
    };
  },
});

const FONT_FAMILIES = [
  { label: "Poppins", value: "Poppins" },
  { label: "Gothic A1", value: "Gothic A1" },
  { label: "EB Garamond", value: "EB Garamond" },
  { label: "Orbitron", value: "Orbitron" },
];

const COLORS = [
  "#1a1a1a", "#1CA288", "#17806C", "#F5F0E8", "#ffffff",
  "#ef4444", "#f97316", "#eab308", "#3b82f6", "#8b5cf6",
];

export default function RichTextEditor({ content, onChange }: Props) {
  const isInternalUpdate = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  /* ─── Custom link popover state ─── */
  const [linkPopover, setLinkPopover] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [popoverHref, setPopoverHref] = useState("");
  const [popoverClass, setPopoverClass] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      LineHeight,
      StylePreserver,
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
        // Clicked non-link area — close popover
        setLinkPopover(null);
        return;
      }
      // Prevent navigation
      e.preventDefault();
      e.stopPropagation();

      // Select the link text so editor knows which link is active
      const pos = editor.view.posAtDOM(anchor, 0);
      editor.chain().focus().setTextSelection(pos).extendMarkRange("link").run();

      // Get position relative to wrapper
      const wrapperRect = wrapperRef.current?.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      if (wrapperRect) {
        setPopoverHref(editor.getAttributes("link").href || "");
        setPopoverClass(editor.getAttributes("link").class || "");
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
      }
    };
    // Delay to avoid closing immediately from the same click
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleOutsideClick);
    }, 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [linkPopover]);

  const setLinkStyle = useCallback(
    (styleClass: string) => {
      if (!editor) return;
      const href = editor.getAttributes("link").href;
      if (!href) return;
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .updateAttributes("link", { class: styleClass || null })
        .run();
      setPopoverClass(styleClass);
    },
    [editor]
  );

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
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Bold, Italic, Strike */}
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Headings */}
        {[1, 2, 3].map((level) => (
          <ToolbarButton
            key={level}
            active={editor.isActive("heading", { level })}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run()
            }
            title={`Heading ${level}`}
          >
            H{level}
          </ToolbarButton>
        ))}

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Alignment */}
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

        {/* Color */}
        <div className="flex gap-0.5">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => editor.chain().focus().setColor(color).run()}
              className="w-4 h-4 rounded-full border border-gray-300 hover:scale-125 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Lists */}
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm4-18h14v2H8V4zm0 8h14v2H8v-2zm0 8h14v2H8v-2z" />
          </svg>
        </ToolbarButton>

        {/* Link */}
        <ToolbarButton
          active={isLink}
          onClick={handleAddLink}
          title="Link"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolbarButton>

        {/* Inline link URL input */}
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
                if (e.key === "Escape") {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }
              }}
              autoFocus
            />
            <button
              onClick={() => {
                if (linkUrl) editor.chain().focus().setLink({ href: linkUrl }).run();
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              className="h-6 px-2 text-[10px] bg-teal text-white rounded font-semibold"
            >
              Set
            </button>
            <button
              onClick={() => { setShowLinkInput(false); setLinkUrl(""); }}
              className="h-6 px-1.5 text-[10px] text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Custom link/button popover — fixed position, click-triggered */}
      {linkPopover && (
        <div
          ref={popoverRef}
          className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 p-3 space-y-2 min-w-[260px]"
          style={{ top: linkPopover.top, left: linkPopover.left, zIndex: 9999 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setLinkPopover(null)}
            className="absolute top-1.5 right-1.5 w-5 h-5 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Close"
          >
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
                  if (popoverHref && editor) {
                    editor.chain().focus().extendMarkRange("link").updateAttributes("link", { href: popoverHref }).run();
                  }
                }
              }}
              className="w-full h-6 px-2 text-[11px] border border-gray-300 rounded bg-white"
              placeholder="https://..."
            />
          </div>

          {/* Style */}
          <div>
            <label className="text-[9px] uppercase text-gray-400 font-semibold block mb-0.5">Style</label>
            <div className="flex flex-wrap gap-1">
              {BUTTON_STYLES.map((bs) => (
                <button
                  key={bs.label}
                  onClick={() => setLinkStyle(bs.value)}
                  className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                    popoverClass === (bs.value || "")
                      ? "border-teal bg-teal/10 text-teal font-semibold"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {bs.label}
                </button>
              ))}
            </div>
          </div>

          {/* Remove */}
          <button
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              setLinkPopover(null);
            }}
            className="text-[10px] text-red-500 hover:text-red-700 font-semibold"
          >
            Remove Link
          </button>
        </div>
      )}

      {/* Editor — styled to match site rendering */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={(e) => {
          const anchor = (e.target as HTMLElement).closest("a");
          if (anchor) { e.preventDefault(); e.stopPropagation(); }
        }}
      >
        <EditorContent
          editor={editor}
          className="site-html-content max-w-none p-3 min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px] [&_.ProseMirror_a]:cursor-pointer"
        />
      </div>
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded text-xs transition-colors ${
        active
          ? "bg-teal/20 text-teal"
          : "text-gray-500 hover:bg-gray-200 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
