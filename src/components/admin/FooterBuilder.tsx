"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
  FooterBuilderConfig,
  FooterColumnConfig,
  FooterElement,
  FooterElementType,
  FooterLogoTextData,
  FooterTextAreaData,
  FooterSocialIconsData,
  FooterLinkListData,
  FooterContactInfoData,
} from "@/lib/types";
import RichTextEditor from "@/components/admin/RichTextEditor";
import UrlInput from "@/components/admin/UrlInput";
import { EMPTY_SITE_STYLES } from "@/lib/styles";

function genId() {
  return `fe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const ELEMENT_TYPE_LABELS: Record<FooterElementType, string> = {
  logo_text: "Logo + Text",
  text_area: "Text Area",
  social_icons: "Social Icons",
  link_list: "Link List",
  contact_info: "Contact Info",
};

const ELEMENT_TYPE_ICONS: Record<FooterElementType, string> = {
  logo_text: "VF",
  text_area: "Aa",
  social_icons: "@",
  link_list: "≡",
  contact_info: "✉",
};

function createDefaultElement(type: FooterElementType): FooterElement {
  const id = genId();
  switch (type) {
    case "logo_text":
      return { id, type, data: { logoSrc: "/images/vanfest-logo.png", logoHeight: 40, brandName: "VanFest", tagline: "The ULTIMATE vanlife experience!", subtitle: "miles • moments • music • memories" } as FooterLogoTextData };
    case "text_area":
      return { id, type, data: { html: "<p>Enter text here...</p>" } as FooterTextAreaData };
    case "social_icons":
      return { id, type, data: { links: [{ id: genId(), platform: "instagram", url: "https://instagram.com/vanfestusa", newTab: true }], iconSize: "md", spacing: 12 } as FooterSocialIconsData };
    case "link_list":
      return { id, type, data: { headerHtml: "Quick Links", links: [{ id: genId(), text: "Home", href: "/", newTab: false }], spacing: 8 } as FooterLinkListData };
    case "contact_info":
      return { id, type, data: { items: [{ id: genId(), type: "email", label: "Email", value: "hello@vanfestusa.com", href: "mailto:hello@vanfestusa.com" }] } as FooterContactInfoData };
  }
}

const EMPTY_BUILDER: FooterBuilderConfig = {
  version: 2,
  columns: [
    { id: genId(), elements: [], alignment: "left", verticalAlign: "top" },
    { id: genId(), elements: [], alignment: "left", verticalAlign: "top" },
    { id: genId(), elements: [], alignment: "left", verticalAlign: "top" },
    { id: genId(), elements: [], alignment: "left", verticalAlign: "top" },
  ],
  columnCount: 4,
  columnGap: 40,
  backgroundColor: "#1a1a1a",
  textColor: "#ffffff",
  accentColor: "#2dd4bf",
  paddingY: "64px",
  paddingX: "32px",
  bottomBar: {
    enabled: true,
    copyrightHtml: `©2020 - ${new Date().getFullYear()} VanFest - All Rights Reserved.`,
    legalHtml: "VanFest is a nomadic event series brand run by Ever Onward LLC, a Massachusetts-based Limited Liability Company",
  },
};

// Convert legacy v1 config into v2 builder config
function convertLegacyToV2(legacy: Record<string, unknown>): FooterBuilderConfig {
  const brand = (legacy.brand || {}) as Record<string, string>;
  const socialLinks = (legacy.socialLinks || []) as Array<{ platform: string; url: string }>;
  const columns = (legacy.columns || []) as Array<{ title: string; links: Array<{ label: string; href: string; external?: boolean }> }>;
  const contactInfo = (legacy.contactInfo || {}) as Record<string, string>;

  const col1Elements: FooterElement[] = [
    { id: genId(), type: "logo_text", data: { logoSrc: "/images/vanfest-logo.png", logoHeight: 40, brandName: "VanFest", tagline: brand.tagline || "", subtitle: "miles • moments • music • memories" } as FooterLogoTextData },
    { id: genId(), type: "social_icons", data: { links: socialLinks.map(sl => ({ id: genId(), platform: sl.platform, url: sl.url, newTab: true })), iconSize: "md" as const, spacing: 12 } as FooterSocialIconsData },
  ];

  const linkColumns: FooterColumnConfig[] = columns.map(col => ({
    id: genId(),
    alignment: "left" as const,
    verticalAlign: "top" as const,
    elements: [{
      id: genId(),
      type: "link_list" as const,
      data: {
        headerHtml: col.title,
        links: col.links.map(l => ({ id: genId(), text: l.label, href: l.href, newTab: l.external || false })),
        spacing: 8,
      } as FooterLinkListData,
    }],
  }));

  const contactItems = [];
  if (contactInfo.email) contactItems.push({ id: genId(), type: "email" as const, label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}` });
  if (contactInfo.phone) contactItems.push({ id: genId(), type: "phone" as const, label: "Phone", value: contactInfo.phone, href: `tel:${contactInfo.phone?.replace(/[^0-9]/g, "")}` });
  if (contactInfo.instagram) contactItems.push({ id: genId(), type: "instagram" as const, label: "Instagram", value: contactInfo.instagram, href: `https://instagram.com/${contactInfo.instagram?.replace("@", "")}` });

  const contactCol: FooterColumnConfig = {
    id: genId(),
    alignment: "left",
    verticalAlign: "top",
    elements: contactItems.length > 0 ? [{ id: genId(), type: "contact_info", data: { items: contactItems } as FooterContactInfoData }] : [],
  };

  const allColumns = [
    { id: genId(), alignment: "left" as const, verticalAlign: "top" as const, elements: col1Elements },
    ...linkColumns,
    contactCol,
  ];

  return {
    ...EMPTY_BUILDER,
    columns: allColumns,
    columnCount: allColumns.length,
  };
}

// Sortable element card
function SortableElementCard({ element, selected, onSelect, onRemove }: {
  element: FooterElement;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg p-2 cursor-pointer transition-colors ${
        selected ? "border-teal bg-teal/5" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
        <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{ELEMENT_TYPE_ICONS[element.type]}</span>
        <span className="text-xs text-gray-700 flex-1">{ELEMENT_TYPE_LABELS[element.type]}</span>
        <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="text-gray-300 hover:text-red-500 p-0.5">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
}

// Element-specific editor
function ElementEditor({ element, onChange }: { element: FooterElement; onChange: (data: FooterElement["data"]) => void }) {
  const d = element.data;

  if (element.type === "logo_text") {
    const data = d as FooterLogoTextData;
    return (
      <div className="space-y-2">
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Logo Image URL</label>
          <input type="text" value={data.logoSrc} onChange={(e) => onChange({ ...data, logoSrc: e.target.value })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Logo Height (px)</label>
          <input type="number" value={data.logoHeight} onChange={(e) => onChange({ ...data, logoHeight: Number(e.target.value) })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Brand Name</label>
          <input type="text" value={data.brandName} onChange={(e) => onChange({ ...data, brandName: e.target.value })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Tagline</label>
          <RichTextEditor content={data.tagline} onChange={(html) => onChange({ ...data, tagline: html })} siteStyles={EMPTY_SITE_STYLES} />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Subtitle</label>
          <RichTextEditor content={data.subtitle} onChange={(html) => onChange({ ...data, subtitle: html })} siteStyles={EMPTY_SITE_STYLES} />
        </div>
      </div>
    );
  }

  if (element.type === "text_area") {
    const data = d as FooterTextAreaData;
    return (
      <div>
        <label className="block text-[10px] text-gray-500 mb-0.5">Content</label>
        <RichTextEditor content={data.html} onChange={(html) => onChange({ ...data, html })} siteStyles={EMPTY_SITE_STYLES} />
      </div>
    );
  }

  if (element.type === "social_icons") {
    const data = d as FooterSocialIconsData;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-gray-500">Social Links</label>
          <button onClick={() => onChange({ ...data, links: [...data.links, { id: genId(), platform: "website", url: "", newTab: true }] })} className="text-teal text-[10px] font-semibold">+ Add</button>
        </div>
        {data.links.map((link, i) => (
          <div key={link.id} className="flex items-center gap-1.5">
            <select value={link.platform} onChange={(e) => { const links = [...data.links]; links[i] = { ...links[i], platform: e.target.value }; onChange({ ...data, links }); }} className="px-1 py-1 border border-gray-200 rounded text-[10px] w-20">
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter/X</option>
              <option value="website">Website</option>
            </select>
            <input type="url" value={link.url} onChange={(e) => { const links = [...data.links]; links[i] = { ...links[i], url: e.target.value }; onChange({ ...data, links }); }} className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="https://..." />
            <label className="flex items-center gap-1 text-[10px] text-gray-500">
              <input type="checkbox" checked={link.newTab} onChange={(e) => { const links = [...data.links]; links[i] = { ...links[i], newTab: e.target.checked }; onChange({ ...data, links }); }} />
              New
            </label>
            <button onClick={() => onChange({ ...data, links: data.links.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-500 p-0.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Icon Size</label>
            <select value={data.iconSize} onChange={(e) => onChange({ ...data, iconSize: e.target.value as "sm" | "md" | "lg" })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs">
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Spacing (px)</label>
            <input type="number" value={data.spacing} onChange={(e) => onChange({ ...data, spacing: Number(e.target.value) })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
          </div>
        </div>
      </div>
    );
  }

  if (element.type === "link_list") {
    const data = d as FooterLinkListData;
    return (
      <div className="space-y-2">
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Header</label>
          <RichTextEditor content={data.headerHtml} onChange={(html) => onChange({ ...data, headerHtml: html })} siteStyles={EMPTY_SITE_STYLES} />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-gray-500">Links</label>
          <button onClick={() => onChange({ ...data, links: [...data.links, { id: genId(), text: "New Link", href: "/", newTab: false }] })} className="text-teal text-[10px] font-semibold">+ Add</button>
        </div>
        {data.links.map((link, i) => (
          <div key={link.id} className="flex items-center gap-1.5">
            <input type="text" value={link.text} onChange={(e) => { const links = [...data.links]; links[i] = { ...links[i], text: e.target.value }; onChange({ ...data, links }); }} className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="Label" />
            <UrlInput value={link.href} onChange={(val) => { const links = [...data.links]; links[i] = { ...links[i], href: val }; onChange({ ...data, links }); }} className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="/path" />
            <label className="flex items-center gap-1 text-[10px] text-gray-500">
              <input type="checkbox" checked={link.newTab} onChange={(e) => { const links = [...data.links]; links[i] = { ...links[i], newTab: e.target.checked }; onChange({ ...data, links }); }} />
              New
            </label>
            <button onClick={() => onChange({ ...data, links: data.links.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-500 p-0.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
        <div>
          <label className="block text-[10px] text-gray-500 mb-0.5">Link Spacing (px)</label>
          <input type="number" value={data.spacing} onChange={(e) => onChange({ ...data, spacing: Number(e.target.value) })} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
        </div>
      </div>
    );
  }

  if (element.type === "contact_info") {
    const data = d as FooterContactInfoData;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-gray-500">Contact Items</label>
          <button onClick={() => onChange({ ...data, items: [...data.items, { id: genId(), type: "custom", label: "Label", value: "", href: "" }] })} className="text-teal text-[10px] font-semibold">+ Add</button>
        </div>
        {data.items.map((item, i) => (
          <div key={item.id} className="space-y-1 border border-gray-200 rounded p-2">
            <div className="flex items-center gap-1.5">
              <select value={item.type} onChange={(e) => { const items = [...data.items]; items[i] = { ...items[i], type: e.target.value as "email" | "phone" | "instagram" | "custom" }; onChange({ ...data, items }); }} className="px-1 py-1 border border-gray-200 rounded text-[10px] w-20">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="instagram">Instagram</option>
                <option value="custom">Custom</option>
              </select>
              <input type="text" value={item.value} onChange={(e) => { const items = [...data.items]; items[i] = { ...items[i], value: e.target.value }; onChange({ ...data, items }); }} className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="Value" />
              <button onClick={() => onChange({ ...data, items: data.items.filter((_, idx) => idx !== i) })} className="text-gray-300 hover:text-red-500 p-0.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <input type="text" value={item.href} onChange={(e) => { const items = [...data.items]; items[i] = { ...items[i], href: e.target.value }; onChange({ ...data, items }); }} className="w-full px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="Link (mailto:, tel:, https://...)" />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

interface Props {
  onSave?: () => void;
}

export default function FooterBuilder({ onSave }: Props) {
  const [config, setConfig] = useState<FooterBuilderConfig>(EMPTY_BUILDER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [hasLegacy, setHasLegacy] = useState(false);
  const [legacyConfig, setLegacyConfig] = useState<Record<string, unknown> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  useEffect(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.settings || {};
        if (s.footer_builder_config) {
          setConfig(s.footer_builder_config as FooterBuilderConfig);
        } else if (s.footer_config) {
          // Legacy config exists but no builder config yet
          setHasLegacy(true);
          setLegacyConfig(s.footer_config as Record<string, unknown>);
        }
      })
      .catch(() => toast.error("Failed to load footer config"))
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ footer_builder_config: config }),
      });
      if (!res.ok) throw new Error();
      toast.success("Footer saved");
      onSave?.();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [config, onSave]);

  const loadLegacy = () => {
    if (legacyConfig) {
      setConfig(convertLegacyToV2(legacyConfig));
      setHasLegacy(false);
      toast.success("Loaded current footer as template");
    }
  };

  const updateColumn = (colIdx: number, updates: Partial<FooterColumnConfig>) => {
    setConfig((prev) => {
      const columns = [...prev.columns];
      columns[colIdx] = { ...columns[colIdx], ...updates };
      return { ...prev, columns };
    });
  };

  const addElement = (colIdx: number, type: FooterElementType) => {
    const element = createDefaultElement(type);
    setConfig((prev) => {
      const columns = [...prev.columns];
      columns[colIdx] = { ...columns[colIdx], elements: [...columns[colIdx].elements, element] };
      return { ...prev, columns };
    });
    setSelectedElementId(element.id);
  };

  const removeElement = (colIdx: number, elementId: string) => {
    setConfig((prev) => {
      const columns = [...prev.columns];
      columns[colIdx] = { ...columns[colIdx], elements: columns[colIdx].elements.filter(e => e.id !== elementId) };
      return { ...prev, columns };
    });
    if (selectedElementId === elementId) setSelectedElementId(null);
  };

  const updateElementData = (elementId: string, data: FooterElement["data"]) => {
    setConfig((prev) => ({
      ...prev,
      columns: prev.columns.map(col => ({
        ...col,
        elements: col.elements.map(el => el.id === elementId ? { ...el, data } : el),
      })),
    }));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setConfig((prev) => {
      const columns = prev.columns.map(col => {
        const activeIdx = col.elements.findIndex(e => e.id === active.id);
        const overIdx = col.elements.findIndex(e => e.id === over.id);
        if (activeIdx !== -1 && overIdx !== -1) {
          return { ...col, elements: arrayMove(col.elements, activeIdx, overIdx) };
        }
        return col;
      });
      return { ...prev, columns };
    });
  };

  const setColumnCount = (count: number) => {
    setConfig((prev) => {
      const columns = [...prev.columns];
      while (columns.length < count) {
        columns.push({ id: genId(), elements: [], alignment: "left", verticalAlign: "top" });
      }
      return { ...prev, columnCount: count, columns: columns.slice(0, count) };
    });
  };

  // Find the selected element across all columns
  const selectedElement = config.columns.flatMap(c => c.elements).find(e => e.id === selectedElementId) || null;

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Load legacy prompt */}
      {hasLegacy && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800 mb-2">You have an existing footer. Load it as a template?</p>
          <button onClick={loadLegacy} className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors">
            Load Current Footer
          </button>
        </div>
      )}

      {/* Layout settings */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <h4 className="text-xs font-semibold text-gray-700">Layout</h4>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Columns</label>
            <select value={config.columnCount} onChange={(e) => setColumnCount(Number(e.target.value))} className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs">
              <option value={1}>1 Column</option>
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Gap (px)</label>
            <input type="number" value={config.columnGap} onChange={(e) => setConfig(prev => ({ ...prev, columnGap: Number(e.target.value) }))} className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Background</label>
            <div className="flex gap-1">
              <input type="color" value={config.backgroundColor} onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
              <input type="text" value={config.backgroundColor} onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Text Color</label>
            <div className="flex gap-1">
              <input type="color" value={config.textColor} onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
              <input type="text" value={config.textColor} onChange={(e) => setConfig(prev => ({ ...prev, textColor: e.target.value }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Accent Color</label>
            <div className="flex gap-1">
              <input type="color" value={config.accentColor} onChange={(e) => setConfig(prev => ({ ...prev, accentColor: e.target.value }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
              <input type="text" value={config.accentColor} onChange={(e) => setConfig(prev => ({ ...prev, accentColor: e.target.value }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Padding Y</label>
            <input type="text" value={config.paddingY} onChange={(e) => setConfig(prev => ({ ...prev, paddingY: e.target.value }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Padding X</label>
            <input type="text" value={config.paddingX} onChange={(e) => setConfig(prev => ({ ...prev, paddingX: e.target.value }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
          </div>
        </div>
      </div>

      {/* Columns with elements */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {config.columns.slice(0, config.columnCount).map((col, colIdx) => (
          <div key={col.id} className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-gray-700">Column {colIdx + 1}</h4>
              <div className="flex items-center gap-2">
                <select value={col.alignment} onChange={(e) => updateColumn(colIdx, { alignment: e.target.value as "left" | "center" | "right" })} className="px-1 py-0.5 border border-gray-200 rounded text-[10px]">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
                <select value={col.verticalAlign} onChange={(e) => updateColumn(colIdx, { verticalAlign: e.target.value as "top" | "center" | "bottom" })} className="px-1 py-0.5 border border-gray-200 rounded text-[10px]">
                  <option value="top">Top</option>
                  <option value="center">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
            </div>

            {/* Elements within column */}
            <SortableContext items={col.elements.map(e => e.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {col.elements.map((element) => (
                  <SortableElementCard
                    key={element.id}
                    element={element}
                    selected={selectedElementId === element.id}
                    onSelect={() => setSelectedElementId(selectedElementId === element.id ? null : element.id)}
                    onRemove={() => removeElement(colIdx, element.id)}
                  />
                ))}
              </div>
            </SortableContext>

            {/* Add element buttons */}
            <div className="flex flex-wrap gap-1">
              {(Object.keys(ELEMENT_TYPE_LABELS) as FooterElementType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => addElement(colIdx, type)}
                  className="text-[10px] text-teal hover:text-teal-dark font-semibold bg-teal/5 hover:bg-teal/10 px-2 py-1 rounded transition-colors"
                >
                  + {ELEMENT_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </DndContext>

      {/* Selected element editor */}
      {selectedElement && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-blue-700">
            Edit: {ELEMENT_TYPE_LABELS[selectedElement.type]}
          </h4>
          <ElementEditor
            element={selectedElement}
            onChange={(data) => updateElementData(selectedElement.id, data)}
          />
        </div>
      )}

      {/* Bottom bar */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-gray-700">Bottom Bar</h4>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" checked={config.bottomBar.enabled} onChange={(e) => setConfig(prev => ({ ...prev, bottomBar: { ...prev.bottomBar, enabled: e.target.checked } }))} />
            Show
          </label>
        </div>
        {config.bottomBar.enabled && (
          <div className="space-y-2">
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Copyright</label>
              <input type="text" value={config.bottomBar.copyrightHtml} onChange={(e) => setConfig(prev => ({ ...prev, bottomBar: { ...prev.bottomBar, copyrightHtml: e.target.value } }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Legal Text</label>
              <input type="text" value={config.bottomBar.legalHtml} onChange={(e) => setConfig(prev => ({ ...prev, bottomBar: { ...prev.bottomBar, legalHtml: e.target.value } }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs" />
            </div>
          </div>
        )}
      </div>

      {/* Save */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 text-sm"
      >
        {saving ? "Saving..." : "Save Footer"}
      </button>
    </div>
  );
}
