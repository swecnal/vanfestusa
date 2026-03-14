"use client";

import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Highlight } from "@tiptap/extension-highlight";
import { useEffect, useRef } from "react";

interface Props {
  content: string;
  onChange: (html: string) => void;
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
              // Keep margin, padding, and other layout styles
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
      Link.configure({ openOnClick: false }),
      Highlight.configure({ multicolor: true }),
    ],
    content,
    onUpdate: ({ editor: ed }) => {
      isInternalUpdate.current = true;
      onChange(ed.getHTML());
    },
  });

  // Only sync from parent if it wasn't our own update
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-gray-50 border-b border-gray-200">
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
          active={editor.isActive("link")}
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            } else {
              editor.chain().focus().unsetLink().run();
            }
          }}
          title="Link"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </ToolbarButton>
      </div>

      {/* Editor — styled to match site rendering */}
      <EditorContent
        editor={editor}
        className="site-html-content max-w-none p-3 min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]"
      />
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
