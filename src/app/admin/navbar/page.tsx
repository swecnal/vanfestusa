"use client";

import { useState, useRef, useEffect } from "react";
import NavbarBuilder from "@/components/admin/NavbarBuilder";

interface PageOption {
  id: string;
  slug: string;
  title: string;
}

export default function NavbarEditorPage() {
  const [pages, setPages] = useState<PageOption[]>([]);
  const [previewPageId, setPreviewPageId] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Fetch pages for the preview selector
  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((res) => {
        const pageList = (res.pages || []) as PageOption[];
        setPages(pageList);
        // Default to homepage or first page
        const home = pageList.find((p: PageOption) => p.slug === "/");
        setPreviewPageId(home?.id || pageList[0]?.id || "");
      })
      .catch(() => {});
  }, []);

  const handleSave = () => {
    // Refresh the preview iframe to show updated navbar
    setIframeKey((k) => k + 1);
  };

  return (
    <div className="flex gap-0 -m-3 md:-m-6 h-[calc(100vh-57px)]">
      {/* Left: Live preview */}
      <div className="flex-1 min-w-0 flex flex-col bg-gray-100">
        {/* Preview toolbar */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-bold text-sm text-charcoal">Navbar Editor</h3>
            <span className="text-[10px] text-gray-400">Live Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-gray-500">Preview page:</label>
            <select
              value={previewPageId}
              onChange={(e) => { setPreviewPageId(e.target.value); setIframeKey((k) => k + 1); }}
              className="text-xs border border-gray-200 rounded px-2 py-1 max-w-[200px]"
            >
              {pages.map((p) => (
                <option key={p.id} value={p.id}>{p.title} ({p.slug})</option>
              ))}
            </select>
          </div>
        </div>
        {/* Preview iframe */}
        <div className="flex-1 overflow-auto">
          {previewPageId && (
            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={`/preview/${previewPageId}`}
              className="w-full h-full border-0 bg-white"
              title="Navbar preview"
            />
          )}
        </div>
      </div>

      {/* Right: Builder panel */}
      <div className="w-96 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="flex-shrink-0 bg-white p-4 border-b border-gray-100">
          <h3 className="font-display font-semibold text-sm text-charcoal">Navbar Builder</h3>
          <p className="text-[10px] text-gray-400 mt-0.5">Edit links, logo, CTAs, and style. Changes appear in preview after saving.</p>
        </div>
        <div className="flex-1 overflow-y-auto admin-scrollbar">
          <NavbarBuilder onSave={handleSave} />
        </div>
      </div>
    </div>
  );
}
