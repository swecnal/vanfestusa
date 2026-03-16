"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const EMPTY_CONFIG: NavbarBuilderConfig = {
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
function convertLegacyToV2(legacy: Record<string, unknown>): NavbarBuilderConfig {
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

// ── Grandchild row (level 3) ──────────────────────────────────────────────────

function GrandchildRow({
  gc,
  onUpdate,
  onRemove,
  onUnnest,
}: {
  gc: NavbarLinkV2;
  onUpdate: (key: string, value: string) => void;
  onRemove: () => void;
  onUnnest: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 ml-12">
      <span className="text-gray-300 text-[10px]">↳</span>
      <input
        type="text"
        value={gc.label}
        onChange={(e) => onUpdate("label", e.target.value)}
        className="flex-1 min-w-0 px-2 py-0.5 border border-gray-200 rounded text-[10px]"
        placeholder="Sub-sub Label"
      />
      <input
        type="text"
        value={gc.href}
        onChange={(e) => onUpdate("href", e.target.value)}
        className="flex-1 min-w-0 px-2 py-0.5 border border-gray-200 rounded text-[10px]"
        placeholder="/path"
      />
      <button
        onClick={onUnnest}
        className="text-gray-400 hover:text-teal p-0.5 shrink-0"
        title="Move up to level 2"
      >
        <IconNestOut />
      </button>
      <button onClick={onRemove} className="text-gray-300 hover:text-red-500 p-0.5 shrink-0">
        <IconX size="3" />
      </button>
    </div>
  );
}

// ── Child row (level 2) with optional grandchildren (level 3) ─────────────────

function ChildRow({
  child,
  childIndex,
  parentIndex,
  canNestIntoSibling,
  onUpdate,
  onRemove,
  onUnnest,
  onNestIntoSibling,
  onAddGrandchild,
  onUpdateGrandchild,
  onRemoveGrandchild,
  onUnnestGrandchild,
}: {
  child: NavbarLinkV2;
  childIndex: number;
  parentIndex: number;
  canNestIntoSibling: boolean;
  onUpdate: (key: string, value: string) => void;
  onRemove: () => void;
  onUnnest: () => void;
  onNestIntoSibling: () => void;
  onAddGrandchild: () => void;
  onUpdateGrandchild: (gci: number, key: string, value: string) => void;
  onRemoveGrandchild: (gci: number) => void;
  onUnnestGrandchild: (gci: number) => void;
}) {
  const grandchildren = child.children || [];

  return (
    <div className="space-y-0.5">
      {/* Level-2 row */}
      <div className="flex items-center gap-1.5 ml-6">
        <span className="text-gray-300 text-xs">↳</span>
        <input
          type="text"
          value={child.label}
          onChange={(e) => onUpdate("label", e.target.value)}
          className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[11px]"
          placeholder="Sub Label"
        />
        <input
          type="text"
          value={child.href}
          onChange={(e) => onUpdate("href", e.target.value)}
          className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-[11px]"
          placeholder="/path"
        />
        <div className="flex gap-0.5 shrink-0">
          {canNestIntoSibling && (
            <button
              onClick={onNestIntoSibling}
              className="text-gray-400 hover:text-teal p-0.5"
              title="Nest into child above (level 3)"
            >
              <IconNestIn />
            </button>
          )}
          <button
            onClick={onUnnest}
            className="text-gray-400 hover:text-teal p-0.5"
            title="Promote to top-level link"
          >
            <IconNestOut />
          </button>
          <button onClick={onRemove} className="text-gray-300 hover:text-red-500 p-0.5">
            <IconX size="3" />
          </button>
        </div>
      </div>

      {/* Level-3 rows */}
      {grandchildren.map((gc, gci) => (
        <GrandchildRow
          key={gc.id}
          gc={gc}
          onUpdate={(key, value) => onUpdateGrandchild(gci, key, value)}
          onRemove={() => onRemoveGrandchild(gci)}
          onUnnest={() => onUnnestGrandchild(gci)}
        />
      ))}

      {/* Add grandchild */}
      <button
        onClick={onAddGrandchild}
        className="ml-12 text-teal/60 hover:text-teal text-[10px] font-semibold"
      >
        + Add Sub Link
      </button>
    </div>
  );
}

// ── Top-level sortable card (level 1) ─────────────────────────────────────────

function SortableLinkCard({
  link,
  index,
  selected,
  onSelect,
  onRemove,
  onUpdate,
  onAddChild,
  onUpdateChild,
  onRemoveChild,
  onNest,
  onUnnest,
  onNestChildIntoSibling,
  onAddGrandchild,
  onUpdateGrandchild,
  onRemoveGrandchild,
  onUnnestGrandchild,
  canNest,
}: {
  link: NavbarLinkV2;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onUpdate: (key: string, value: unknown) => void;
  onAddChild: () => void;
  onUpdateChild: (ci: number, key: string, value: string) => void;
  onRemoveChild: (ci: number) => void;
  onNest: () => void;
  onUnnest: (ci: number) => void;
  onNestChildIntoSibling: (ci: number) => void;
  onAddGrandchild: (ci: number) => void;
  onUpdateGrandchild: (ci: number, gci: number, key: string, value: string) => void;
  onRemoveGrandchild: (ci: number, gci: number) => void;
  onUnnestGrandchild: (ci: number, gci: number) => void;
  canNest: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const children = link.children || [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg bg-white transition-colors ${
        selected ? "border-teal ring-1 ring-teal/20" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Level-1 row */}
      <div className="flex items-center gap-1.5 p-2" onClick={onSelect}>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none p-0.5 shrink-0"
        >
          <IconGrip />
        </button>
        <input
          type="text"
          value={link.label}
          onChange={(e) => onUpdate("label", e.target.value)}
          className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-xs"
          placeholder="Label"
          onClick={(e) => e.stopPropagation()}
        />
        <input
          type="text"
          value={link.href}
          onChange={(e) => onUpdate("href", e.target.value)}
          className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded text-xs"
          placeholder="/path"
          onClick={(e) => e.stopPropagation()}
        />
        <label className="flex items-center gap-1 text-[10px] text-gray-500 whitespace-nowrap shrink-0" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={link.external || false}
            onChange={(e) => onUpdate("external", e.target.checked)}
          />
          Ext
        </label>
        <div className="flex gap-0.5 shrink-0">
          {canNest && (
            <button
              onClick={(e) => { e.stopPropagation(); onNest(); }}
              className="text-gray-400 hover:text-teal p-0.5"
              title="Nest under previous link (level 2)"
            >
              <IconNestIn />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="text-gray-300 hover:text-red-500 p-0.5"
          >
            <IconX />
          </button>
        </div>
      </div>

      {/* Children (level 2) + grandchildren (level 3) */}
      {children.length > 0 && (
        <div className="px-2 pb-2 space-y-1.5 border-t border-gray-50 pt-1.5">
          {children.map((child, ci) => (
            <ChildRow
              key={child.id}
              child={child}
              childIndex={ci}
              parentIndex={index}
              canNestIntoSibling={ci > 0}
              onUpdate={(key, value) => onUpdateChild(ci, key, value)}
              onRemove={() => onRemoveChild(ci)}
              onUnnest={() => onUnnest(ci)}
              onNestIntoSibling={() => onNestChildIntoSibling(ci)}
              onAddGrandchild={() => onAddGrandchild(ci)}
              onUpdateGrandchild={(gci, key, value) => onUpdateGrandchild(ci, gci, key, value)}
              onRemoveGrandchild={(gci) => onRemoveGrandchild(ci, gci)}
              onUnnestGrandchild={(gci) => onUnnestGrandchild(ci, gci)}
            />
          ))}
        </div>
      )}

      {/* Add child button */}
      <div className={`px-2 pb-2 ${children.length > 0 ? "" : "border-t border-gray-50 pt-1"}`}>
        <button
          onClick={onAddChild}
          className="ml-6 text-teal/60 hover:text-teal text-[10px] font-semibold"
        >
          + Add Sub Link
        </button>
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  onSave?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  saveRef?: React.MutableRefObject<(() => Promise<void>) | null>;
  onConfigChange?: () => void;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NavbarBuilder({ onSave, onDirtyChange, saveRef, onConfigChange }: Props) {
  const [config, setConfig] = useState<NavbarBuilderConfig>(EMPTY_CONFIG);
  const [loadedConfig, setLoadedConfig] = useState<NavbarBuilderConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // ── Load ──────────────────────────────────────────────────────────────────

  useEffect(() => {
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
  }, []);

  // ── Dirty tracking ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loadedConfig) return;
    const isDirty = JSON.stringify(config) !== JSON.stringify(loadedConfig);
    setDirty(isDirty);
    onDirtyChange?.(isDirty);
  }, [config, loadedConfig, onDirtyChange]);

  // ── Save ──────────────────────────────────────────────────────────────────

  const save = useCallback(async () => {
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
  }, [config, onSave, onDirtyChange]);

  // Wire saveRef on mount (and whenever save changes)
  useEffect(() => {
    if (saveRef) {
      saveRef.current = save;
    }
  }, [saveRef, save]);

  // ── Config updater helper ─────────────────────────────────────────────────

  const updateConfig = useCallback((updater: (prev: NavbarBuilderConfig) => NavbarBuilderConfig) => {
    setConfig(updater);
    onConfigChange?.();
  }, [onConfigChange]);

  // ── Top-level link management ─────────────────────────────────────────────

  const addLink = () => {
    const link: NavbarLinkV2 = { id: genId(), label: "New Link", href: "/" };
    updateConfig(prev => ({ ...prev, links: [...prev.links, link] }));
    setSelectedLinkId(link.id);
  };

  const updateLink = (index: number, key: string, value: unknown) => {
    updateConfig(prev => {
      const links = [...prev.links];
      links[index] = { ...links[index], [key]: value };
      return { ...prev, links };
    });
  };

  const removeLink = (index: number) => {
    const id = config.links[index]?.id;
    updateConfig(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
    if (selectedLinkId === id) setSelectedLinkId(null);
  };

  // Nest top-level link into previous link as a level-2 child
  const nestLink = (index: number) => {
    if (index <= 0) return;
    updateConfig(prev => {
      const links = [...prev.links];
      const linkToNest = links[index];
      const parentLink = links[index - 1];
      // When nesting, carry the link's own children (as grandchildren) — max depth respected by UI
      const newChild: NavbarLinkV2 = {
        id: linkToNest.id,
        label: linkToNest.label,
        href: linkToNest.href,
        external: linkToNest.external,
        children: linkToNest.children,
      };
      const children = [...(parentLink.children || []), newChild];
      links[index - 1] = { ...parentLink, children };
      links.splice(index, 1);
      return { ...prev, links };
    });
  };

  // Unnest a level-2 child to top-level (after parent)
  const unnestChild = (linkIndex: number, childIndex: number) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const parent = links[linkIndex];
      const children = [...(parent.children || [])];
      const child = children[childIndex];
      children.splice(childIndex, 1);
      links[linkIndex] = { ...parent, children: children.length ? children : undefined };
      const newLink: NavbarLinkV2 = {
        id: child.id,
        label: child.label,
        href: child.href,
        external: child.external,
        children: child.children,
      };
      links.splice(linkIndex + 1, 0, newLink);
      return { ...prev, links };
    });
  };

  // ── Level-2 child management ──────────────────────────────────────────────

  const addChild = (linkIndex: number) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      children.push({ id: genId(), label: "Sub Link", href: "/" });
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  const updateChild = (linkIndex: number, childIndex: number, key: string, value: string) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      children[childIndex] = { ...children[childIndex], [key]: value };
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  const removeChild = (linkIndex: number, childIndex: number) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const children = (links[linkIndex].children || []).filter((_, i) => i !== childIndex);
      links[linkIndex] = { ...links[linkIndex], children: children.length ? children : undefined };
      return { ...prev, links };
    });
  };

  // Nest a level-2 child into the previous sibling child (making it level-3)
  const nestChildIntoSibling = (linkIndex: number, childIndex: number) => {
    if (childIndex <= 0) return;
    updateConfig(prev => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      const childToNest = children[childIndex];
      const targetChild = children[childIndex - 1];
      // Add as grandchild of targetChild (drop childToNest's own children to avoid depth-4)
      const grandchildren = [...(targetChild.children || []), {
        id: childToNest.id,
        label: childToNest.label,
        href: childToNest.href,
        external: childToNest.external,
      }];
      children[childIndex - 1] = { ...targetChild, children: grandchildren };
      children.splice(childIndex, 1);
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  // ── Level-3 grandchild management ─────────────────────────────────────────

  const addGrandchild = (linkIndex: number, childIndex: number) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      const grandchildren = [...(children[childIndex].children || [])];
      grandchildren.push({ id: genId(), label: "Sub Link", href: "/" });
      children[childIndex] = { ...children[childIndex], children: grandchildren };
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  const updateGrandchild = (linkIndex: number, childIndex: number, gcIndex: number, key: string, value: string) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      const grandchildren = [...(children[childIndex].children || [])];
      grandchildren[gcIndex] = { ...grandchildren[gcIndex], [key]: value };
      children[childIndex] = { ...children[childIndex], children: grandchildren };
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  const removeGrandchild = (linkIndex: number, childIndex: number, gcIndex: number) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      const grandchildren = (children[childIndex].children || []).filter((_, i) => i !== gcIndex);
      children[childIndex] = { ...children[childIndex], children: grandchildren.length ? grandchildren : undefined };
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  // Unnest a grandchild (level-3) back up to level-2 child of the parent link
  const unnestGrandchild = (linkIndex: number, childIndex: number, gcIndex: number) => {
    updateConfig(prev => {
      const links = [...prev.links];
      const children = [...(links[linkIndex].children || [])];
      const grandchildren = [...(children[childIndex].children || [])];
      const gc = grandchildren[gcIndex];
      grandchildren.splice(gcIndex, 1);
      children[childIndex] = {
        ...children[childIndex],
        children: grandchildren.length ? grandchildren : undefined,
      };
      // Insert as new child after the current child
      const newChild: NavbarLinkV2 = { id: gc.id, label: gc.label, href: gc.href, external: gc.external };
      children.splice(childIndex + 1, 0, newChild);
      links[linkIndex] = { ...links[linkIndex], children };
      return { ...prev, links };
    });
  };

  // ── DnD (top-level reorder only) ─────────────────────────────────────────

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    updateConfig(prev => {
      const links = [...prev.links];
      const oldIndex = links.findIndex(l => l.id === active.id);
      const newIndex = links.findIndex(l => l.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        return { ...prev, links: arrayMove(links, oldIndex, newIndex) };
      }
      return prev;
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

        {/* Layout Zones */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-gray-700">Layout Zones</h4>
          <p className="text-[10px] text-gray-400">Position each element in the navbar</p>
          <div className="grid grid-cols-3 gap-2">
            {(["logo", "links", "cta"] as const).map((item) => (
              <div key={item}>
                <label className="block text-[10px] text-gray-500 mb-0.5 capitalize">
                  {item === "cta" ? "CTA Buttons" : item}
                </label>
                <select
                  value={config.layout[item]}
                  onChange={(e) => updateConfig(prev => ({
                    ...prev,
                    layout: { ...prev.layout, [item]: e.target.value as NavbarZone },
                  }))}
                  className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
                >
                  {(["left", "center", "right"] as NavbarZone[]).map(zone => (
                    <option key={zone} value={zone}>{ZONE_LABELS[zone]}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Logo */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-gray-700">Logo</h4>
          <div>
            <label className="block text-[10px] text-gray-500 mb-0.5">Image URL</label>
            <input
              type="text"
              value={config.logo.src}
              onChange={(e) => updateConfig(prev => ({ ...prev, logo: { ...prev.logo, src: e.target.value } }))}
              className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
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
            Drag to reorder. Use the indent (right arrow) button to nest a link, or the dedent (left arrow) button to promote it.
            Up to 3 levels supported.
          </p>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={config.links.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {config.links.map((link, i) => (
                  <SortableLinkCard
                    key={link.id}
                    link={link}
                    index={i}
                    selected={selectedLinkId === link.id}
                    onSelect={() => setSelectedLinkId(selectedLinkId === link.id ? null : link.id)}
                    onRemove={() => removeLink(i)}
                    onUpdate={(key, value) => updateLink(i, key, value)}
                    onAddChild={() => addChild(i)}
                    onUpdateChild={(ci, key, value) => updateChild(i, ci, key, value)}
                    onRemoveChild={(ci) => removeChild(i, ci)}
                    onNest={() => nestLink(i)}
                    onUnnest={(ci) => unnestChild(i, ci)}
                    onNestChildIntoSibling={(ci) => nestChildIntoSibling(i, ci)}
                    onAddGrandchild={(ci) => addGrandchild(i, ci)}
                    onUpdateGrandchild={(ci, gci, key, value) => updateGrandchild(i, ci, gci, key, value)}
                    onRemoveGrandchild={(ci, gci) => removeGrandchild(i, ci, gci)}
                    onUnnestGrandchild={(ci, gci) => unnestGrandchild(i, ci, gci)}
                    canNest={i > 0}
                  />
                ))}
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
                  <input
                    type="text"
                    value={cta.href}
                    onChange={(e) => updateCta(i, { href: e.target.value })}
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
    </div>
  );
}
