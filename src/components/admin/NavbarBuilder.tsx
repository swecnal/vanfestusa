"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MediaPickerModal from "./MediaPickerModal";
import UrlInput from "./UrlInput";
import type {
  NavbarBuilderConfig,
  NavbarLinkV2,
  NavbarCtaConfig,
  NavbarZone,
} from "@/lib/types";

function genId() {
  return `nb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const DEFAULT_LINKS: NavbarLinkV2[] = [
  { id: "def-1", label: "Events", href: "/events", children: [
    { id: "def-1a", label: "Escape to the Cape — MA 2026", href: "/events/escape" },
    { id: "def-1b", label: "LIFTOFF!", href: "/events/liftoff" },
  ]},
  { id: "def-2", label: "About", href: "/about", children: [
    { id: "def-2a", label: "About VanFest", href: "/about" },
    { id: "def-2b", label: "Found a Magnet?", href: "/magnet" },
    { id: "def-2c", label: "Terms & Conduct", href: "/terms" },
  ]},
  { id: "def-3", label: "FAQ", href: "/faq" },
  { id: "def-4", label: "Get Involved", href: "/get-involved", children: [
    { id: "def-4a", label: "Sponsors & Vendors", href: "/sponsors-vendors" },
    { id: "def-4b", label: "Exhibit Your Rig", href: "/exhibit-your-rig" },
    { id: "def-4c", label: "Jobs @ VanFest", href: "/jobs" },
  ]},
  { id: "def-5", label: "Media", href: "/media", children: [
    { id: "def-5a", label: "Gallery", href: "/media#gallery" },
    { id: "def-5b", label: "Community Media", href: "/media#community" },
  ]},
  { id: "def-6", label: "Sponsors", href: "/sponsors" },
  { id: "def-7", label: "Merch", href: "https://merch.vanfestusa.com/", external: true },
  { id: "def-8", label: "Contact", href: "/contact" },
];

export const EMPTY_CONFIG: NavbarBuilderConfig = {
  version: 2,
  layout: { logo: "left", links: "center", cta: "right" },
  logo: {
    src: "/images/vanfest-logo.png",
    height: 80,
    heightScrolled: 56,
    showText: false,
    text: "VanFest",
  },
  links: DEFAULT_LINKS,
  ctaButtons: [
    { text: "Get Tickets", href: "https://tickets.vanfestusa.com", external: true, variant: "primary", bounce: true },
  ],
  style: {
    bgColor: "#1a1a1a",
    bgOpacity: 95,
    textColor: "#ffffff",
    hoverColor: "#2dd4bf",
  },
};

const ZONE_LABELS: Record<NavbarZone, string> = { left: "Left", center: "Center", right: "Right" };
const VARIANT_LABELS: Record<string, string> = { primary: "Primary (filled)", secondary: "Secondary (filled)", outline: "Outline" };

// Convert legacy v1 config into v2
export function convertLegacyToV2(legacy: Record<string, unknown>): NavbarBuilderConfig {
  const links = (legacy.links || []) as Array<{ id?: string; label: string; href: string; external?: boolean; children?: Array<{ id?: string; label: string; href: string }> }>;
  const ctaButton = (legacy.ctaButton || { text: "Get Tickets", href: "https://tickets.vanfestusa.com", external: true }) as { text: string; href: string; external?: boolean };
  const eventOverrides = (legacy.eventOverrides || undefined) as NavbarBuilderConfig["eventOverrides"];

  const v2Links: NavbarLinkV2[] = links.map(l => ({
    id: l.id || genId(),
    label: l.label,
    href: l.href,
    external: l.external,
    children: l.children?.map(c => ({ id: c.id || genId(), label: c.label, href: c.href })),
  }));

  return {
    ...EMPTY_CONFIG,
    links: v2Links.length > 0 ? v2Links : DEFAULT_LINKS,
    ctaButtons: [{ text: ctaButton.text, href: ctaButton.href, external: ctaButton.external, variant: "primary", bounce: true }],
    eventOverrides: eventOverrides ? Object.fromEntries(
      Object.entries(eventOverrides).map(([key, val]) => [key, {
        ...val,
        links: val.links?.map((l: NavbarLinkV2) => ({ ...l, id: l.id || genId() })),
      }])
    ) : undefined,
  };
}

// ── Icon helpers ──────────────────────────────────────────────────────────────

function IconGrip() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
    </svg>
  );
}

function IconX({ size = "3.5" }: { size?: string }) {
  return (
    <svg className={`w-${size} h-${size}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconNestIn() {
  // Arrow pointing right + indent — nest into sibling above
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  );
}

function IconNestOut() {
  // Arrow pointing left — unnest
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7M19 19l-7-7 7-7" />
    </svg>
  );
}

// ── Flat tree helpers ─────────────────────────────────────────────────────────

interface FlatItem {
  id: string;
  depth: number;
  label: string;
  href: string;
  external?: boolean;
}

function flattenTree(links: NavbarLinkV2[]): FlatItem[] {
  const items: FlatItem[] = [];
  for (const link of links) {
    items.push({ id: link.id, depth: 0, label: link.label, href: link.href, external: link.external });
    for (const child of link.children || []) {
      items.push({ id: child.id, depth: 1, label: child.label, href: child.href, external: child.external });
      for (const gc of child.children || []) {
        items.push({ id: gc.id, depth: 2, label: gc.label, href: gc.href, external: gc.external });
      }
    }
  }
  return items;
}

function buildTree(flatItems: FlatItem[]): NavbarLinkV2[] {
  const result: NavbarLinkV2[] = [];
  const stack: { depth: number; node: NavbarLinkV2 }[] = [];

  for (const item of flatItems) {
    const node: NavbarLinkV2 = {
      id: item.id,
      label: item.label,
      href: item.href,
      external: item.external,
    };

    // Clamp depth: can't exceed 2, and can't be more than prevDepth + 1
    const maxAllowed = stack.length > 0 ? Math.min(stack[stack.length - 1].depth + 1, 2) : 0;
    const effectiveDepth = Math.min(item.depth, maxAllowed);

    // Pop stack down to parent level
    while (stack.length > 0 && stack[stack.length - 1].depth >= effectiveDepth) {
      stack.pop();
    }

    if (stack.length === 0) {
      result.push(node);
    } else {
      const parent = stack[stack.length - 1].node;
      if (!parent.children) parent.children = [];
      parent.children.push(node);
    }

    stack.push({ depth: effectiveDepth, node });
  }

  return result;
}

/** Returns [startIndex, endIndex) of an item and all its descendants in the flat list */
function getItemSpan(flatItems: FlatItem[], itemId: string): [number, number] {
  const idx = flatItems.findIndex((i) => i.id === itemId);
  if (idx === -1) return [-1, -1];
  const itemDepth = flatItems[idx].depth;
  let end = idx + 1;
  while (end < flatItems.length && flatItems[end].depth > itemDepth) {
    end++;
  }
  return [idx, end];
}

// ── Flat sortable row (all depths) ────────────────────────────────────────────

function FlatSortableRow({
  item,
  canIndent,
  canOutdent,
  canAddChild,
  onUpdate,
  onRemove,
  onIndent,
  onOutdent,
  onAddChild,
}: {
  item: FlatItem;
  canIndent: boolean;
  canOutdent: boolean;
  canAddChild: boolean;
  onUpdate: (key: string, value: string | boolean) => void;
  onRemove: () => void;
  onIndent: () => void;
  onOutdent: () => void;
  onAddChild: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const rowStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    paddingLeft: `${item.depth * 20 + 8}px`,
  };

  return (
    <div
      ref={setNodeRef}
      style={rowStyle}
      className={`flex items-center gap-1.5 bg-white border rounded-lg pr-2 py-1.5 transition-colors ${
        isDragging ? "border-teal shadow-md z-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {item.depth > 0 && <span className="text-gray-300 text-xs shrink-0">↳</span>}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none p-0.5 shrink-0"
      >
        <IconGrip />
      </button>
      <input
        type="text"
        value={item.label}
        onChange={(e) => onUpdate("label", e.target.value)}
        className={`flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded ${item.depth === 0 ? "text-xs font-semibold" : "text-[11px]"}`}
        placeholder="Label"
      />
      <UrlInput
        value={item.href}
        onChange={(val) => onUpdate("href", val)}
        className={`flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded ${item.depth === 0 ? "text-xs" : "text-[11px]"}`}
        placeholder="/path"
      />
      <label className="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap shrink-0">
        <input
          type="checkbox"
          checked={item.external || false}
          onChange={(e) => onUpdate("external", e.target.checked)}
        />
        Ext
      </label>
      <div className="flex gap-0.5 shrink-0">
        {canIndent && (
          <button onClick={onIndent} className="text-gray-400 hover:text-teal p-0.5" title="Nest into item above">
            <IconNestIn />
          </button>
        )}
        {canOutdent && (
          <button onClick={onOutdent} className="text-gray-400 hover:text-teal p-0.5" title="Promote up a level">
            <IconNestOut />
          </button>
        )}
        {canAddChild && (
          <button onClick={onAddChild} className="text-gray-400 hover:text-teal p-0.5" title="Add sub-link">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        <button onClick={onRemove} className="text-gray-300 hover:text-red-500 p-0.5" title="Remove">
          <IconX size="3" />
        </button>
      </div>
    </div>
  );
}

// ── Layout zone draggable pills ───────────────────────────────────────────────

const ZONE_POSITIONS: NavbarZone[] = ["left", "center", "right"];
const ZONE_ELEMENT_LABELS: Record<string, string> = { logo: "Logo", links: "Links", cta: "CTA" };

function LayoutZonePill({ id, disabled, onToggle }: { id: string; disabled: boolean; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold select-none border transition-colors ${
        disabled
          ? "border-gray-200 bg-gray-100 text-gray-300 line-through"
          : isDragging
            ? "border-teal bg-teal/10 text-teal shadow-md z-50"
            : "border-gray-300 bg-white text-charcoal hover:border-gray-400"
      }`}
    >
      <span className="cursor-grab active:cursor-grabbing touch-none p-0.5" {...attributes} {...listeners}>
        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
        </svg>
      </span>
      <span className="cursor-pointer" onClick={onToggle}>
        {ZONE_ELEMENT_LABELS[id] || id}
      </span>
    </div>
  );
}

function LayoutZoneDnd({ layout, onChange, disabledZones, onDisabledChange }: {
  layout: NavbarBuilderConfig["layout"];
  onChange: (layout: NavbarBuilderConfig["layout"]) => void;
  disabledZones: ("logo" | "links" | "cta")[];
  onDisabledChange: (zones: ("logo" | "links" | "cta")[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  // Derive order from current layout: sort elements by their zone position
  const order = useMemo(() => {
    const elements = ["logo", "links", "cta"] as const;
    return [...elements].sort((a, b) => ZONE_POSITIONS.indexOf(layout[a]) - ZONE_POSITIONS.indexOf(layout[b]));
  }, [layout]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = order.indexOf(active.id as "logo" | "links" | "cta");
    const newIdx = order.indexOf(over.id as "logo" | "links" | "cta");
    const newOrder = arrayMove(order, oldIdx, newIdx);
    onChange({
      [newOrder[0]]: "left" as NavbarZone,
      [newOrder[1]]: "center" as NavbarZone,
      [newOrder[2]]: "right" as NavbarZone,
    } as NavbarBuilderConfig["layout"]);
  };

  const toggleZone = (id: "logo" | "links" | "cta") => {
    if (disabledZones.includes(id)) {
      onDisabledChange(disabledZones.filter((z) => z !== id));
    } else {
      onDisabledChange([...disabledZones, id]);
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={order} strategy={horizontalListSortingStrategy}>
        <div className="flex items-center gap-2">
          {order.map((id, i) => (
            <div key={id} className="flex items-center gap-2">
              {i > 0 && <span className="text-[10px] text-gray-300">&middot;</span>}
              <LayoutZonePill id={id} disabled={disabledZones.includes(id)} onToggle={() => toggleZone(id)} />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Click to enable/disable &middot; Drag to reorder</p>
        <div className="flex justify-between">
          <span className="text-[9px] text-gray-300">Left</span>
          <span className="text-[9px] text-gray-300">Center</span>
          <span className="text-[9px] text-gray-300">Right</span>
        </div>
      </SortableContext>
    </DndContext>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  onSave?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  saveRef?: React.MutableRefObject<(() => Promise<void>) | null>;
  onConfigChange?: (config: NavbarBuilderConfig) => void;
  /** When provided, NavbarBuilder uses this config instead of loading from API */
  externalConfig?: NavbarBuilderConfig;
  /** Called on every change when using externalConfig mode */
  onExternalConfigChange?: (config: NavbarBuilderConfig) => void;
  /** Hide the save button (used when parent manages saving) */
  hideSaveButton?: boolean;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NavbarBuilder({ onSave, onDirtyChange, saveRef, onConfigChange, externalConfig, onExternalConfigChange, hideSaveButton }: Props) {
  const isExternal = !!externalConfig;
  const [config, setConfig] = useState<NavbarBuilderConfig>(externalConfig || EMPTY_CONFIG);
  const [loadedConfig, setLoadedConfig] = useState<NavbarBuilderConfig | null>(externalConfig || null);
  const [loading, setLoading] = useState(!isExternal);
  const [saving, setSaving] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const logoUploadRef = useRef<HTMLInputElement>(null);
  const [dirty, setDirty] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // ── Sync external config ──────────────────────────────────────────────────
  useEffect(() => {
    if (externalConfig) {
      setConfig(externalConfig);
      setLoadedConfig(externalConfig);
    }
  }, [externalConfig]);

  // ── Load (only in standalone mode) ────────────────────────────────────────

  useEffect(() => {
    if (isExternal) return;
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((res) => {
        const s = res.settings || {};
        let loaded: NavbarBuilderConfig;
        if (s.navbar_builder_config) {
          loaded = s.navbar_builder_config as NavbarBuilderConfig;
        } else if (s.navbar_config) {
          loaded = convertLegacyToV2(s.navbar_config as Record<string, unknown>);
        } else {
          loaded = EMPTY_CONFIG;
        }
        setConfig(loaded);
        setLoadedConfig(loaded);
      })
      .catch(() => toast.error("Failed to load navbar config"))
      .finally(() => setLoading(false));
  }, [isExternal]);

  // ── Dirty tracking ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loadedConfig) return;
    const isDirty = JSON.stringify(config) !== JSON.stringify(loadedConfig);
    setDirty(isDirty);
    onDirtyChange?.(isDirty);
  }, [config, loadedConfig, onDirtyChange]);

  // ── Save (only in standalone mode) ────────────────────────────────────────

  const save = useCallback(async () => {
    if (isExternal) return;
    setSaving(true);
    try {
      const res = await fetch("/api/global-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ navbar_builder_config: config }),
      });
      if (!res.ok) throw new Error();
      toast.success("Navbar saved");
      setLoadedConfig(config);
      setDirty(false);
      onDirtyChange?.(false);
      onSave?.();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [config, onSave, onDirtyChange, isExternal]);

  // Wire saveRef on mount (and whenever save changes)
  useEffect(() => {
    if (saveRef) {
      saveRef.current = save;
    }
  }, [saveRef, save]);

  // ── Config updater helper ─────────────────────────────────────────────────

  const updateConfig = useCallback((updater: (prev: NavbarBuilderConfig) => NavbarBuilderConfig) => {
    setConfig(prev => {
      const next = updater(prev);
      onConfigChange?.(next);
      onExternalConfigChange?.(next);
      return next;
    });
  }, [onConfigChange, onExternalConfigChange]);

  // ── Flat tree items (derived from config.links) ──────────────────────────

  const flatItems = useMemo(() => flattenTree(config.links), [config.links]);

  // ── Flat tree operations ────────────────────────────────────────────────

  const addLink = () => {
    updateConfig(prev => {
      const flat = flattenTree(prev.links);
      flat.push({ id: genId(), depth: 0, label: "New Link", href: "/" });
      return { ...prev, links: buildTree(flat) };
    });
  };

  const updateFlatItem = (id: string, key: string, value: string | boolean) => {
    updateConfig(prev => {
      const flat = flattenTree(prev.links);
      const idx = flat.findIndex(i => i.id === id);
      if (idx === -1) return prev;
      flat[idx] = { ...flat[idx], [key]: value };
      return { ...prev, links: buildTree(flat) };
    });
  };

  const removeFlatItem = (id: string) => {
    updateConfig(prev => {
      const flat = flattenTree(prev.links);
      const [start, end] = getItemSpan(flat, id);
      if (start === -1) return prev;
      const newFlat = [...flat.slice(0, start), ...flat.slice(end)];
      return { ...prev, links: buildTree(newFlat) };
    });
  };

  const indentItem = (id: string) => {
    updateConfig(prev => {
      const flat = flattenTree(prev.links);
      const idx = flat.findIndex(i => i.id === id);
      if (idx <= 0 || flat[idx].depth >= 2) return prev;
      // Can only indent if the item above is at same depth or deeper
      if (flat[idx - 1].depth < flat[idx].depth) return prev;
      const [start, end] = getItemSpan(flat, id);
      const newFlat = flat.map((fi, i) => {
        if (i >= start && i < end) {
          return { ...fi, depth: Math.min(2, fi.depth + 1) };
        }
        return fi;
      });
      return { ...prev, links: buildTree(newFlat) };
    });
  };

  const outdentItem = (id: string) => {
    updateConfig(prev => {
      const flat = flattenTree(prev.links);
      const idx = flat.findIndex(i => i.id === id);
      if (idx === -1 || flat[idx].depth <= 0) return prev;
      const [start, end] = getItemSpan(flat, id);
      const newFlat = flat.map((fi, i) => {
        if (i >= start && i < end) {
          return { ...fi, depth: Math.max(0, fi.depth - 1) };
        }
        return fi;
      });
      return { ...prev, links: buildTree(newFlat) };
    });
  };

  const addChildToItem = (id: string) => {
    updateConfig(prev => {
      const flat = flattenTree(prev.links);
      const idx = flat.findIndex(i => i.id === id);
      if (idx === -1 || flat[idx].depth >= 2) return prev;
      const [, end] = getItemSpan(flat, id);
      const newItem: FlatItem = { id: genId(), depth: flat[idx].depth + 1, label: "New Link", href: "/" };
      const newFlat = [...flat.slice(0, end), newItem, ...flat.slice(end)];
      return { ...prev, links: buildTree(newFlat) };
    });
  };

  // ── DnD (flat tree — all levels) ───────────────────────────────────────

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    updateConfig(prev => {
      const flat = flattenTree(prev.links);
      const activeIdx = flat.findIndex(i => i.id === active.id);
      const overIdx = flat.findIndex(i => i.id === over.id);
      if (activeIdx === -1 || overIdx === -1) return prev;

      // Can't drop on own descendant
      const [spanStart, spanEnd] = getItemSpan(flat, active.id as string);
      if (overIdx >= spanStart && overIdx < spanEnd) return prev;

      // Extract items to move (item + descendants)
      const itemsToMove = flat.slice(spanStart, spanEnd);
      const moveIds = new Set(itemsToMove.map(i => i.id));
      const remaining = flat.filter(i => !moveIds.has(i.id));

      // Find insert position
      const overIdxInRemaining = remaining.findIndex(i => i.id === over.id);
      const insertAt = spanStart < overIdx
        ? overIdxInRemaining + 1  // moving DOWN → insert after over
        : overIdxInRemaining;     // moving UP → insert before over

      // Adjust depth: match the over item's depth
      const overDepth = flat[overIdx].depth;
      const targetDepth = Math.min(overDepth, 2);
      const depthDelta = targetDepth - itemsToMove[0].depth;
      const adjustedItems = itemsToMove.map(item => ({
        ...item,
        depth: Math.max(0, Math.min(2, item.depth + depthDelta)),
      }));

      const newFlat = [
        ...remaining.slice(0, insertAt),
        ...adjustedItems,
        ...remaining.slice(insertAt),
      ];

      return { ...prev, links: buildTree(newFlat) };
    });
  };

  // ── CTA management ────────────────────────────────────────────────────────

  const addCta = () => {
    if (config.ctaButtons.length >= 2) return;
    updateConfig(prev => ({
      ...prev,
      ctaButtons: [...prev.ctaButtons, { text: "Button", href: "/", variant: "outline", bounce: false }],
    }));
  };

  const updateCta = (index: number, updates: Partial<NavbarCtaConfig>) => {
    updateConfig(prev => {
      const ctaButtons = [...prev.ctaButtons];
      ctaButtons[index] = { ...ctaButtons[index], ...updates };
      return { ...prev, ctaButtons };
    });
  };

  const removeCta = (index: number) => {
    if (config.ctaButtons.length <= 1) return;
    updateConfig(prev => ({ ...prev, ctaButtons: prev.ctaButtons.filter((_, i) => i !== index) }));
  };

  // ── Logo upload handler ──────────────────────────────────────────────────
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/media/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const { asset } = await res.json();
      if (asset?.public_url) {
        updateConfig(prev => ({ ...prev, logo: { ...prev.logo, src: asset.public_url } }));
      }
    } catch {
      toast.error("Failed to upload logo");
    }
    if (logoUploadRef.current) logoUploadRef.current.value = "";
  };

  // ── Render ────────────────────────────────────────────────────────────────

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
    <div className="flex flex-col">
      {/* Scrollable content */}
      <div className="p-4 space-y-4">

        {/* Layout Zones — draggable pills */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-gray-700">Layout Zones</h4>
          <p className="text-[10px] text-gray-400">Drag to reorder: Left &middot; Center &middot; Right</p>
          <LayoutZoneDnd
            layout={config.layout}
            onChange={(layout) => updateConfig(prev => ({ ...prev, layout }))}
            disabledZones={config.disabledZones || []}
            onDisabledChange={(disabledZones) => updateConfig(prev => ({ ...prev, disabledZones }))}
          />
        </div>

        {/* Logo */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-gray-700">Logo</h4>
          <div className="flex items-center gap-3">
            {config.logo.src && (
              <img src={config.logo.src} alt="Logo preview" className="h-10 w-auto rounded border border-gray-200 bg-white p-1" />
            )}
            <div className="flex gap-1.5">
              <label className="text-[10px] font-semibold px-2.5 py-1 rounded-lg cursor-pointer bg-teal text-white hover:bg-teal-dark transition-colors">
                Upload
                <input ref={logoUploadRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              <button
                onClick={() => setMediaPickerOpen(true)}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-gray-300 text-gray-600 hover:text-charcoal hover:border-gray-400 transition-colors"
              >
                Library
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Or enter URL</label>
            <input
              type="text"
              value={config.logo.src}
              onChange={(e) => updateConfig(prev => ({ ...prev, logo: { ...prev.logo, src: e.target.value } }))}
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
              placeholder="/images/logo.png"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Height (px)</label>
              <input
                type="number"
                value={config.logo.height}
                onChange={(e) => updateConfig(prev => ({ ...prev, logo: { ...prev.logo, height: Number(e.target.value) } }))}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Height Scrolled (px)</label>
              <input
                type="number"
                value={config.logo.heightScrolled}
                onChange={(e) => updateConfig(prev => ({ ...prev, logo: { ...prev.logo, heightScrolled: Number(e.target.value) } }))}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={config.logo.showText}
              onChange={(e) => updateConfig(prev => ({ ...prev, logo: { ...prev.logo, showText: e.target.checked } }))}
            />
            Show text next to logo
          </label>
          {config.logo.showText && (
            <input
              type="text"
              value={config.logo.text}
              onChange={(e) => updateConfig(prev => ({ ...prev, logo: { ...prev.logo, text: e.target.value } }))}
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
              placeholder="Brand text"
            />
          )}
        </div>

        {/* Navigation Links */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-700">Navigation Links</h4>
            <button onClick={addLink} className="text-teal hover:text-teal-dark text-[10px] font-semibold">
              + Add Link
            </button>
          </div>
          <p className="text-[10px] text-gray-400">
            Drag any item to reorder. Use <span className="font-bold">&raquo;</span> to nest deeper or <span className="font-bold">&laquo;</span> to promote.
            <span className="font-bold">+</span> adds a sub-link. Up to 3 levels.
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={flatItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1">
                {flatItems.map((item, idx) => {
                  const canIndent = idx > 0 && item.depth < 2 && flatItems[idx - 1].depth >= item.depth;
                  const canOutdent = item.depth > 0;
                  const canAddChild = item.depth < 2;
                  return (
                    <FlatSortableRow
                      key={item.id}
                      item={item}
                      canIndent={canIndent}
                      canOutdent={canOutdent}
                      canAddChild={canAddChild}
                      onUpdate={(key, value) => updateFlatItem(item.id, key, value)}
                      onRemove={() => removeFlatItem(item.id)}
                      onIndent={() => indentItem(item.id)}
                      onOutdent={() => outdentItem(item.id)}
                      onAddChild={() => addChildToItem(item.id)}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* CTA Buttons */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-700">CTA Buttons</h4>
            {config.ctaButtons.length < 2 && (
              <button onClick={addCta} className="text-teal hover:text-teal-dark text-[10px] font-semibold">
                + Add CTA
              </button>
            )}
          </div>

          {config.ctaButtons.map((cta, i) => (
            <div key={i} className="border border-gray-200 rounded-lg bg-white p-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-500">CTA {i + 1}</span>
                {config.ctaButtons.length > 1 && (
                  <button onClick={() => removeCta(i)} className="text-gray-300 hover:text-red-500 p-0.5">
                    <IconX size="3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Text</label>
                  <input
                    type="text"
                    value={cta.text}
                    onChange={(e) => updateCta(i, { text: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">URL</label>
                  <UrlInput
                    value={cta.href}
                    onChange={(val) => updateCta(i, { href: val })}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Variant</label>
                  <select
                    value={cta.variant}
                    onChange={(e) => updateCta(i, { variant: e.target.value as NavbarCtaConfig["variant"] })}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-xs"
                  >
                    {Object.entries(VARIANT_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 pt-3">
                  <label className="flex items-center gap-1 text-[10px] text-gray-500">
                    <input type="checkbox" checked={cta.external ?? true} onChange={(e) => updateCta(i, { external: e.target.checked })} /> New tab
                  </label>
                  <label className="flex items-center gap-1 text-[10px] text-gray-500">
                    <input type="checkbox" checked={cta.bounce ?? false} onChange={(e) => updateCta(i, { bounce: e.target.checked })} /> Bounce
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">BG Color</label>
                  <div className="flex gap-1">
                    <input type="color" value={cta.bgColor || "#2dd4bf"} onChange={(e) => updateCta(i, { bgColor: e.target.value })} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                    <input type="text" value={cta.bgColor || ""} onChange={(e) => updateCta(i, { bgColor: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="default" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Text Color</label>
                  <div className="flex gap-1">
                    <input type="color" value={cta.textColor || "#ffffff"} onChange={(e) => updateCta(i, { textColor: e.target.value })} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                    <input type="text" value={cta.textColor || ""} onChange={(e) => updateCta(i, { textColor: e.target.value })} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" placeholder="default" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navbar Style */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-gray-700">Navbar Style</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Background</label>
              <div className="flex gap-1">
                <input type="color" value={config.style?.bgColor || "#1a1a1a"} onChange={(e) => updateConfig(prev => ({ ...prev, style: { ...prev.style!, bgColor: e.target.value } }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={config.style?.bgColor || "#1a1a1a"} onChange={(e) => updateConfig(prev => ({ ...prev, style: { ...prev.style!, bgColor: e.target.value } }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">BG Opacity (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={config.style?.bgOpacity ?? 95}
                onChange={(e) => updateConfig(prev => ({ ...prev, style: { ...prev.style!, bgOpacity: Number(e.target.value) } }))}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Text Color</label>
              <div className="flex gap-1">
                <input type="color" value={config.style?.textColor || "#ffffff"} onChange={(e) => updateConfig(prev => ({ ...prev, style: { ...prev.style!, textColor: e.target.value } }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={config.style?.textColor || "#ffffff"} onChange={(e) => updateConfig(prev => ({ ...prev, style: { ...prev.style!, textColor: e.target.value } }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 mb-0.5">Hover Color</label>
              <div className="flex gap-1">
                <input type="color" value={config.style?.hoverColor || "#2dd4bf"} onChange={(e) => updateConfig(prev => ({ ...prev, style: { ...prev.style!, hoverColor: e.target.value } }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={config.style?.hoverColor || "#2dd4bf"} onChange={(e) => updateConfig(prev => ({ ...prev, style: { ...prev.style!, hoverColor: e.target.value } }))} className="flex-1 px-2 py-1 border border-gray-200 rounded text-[10px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Badge / Indicator */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-gray-700">Badge / Indicator</h4>
            {!config.badge?.text && (
              <button
                onClick={() => updateConfig(prev => ({ ...prev, badge: { text: "Event Name", bgColor: "#f97316", bgColorEnd: "#eab308", textColor: "#ffffff" } }))}
                className="text-teal hover:text-teal-dark text-[10px] font-semibold"
              >
                + Add Badge
              </button>
            )}
          </div>
          {config.badge?.text ? (
            <>
              <div>
                <label className="block text-[10px] text-gray-500 mb-0.5">Badge Text</label>
                <input
                  type="text"
                  value={config.badge.text}
                  onChange={(e) => updateConfig(prev => ({ ...prev, badge: { ...prev.badge!, text: e.target.value } }))}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">BG Start</label>
                  <div className="flex gap-1">
                    <input type="color" value={config.badge.bgColor} onChange={(e) => updateConfig(prev => ({ ...prev, badge: { ...prev.badge!, bgColor: e.target.value } }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                    <input type="text" value={config.badge.bgColor} onChange={(e) => updateConfig(prev => ({ ...prev, badge: { ...prev.badge!, bgColor: e.target.value } }))} className="flex-1 min-w-0 px-1 py-1 border border-gray-200 rounded text-[10px]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">BG End</label>
                  <div className="flex gap-1">
                    <input type="color" value={config.badge.bgColorEnd || config.badge.bgColor} onChange={(e) => updateConfig(prev => ({ ...prev, badge: { ...prev.badge!, bgColorEnd: e.target.value } }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                    <input type="text" value={config.badge.bgColorEnd || ""} onChange={(e) => updateConfig(prev => ({ ...prev, badge: { ...prev.badge!, bgColorEnd: e.target.value || undefined } }))} className="flex-1 min-w-0 px-1 py-1 border border-gray-200 rounded text-[10px]" placeholder="none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-0.5">Text</label>
                  <div className="flex gap-1">
                    <input type="color" value={config.badge.textColor || "#ffffff"} onChange={(e) => updateConfig(prev => ({ ...prev, badge: { ...prev.badge!, textColor: e.target.value } }))} className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5" />
                    <input type="text" value={config.badge.textColor || "#ffffff"} onChange={(e) => updateConfig(prev => ({ ...prev, badge: { ...prev.badge!, textColor: e.target.value } }))} className="flex-1 min-w-0 px-1 py-1 border border-gray-200 rounded text-[10px]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-400">Preview:</span>
                <span
                  className="font-display font-bold px-4 py-1.5 rounded-xl text-sm"
                  style={{
                    background: config.badge.bgColorEnd
                      ? `linear-gradient(to right, ${config.badge.bgColor}, ${config.badge.bgColorEnd})`
                      : config.badge.bgColor,
                    color: config.badge.textColor || "#ffffff",
                  }}
                >
                  {config.badge.text}
                </span>
              </div>
              <button
                onClick={() => updateConfig(prev => ({ ...prev, badge: undefined }))}
                className="text-[10px] text-red-500 hover:text-red-700"
              >
                Remove Badge
              </button>
            </>
          ) : (
            <p className="text-[10px] text-gray-400">No badge configured. Add one to display an event indicator.</p>
          )}
        </div>

        {/* Event overrides */}
        <details className="bg-gray-50 rounded-lg">
          <summary className="px-3 py-2 text-xs font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 rounded-lg">
            Event Page Overrides
          </summary>
          <div className="px-3 pb-3 border-t border-gray-100 pt-2">
            <p className="text-[10px] text-gray-400 mb-2">
              Configure different nav links for specific event pages. Edit via JSON.
            </p>
            <textarea
              value={JSON.stringify(config.eventOverrides || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateConfig(prev => ({ ...prev, eventOverrides: parsed }));
                } catch { /* invalid JSON — ignore */ }
              }}
              className="w-full p-2 border border-gray-200 rounded-lg font-mono text-[10px]"
              rows={8}
              placeholder="{}"
            />
          </div>
        </details>

        {/* Spacer so content isn't hidden behind sticky button */}
        <div className="h-2" />
      </div>

      {/* Sticky save button */}
      {!hideSaveButton && (
        <div className="bg-white border-t border-gray-100 p-4 sticky bottom-0 z-10">
          <button
            onClick={save}
            disabled={saving}
            className={`w-full font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 text-sm ${
              dirty
                ? "bg-teal hover:bg-teal-dark text-white"
                : "bg-gray-100 text-gray-400 cursor-default"
            }`}
          >
            {saving ? "Saving..." : dirty ? "Save Navbar" : "No Changes"}
          </button>
        </div>
      )}

      {/* Media picker modal for logo */}
      <MediaPickerModal
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => updateConfig(prev => ({ ...prev, logo: { ...prev.logo, src: url } }))}
      />
    </div>
  );
}
