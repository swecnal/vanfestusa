"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { usePageEditor } from "@/lib/page-editor-context";
import {
  DndContext,
  closestCenter,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Section, SectionType, SectionSettings } from "@/lib/types";
import { SECTION_TYPE_LABELS } from "@/lib/types";
import { SECTION_DEFAULTS } from "@/lib/section-defaults";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";
import SectionRenderer from "@/components/sections/SectionRenderer";
import SectionEditorPanel from "@/components/admin/SectionEditorPanel";
import NavbarBuilder from "@/components/admin/NavbarBuilder";
import FooterBuilder from "@/components/admin/FooterBuilder";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface PageData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_published: boolean;
  sections: Section[];
}

/* ─── Custom collision detection: prefer nest- droppables when intersecting ─── */
const nestAwareCollision: CollisionDetection = (args) => {
  // First check rect intersection for nest- droppables
  const rectCollisions = rectIntersection(args);
  const nestCollision = rectCollisions.find((c) => String(c.id).startsWith("nest-"));
  if (nestCollision) return [nestCollision];
  // Fall back to closestCenter for normal sortable reorder
  return closestCenter(args);
};

/* ─── Sortable live section wrapper ─── */
function SortableLiveSection({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
  onDuplicate,
  onMoveToAccordion,
  accordionGroups,
  siteStyles,
  editingData,
  editingSettings,
  activeDragId,
  activeDragType,
  previewMode,
}: {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveToAccordion?: (sectionId: string, accordionId: string) => void;
  accordionGroups?: { id: string; title: string }[];
  siteStyles: SiteStyles;
  editingData?: Record<string, unknown>;
  editingSettings?: Record<string, unknown>;
  activeDragId?: string | null;
  activeDragType?: string | null;
  previewMode: "desktop" | "mobile";
}) {
  const [showAccordionMenu, setShowAccordionMenu] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Use editing data if this section is being edited, otherwise use saved data
  // Force is_visible=true so SectionRenderer always renders (we handle dimming ourselves)
  const displaySection: Section = editingData
    ? {
        ...section,
        is_visible: true,
        data: editingData,
        settings: (editingSettings || section.settings) as SectionSettings,
      }
    : { ...section, is_visible: true };

  // Check if section is visibility-hidden for the current preview mode
  const dv = (displaySection.settings.deviceVisibility as string) || "both";
  const isVisibilityMismatch =
    (previewMode === "mobile" && dv === "desktop_only") ||
    (previewMode === "desktop" && dv === "mobile_only");
  const mismatchLabel = dv === "desktop_only" ? "Desktop Only" : dv === "mobile_only" ? "Mobile Only" : "";

  return (
    <div ref={setNodeRef} style={style} className="relative group/section">
      {/* Click target overlay - captures clicks without interfering with section rendering */}
      <div
        onClick={onSelect}
        className={`absolute inset-0 z-20 cursor-pointer transition-all ${
          isSelected
            ? "ring-2 ring-teal ring-inset shadow-lg shadow-teal/10"
            : "hover:ring-1 hover:ring-gray-400 hover:ring-inset"
        } ${!section.is_visible ? "bg-white/60" : ""}`}
      />

      {/* Section type label — appears on hover */}
      <div className={`absolute top-2 left-2 z-30 transition-opacity ${
        isSelected ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
      }`}>
        <span className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded shadow-sm ${
          isSelected ? "bg-teal text-white" : "bg-charcoal/80 text-white"
        }`}>
          {SECTION_TYPE_LABELS[section.section_type as SectionType] || section.section_type}
          {!section.is_visible && " (Hidden)"}
        </span>
      </div>

      {/* Floating action bar */}
      <div className={`absolute top-1.5 right-1.5 md:top-2 md:right-2 z-30 flex items-center gap-1.5 md:gap-1 transition-opacity ${
        isSelected ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
      }`}>
        <button
          className="bg-charcoal text-white rounded-full p-2 md:p-1.5 shadow-lg cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm8-12a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
          className={`rounded-full p-2 md:p-1.5 shadow-lg ${
            section.is_visible ? "bg-charcoal text-white" : "bg-yellow-500 text-white"
          }`}
          title={section.is_visible ? "Hide section" : "Show section"}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {section.is_visible ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            )}
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="bg-charcoal text-white rounded-full p-2 md:p-1.5 shadow-lg"
          title="Duplicate section"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
          </svg>
        </button>
        {/* Move to Accordion — only for non-accordion sections when accordions exist */}
        {accordionGroups && accordionGroups.length > 0 && section.section_type !== "accordion_parent" && (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowAccordionMenu(!showAccordionMenu); }}
              className="bg-charcoal text-white rounded-full p-2 md:p-1.5 shadow-lg"
              title="Move into Accordion Group"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" />
              </svg>
            </button>
            {showAccordionMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] z-30">
                <p className="px-3 py-1 text-[10px] text-gray-400 uppercase font-semibold">Move into...</p>
                {accordionGroups.map((ag) => (
                  <button
                    key={ag.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAccordionMenu(false);
                      onMoveToAccordion?.(section.id, ag.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-teal/10 hover:text-teal transition-colors"
                  >
                    {ag.title || "Accordion Group"}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="bg-red-500 text-white rounded-full p-2 md:p-1.5 shadow-lg"
          title="Delete section"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Live section render */}
      <div className={`${!section.is_visible ? "opacity-30" : ""} ${isVisibilityMismatch ? "opacity-20" : ""}`}>
        <SectionRenderer section={displaySection} siteStyles={siteStyles} />
      </div>

      {/* Visibility mismatch badge */}
      {isVisibilityMismatch && (
        <div className="absolute inset-0 z-[18] pointer-events-none flex items-center justify-center" style={{ background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)" }}>
          <span className="bg-gray-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
            {mismatchLabel}
          </span>
        </div>
      )}

      {/* Nest drop zone — appears on accordion sections when dragging a non-accordion section */}
      {section.section_type === "accordion_parent" &&
        activeDragId &&
        activeDragId !== section.id &&
        activeDragType !== "accordion_parent" && (
          <NestDropZone accordionId={section.id} title={(section.data.title as string) || "Accordion Group"} />
        )}
    </div>
  );
}

/* ─── Nest Drop Zone (drop into accordion) ─── */
function NestDropZone({ accordionId, title }: { accordionId: string; title: string }) {
  const { isOver, setNodeRef } = useDroppable({ id: `nest-${accordionId}` });

  return (
    <div
      ref={setNodeRef}
      className={`mx-4 mb-2 rounded-lg border-2 border-dashed transition-all z-20 relative ${
        isOver
          ? "border-teal bg-teal/10 py-4"
          : "border-teal/40 bg-teal/5 py-3"
      }`}
    >
      <div className="flex items-center justify-center gap-2 text-teal text-xs font-semibold">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859" />
        </svg>
        {isOver ? `Drop to nest into "${title}"` : `Drop here to nest into "${title}"`}
      </div>
    </div>
  );
}

/* ─── Drop Zone for external element drops ─── */
function DropZone({
  index,
  onDrop,
  isActive,
}: {
  index: number;
  onDrop: (type: SectionType, index: number) => void;
  isActive: boolean;
}) {
  const [isOver, setIsOver] = useState(false);

  if (!isActive) return null;

  return (
    <div
      className={`relative transition-all duration-150 rounded-lg ${
        isOver
          ? "h-14 bg-teal/10 border-2 border-dashed border-teal/50 mx-4"
          : "h-4"
      }`}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("application/section-type")) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
          setIsOver(true);
        }
      }}
      onDragEnter={(e) => {
        if (e.dataTransfer.types.includes("application/section-type")) {
          e.preventDefault();
          setIsOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const type = e.dataTransfer.getData("application/section-type") as SectionType;
        if (type) onDrop(type, index);
      }}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 text-teal text-xs font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Drop here
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page Editor ─── */
export default function PageEditorPage() {
  const params = useParams();
  const pageId = params.pageId as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [globalEditTarget, setGlobalEditTarget] = useState<"navbar" | "footer" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [externalDragActive, setExternalDragActive] = useState(false);
  const [siteStyles, setSiteStyles] = useState<SiteStyles>(EMPTY_SITE_STYLES);
  // Track active internal drag for nest-into-accordion
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  // In-progress editing state for real-time preview
  const [editingData, setEditingData] = useState<Record<string, unknown> | null>(null);
  const [editingSettings, setEditingSettings] = useState<Record<string, unknown> | null>(null);
  const dragCounter = useRef(0);
  // Dirty tracking for unsaved changes
  const [isDirty, setIsDirty] = useState(false);
  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
    altLabel?: string;
    onAlt?: () => void;
  }>({ open: false, title: "", message: "", onConfirm: () => {} });
  // Pending selection when dirty
  const pendingSelectRef = useRef<string | null | undefined>(undefined);

  const { registerHandler, unregisterHandler } = usePageEditor();
  const [editPaneMode, setEditPaneMode] = useState<"floating" | "static">("floating");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(() => {
    if (typeof window !== "undefined") {
      return (sessionStorage.getItem("vf_previewMode") as "desktop" | "mobile") || "desktop";
    }
    return "desktop";
  });
  const updatePreviewMode = (mode: "desktop" | "mobile") => {
    setPreviewMode(mode);
    sessionStorage.setItem("vf_previewMode", mode);
  };
  const [mobileIframeKey, setMobileIframeKey] = useState(0);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchPage = useCallback(async () => {
    const res = await fetch(`/api/pages/${pageId}`);
    if (res.ok) {
      const data = await res.json();
      setPage(data.page);
      setSections(data.page.sections || []);
    }
    setLoading(false);
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // Fetch site styles + editor preferences
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
        const mode = s.edit_pane_mode;
        if (mode === "floating" || mode === "static") setEditPaneMode(mode);
      })
      .catch(() => {});
  }, []);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    if (!over || active.id === over.id) return;

    // Check if dropped on a nest-{accordionId} droppable
    const overId = over.id as string;
    if (overId.startsWith("nest-")) {
      const accordionId = overId.replace("nest-", "");
      handleMoveToAccordion(active.id as string, accordionId);
      return;
    }

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newSections = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({
      ...s,
      sort_order: i,
    }));

    setSections(newSections);

    await fetch(`/api/pages/${pageId}/sections/reorder`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sections: newSections.map((s) => ({ id: s.id, sort_order: s.sort_order })),
      }),
    });

    toast.success("Sections reordered");
  };

  const handleToggleVisibility = async (section: Section) => {
    const updated = { ...section, is_visible: !section.is_visible };
    setSections((prev) => prev.map((s) => (s.id === section.id ? updated : s)));

    await fetch(`/api/pages/${pageId}/sections/${section.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: updated.is_visible }),
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    setConfirmModal({
      open: true,
      title: "Delete Section",
      message: "Are you sure you want to delete this section? This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        setSections((prev) => prev.filter((s) => s.id !== sectionId));
        if (selectedSectionId === sectionId) {
          setSelectedSectionId(null);
          setEditingData(null);
          setEditingSettings(null);
          setIsDirty(false);
        }
        await fetch(`/api/pages/${pageId}/sections/${sectionId}`, { method: "DELETE" });
        toast.success("Section deleted");
      },
    });
  };

  const handleDuplicateSection = async (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;

    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    const res = await fetch(`/api/pages/${pageId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section_type: section.section_type,
        data: section.data,
        settings: section.settings,
      }),
    });

    if (res.ok) {
      const { section: newSection } = await res.json();
      const newSections = [...sections];
      newSections.splice(sectionIndex + 1, 0, newSection);
      const reordered = newSections.map((s, i) => ({ ...s, sort_order: i }));
      setSections(reordered);
      setSelectedSectionId(newSection.id);

      await fetch(`/api/pages/${pageId}/sections/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: reordered.map((s) => ({ id: s.id, sort_order: s.sort_order })),
        }),
      });

      toast.success(`Duplicated ${SECTION_TYPE_LABELS[section.section_type as SectionType] || section.section_type}`);
    }
  };

  const handleAddSectionAtIndex = useCallback(async (type: SectionType, index?: number) => {
    const res = await fetch(`/api/pages/${pageId}/sections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section_type: type,
        data: SECTION_DEFAULTS[type],
      }),
    });

    if (res.ok) {
      const { section } = await res.json();

      if (index !== undefined && index < sections.length) {
        const newSections = [...sections];
        newSections.splice(index, 0, section);
        const reordered = newSections.map((s, i) => ({ ...s, sort_order: i }));
        setSections(reordered);
        setSelectedSectionId(section.id);

        await fetch(`/api/pages/${pageId}/sections/reorder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sections: reordered.map((s) => ({ id: s.id, sort_order: s.sort_order })),
          }),
        });
      } else {
        setSections((prev) => [...prev, section]);
        setSelectedSectionId(section.id);
      }

      toast.success(`Added ${SECTION_TYPE_LABELS[type]}`);
    }
  }, [pageId, sections]);

  // Register handler with context for sidebar ElementPalette
  useEffect(() => {
    registerHandler(handleAddSectionAtIndex);
    return () => unregisterHandler();
  }, [registerHandler, unregisterHandler, handleAddSectionAtIndex]);

  const handleSaveSection = async (sectionId: string, data: Record<string, unknown>, settings?: Record<string, unknown>) => {
    setSaving(true);
    const body: Record<string, unknown> = { data };
    if (settings) body.settings = settings;

    const res = await fetch(`/api/pages/${pageId}/sections/${sectionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const { section } = await res.json();
      setSections((prev) => prev.map((s) => (s.id === section.id ? section : s)));
      setIsDirty(false);
      setMobileIframeKey((k) => k + 1);
      toast.success("Saved");
    } else {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  // Handle real-time editing changes
  const handleEditorChange = useCallback((data: Record<string, unknown>, settings: Record<string, unknown>) => {
    setEditingData(data);
    setEditingSettings(settings);
    setIsDirty(true);
    // Push live update to mobile preview iframe
    if (selectedSectionId && mobileIframeRef.current?.contentWindow) {
      mobileIframeRef.current.contentWindow.postMessage({
        type: "preview-update-section",
        sectionId: selectedSectionId,
        data,
        settings,
      }, "*");
    }
  }, [selectedSectionId]);

  // Accordion groups on the page (for "move into accordion" feature)
  const accordionGroups = sections
    .filter((s) => s.section_type === "accordion_parent")
    .map((s) => ({ id: s.id, title: (s.data.title as string) || "Accordion Group" }));

  // Move a section into an accordion group
  const handleMoveToAccordion = (sectionId: string, accordionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const accordion = sections.find((s) => s.id === accordionId);
    if (!section || !accordion) return;

    const label = SECTION_TYPE_LABELS[section.section_type as SectionType] || section.section_type;
    const accTitle = (accordion.data.title as string) || "Accordion Group";

    setConfirmModal({
      open: true,
      title: "Move to Accordion",
      message: `Move "${label}" into "${accTitle}"?`,
      confirmLabel: "Move",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));

        const accChildren = (accordion.data.children as Array<Record<string, unknown>>) || [];
        const newChild = {
          title: (section.data.title as string) || (section.data.heading as string) || label,
          body: "",
          sectionType: section.section_type,
          sectionData: section.data,
          sectionSettings: section.settings,
        };
        const updatedAccordionData = { ...accordion.data, children: [...accChildren, newChild] };

        await fetch(`/api/pages/${pageId}/sections/${accordionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: updatedAccordionData }),
        });

        await fetch(`/api/pages/${pageId}/sections/${sectionId}`, { method: "DELETE" });

        setSections((prev) =>
          prev
            .map((s) => (s.id === accordionId ? { ...s, data: updatedAccordionData } : s))
            .filter((s) => s.id !== sectionId)
        );

        if (selectedSectionId === sectionId) {
          setSelectedSectionId(accordionId);
          setEditingData(null);
          setEditingSettings(null);
          setIsDirty(false);
        }

        toast.success(`Moved ${label} into accordion`);
      },
    });
  };

  // Ungroup: extract an accordion child back out as a standalone section
  const handleUngroupChild = (accordionId: string, childIndex: number) => {
    const accordion = sections.find((s) => s.id === accordionId);
    if (!accordion) return;
    const accChildren = (accordion.data.children as Array<Record<string, unknown>>) || [];
    const child = accChildren[childIndex];
    if (!child || !child.sectionType) return;

    const label = SECTION_TYPE_LABELS[child.sectionType as SectionType] || (child.sectionType as string);

    setConfirmModal({
      open: true,
      title: "Ungroup Section",
      message: `Extract "${child.title || label}" out of the accordion as a standalone section?`,
      confirmLabel: "Extract",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));

        const res = await fetch(`/api/pages/${pageId}/sections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section_type: child.sectionType,
            data: child.sectionData || {},
            settings: child.sectionSettings || {},
          }),
        });

        if (!res.ok) {
          toast.error("Failed to ungroup");
          return;
        }

        const { section: newSection } = await res.json();

        const updatedChildren = accChildren.filter((_, idx) => idx !== childIndex);
        const updatedAccordionData = { ...accordion.data, children: updatedChildren };

        await fetch(`/api/pages/${pageId}/sections/${accordionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: updatedAccordionData }),
        });

        setSections((prev) => {
          const accIdx = prev.findIndex((s) => s.id === accordionId);
          const updated = prev.map((s) => (s.id === accordionId ? { ...s, data: updatedAccordionData } : s));
          updated.splice(accIdx + 1, 0, newSection);
          return updated;
        });

        setSelectedSectionId(newSection.id);
        setEditingData(null);
        setEditingSettings(null);
        setIsDirty(false);
        toast.success(`Ungrouped ${label}`);
      },
    });
  };

  // Actually switch to a new section (no guard)
  const doSelectSection = useCallback((id: string | null) => {
    if (id !== null && id === selectedSectionId) {
      setSelectedSectionId(null);
    } else {
      setSelectedSectionId(id);
    }
    setEditingData(null);
    setEditingSettings(null);
    setIsDirty(false);
    setGlobalEditTarget(null);
  }, [selectedSectionId]);

  // Click-to-toggle with unsaved changes guard
  const handleSelectSection = useCallback((id: string | null) => {
    // If switching away from a dirty section, prompt
    if (isDirty && selectedSectionId && id !== selectedSectionId) {
      pendingSelectRef.current = id;
      setConfirmModal({
        open: true,
        title: "Unsaved Changes",
        message: "You have unsaved changes. Would you like to save before switching?",
        confirmLabel: "Save",
        altLabel: "Don\u2019t Save",
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, open: false }));
          // Save, then switch
          if (editingData) {
            handleSaveSection(selectedSectionId, editingData, editingSettings || undefined).then(() => {
              doSelectSection(pendingSelectRef.current ?? null);
            });
          }
        },
        onAlt: () => {
          setConfirmModal((prev) => ({ ...prev, open: false }));
          doSelectSection(pendingSelectRef.current ?? null);
        },
      });
      return;
    }
    doSelectSection(id);
  }, [selectedSectionId, isDirty, editingData, editingSettings, doSelectSection, handleSaveSection]);

  // Listen for clicks from the mobile preview iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "preview-select-section" && e.data.sectionId) {
        setGlobalEditTarget(null);
        handleSelectSection(e.data.sectionId);
      }
      if (e.data?.type === "preview-select-global" && e.data.target) {
        setSelectedSectionId(null);
        setEditingData(null);
        setEditingSettings(null);
        setGlobalEditTarget(e.data.target);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleSelectSection]);

  // Sync selected section highlight to iframe
  useEffect(() => {
    const iframeWin = mobileIframeRef.current?.contentWindow;
    if (!iframeWin) return;
    if (selectedSectionId) {
      iframeWin.postMessage({ type: "preview-select", sectionId: selectedSectionId }, "*");
    } else {
      iframeWin.postMessage({ type: "preview-deselect" }, "*");
    }
  }, [selectedSectionId]);

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>;
  }

  if (!page) {
    return <div className="text-center text-gray-400 py-12">Page not found</div>;
  }

  const isStatic = editPaneMode === "static" && (selectedSection || globalEditTarget);
  const publicBase = typeof window !== "undefined" && window.location.hostname.startsWith("admin.")
    ? `https://${window.location.hostname.replace("admin.", "")}`
    : "";

  return (
    <div className="flex gap-0 -m-3 md:-m-6 h-[calc(100vh-57px)]">
      {/* Center: Live preview */}
      <div className={`overflow-auto bg-white transition-all ${isStatic ? "flex-1 min-w-0" : "flex-1"}`}>
        {/* Page header bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-2 md:px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <h3 className="font-display font-bold text-sm text-charcoal truncate">
              {page.title}
            </h3>
            <span className="hidden sm:inline text-xs text-gray-400">{page.slug}</span>
            <span className={`hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              page.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {page.is_published ? "Published" : "Draft"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Desktop / Mobile preview toggle (hidden on phones) */}
            <div className="hidden md:flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => updatePreviewMode("desktop")}
                className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                  previewMode === "desktop"
                    ? "bg-teal/15 text-teal"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
                title="Desktop preview"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                </svg>
                Desktop
              </button>
              <button
                onClick={() => updatePreviewMode("mobile")}
                className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold transition-colors border-l border-gray-200 ${
                  previewMode === "mobile"
                    ? "bg-teal/15 text-teal"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
                title="Mobile preview (393px)"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                Mobile
              </button>
            </div>
            <a
              href={`${publicBase}${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="View public page"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>

        {/* Live editable sections — desktop mode */}
        {previewMode === "desktop" && (
        <div
          onDragEnter={(e) => {
            if (e.dataTransfer.types.includes("application/section-type")) {
              dragCounter.current++;
              setExternalDragActive(true);
            }
          }}
          onDragLeave={(e) => {
            if (e.dataTransfer.types.includes("application/section-type")) {
              dragCounter.current--;
              if (dragCounter.current <= 0) {
                dragCounter.current = 0;
                setExternalDragActive(false);
              }
            }
          }}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes("application/section-type")) {
              e.preventDefault();
            }
          }}
          onDrop={() => {
            dragCounter.current = 0;
            setExternalDragActive(false);
          }}
        >
          {sections.length === 0 ? (
            <div
              className={`text-center py-20 transition-all ${
                externalDragActive ? "bg-teal/5 border-2 border-dashed border-teal/40 mx-4 mt-4 rounded-xl" : ""
              }`}
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes("application/section-type")) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "copy";
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                const type = e.dataTransfer.getData("application/section-type") as SectionType;
                if (type) handleAddSectionAtIndex(type, 0);
              }}
            >
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-gray-400 text-sm mb-3">
                {externalDragActive ? "Drop element here" : "Drag an element from the sidebar to get started."}
              </p>
            </div>
          ) : (
            <div>
              <DropZone index={0} onDrop={handleAddSectionAtIndex} isActive={externalDragActive} />
              <DndContext
                sensors={sensors}
                collisionDetection={nestAwareCollision}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, idx) => {
                    const dragSection = activeDragId ? sections.find((s) => s.id === activeDragId) : null;
                    return (
                      <div key={section.id}>
                        <SortableLiveSection
                          section={section}
                          isSelected={selectedSectionId === section.id}
                          onSelect={() => handleSelectSection(section.id)}
                          onToggleVisibility={() => handleToggleVisibility(section)}
                          onDelete={() => handleDeleteSection(section.id)}
                          onDuplicate={() => handleDuplicateSection(section.id)}
                          onMoveToAccordion={handleMoveToAccordion}
                          accordionGroups={accordionGroups}
                          siteStyles={siteStyles}
                          editingData={selectedSectionId === section.id && editingData ? editingData : undefined}
                          editingSettings={selectedSectionId === section.id && editingSettings ? editingSettings : undefined}
                          activeDragId={activeDragId}
                          activeDragType={dragSection?.section_type || null}
                          previewMode={previewMode}
                        />
                        <DropZone index={idx + 1} onDrop={handleAddSectionAtIndex} isActive={externalDragActive} />
                      </div>
                    );
                  })}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
        )}

        {/* Mobile preview — real iframe at 393px viewport + section list (desktop only) */}
        {previewMode === "mobile" && (
          <div className="flex-1 hidden md:flex bg-gray-100 overflow-hidden">
            {/* Phone frame */}
            <div className="flex-1 flex items-start justify-center py-6 overflow-y-auto">
              <div className="flex flex-col items-center">
                <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                  <div className="flex justify-center mb-1">
                    <div className="w-20 h-4 bg-gray-800 rounded-full" />
                  </div>
                  <div className="rounded-[2rem] overflow-hidden bg-white" style={{ width: 393, height: 852 }}>
                    <iframe
                      ref={mobileIframeRef}
                      key={mobileIframeKey}
                      src={`/preview/${pageId}`}
                      className="border-0 w-full h-full"
                      title="Mobile preview"
                    />
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="w-28 h-1 bg-gray-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
            {/* Section list for editing */}
            <div className="w-56 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Sections</p>
              </div>
              <div className="py-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSelectSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      selectedSectionId === section.id
                        ? "bg-teal/10 text-teal font-semibold border-l-2 border-teal"
                        : "text-gray-600 hover:bg-gray-50 border-l-2 border-transparent"
                    }`}
                  >
                    {SECTION_TYPE_LABELS[section.section_type as SectionType] || section.section_type}
                  </button>
                ))}
              </div>
              <p className="px-3 py-2 text-[9px] text-gray-400">Save to refresh preview.</p>
            </div>
          </div>
        )}
      </div>

      {/* Editor panel — desktop: floating or static side column */}
      {selectedSection && (
        <div className={`hidden md:flex ${
          editPaneMode === "static"
            ? "w-96 flex-shrink-0 bg-white border-l border-gray-200 flex-col h-full"
            : "fixed top-[57px] right-0 bottom-0 w-96 z-40 bg-white border-l border-gray-200 shadow-2xl flex-col"
        }`}>
          <div className="flex-shrink-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between z-10">
            <h3 className="font-display font-semibold text-sm text-charcoal">
              {SECTION_TYPE_LABELS[selectedSection.section_type as SectionType]}
            </h3>
            <button
              onClick={() => handleSelectSection(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto admin-scrollbar">
            <SectionEditorPanel
              section={selectedSection}
              onSave={(data, settings) => handleSaveSection(selectedSection.id, data, settings)}
              saving={saving}
              isDirty={isDirty}
              onChange={handleEditorChange}
              stickyButtons
              onUngroupChild={handleUngroupChild}
              previewMode={previewMode}
            />
          </div>
        </div>
      )}

      {/* Editor panel — mobile: full-screen overlay */}
      {selectedSection && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-shrink-0 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-charcoal">
              {SECTION_TYPE_LABELS[selectedSection.section_type as SectionType]}
            </h3>
            <button
              onClick={() => handleSelectSection(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto admin-scrollbar" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            <SectionEditorPanel
              section={selectedSection}
              onSave={(data, settings) => handleSaveSection(selectedSection.id, data, settings)}
              saving={saving}
              isDirty={isDirty}
              onChange={handleEditorChange}
              stickyButtons
              onUngroupChild={handleUngroupChild}
              previewMode={previewMode}
            />
          </div>
        </div>
      )}

      {/* Global editor panel (navbar/footer) — desktop */}
      {globalEditTarget && !selectedSection && (
        <div className={`hidden md:flex ${
          editPaneMode === "static"
            ? "w-96 flex-shrink-0 bg-white border-l border-gray-200 flex-col h-full"
            : "fixed top-[57px] right-0 bottom-0 w-96 z-40 bg-white border-l border-gray-200 shadow-2xl flex-col"
        }`}>
          <div className="flex-shrink-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between z-10">
            <h3 className="font-display font-semibold text-sm text-charcoal">
              {globalEditTarget === "navbar" ? "Navbar Builder" : "Footer Builder"}
            </h3>
            <button
              onClick={() => setGlobalEditTarget(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto admin-scrollbar">
            {globalEditTarget === "navbar" ? (
              <NavbarBuilder onSave={() => {
                const iframe = mobileIframeRef.current;
                if (iframe) iframe.src = iframe.src;
              }} />
            ) : (
              <FooterBuilder onSave={() => {
                const iframe = mobileIframeRef.current;
                if (iframe) iframe.src = iframe.src;
              }} />
            )}
          </div>
        </div>
      )}

      {/* Global editor panel (navbar/footer) — mobile */}
      {globalEditTarget && !selectedSection && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-shrink-0 bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-charcoal">
              {globalEditTarget === "navbar" ? "Navbar Builder" : "Footer Builder"}
            </h3>
            <button
              onClick={() => setGlobalEditTarget(null)}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto admin-scrollbar" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
            {globalEditTarget === "navbar" ? (
              <NavbarBuilder onSave={() => {
                const iframe = mobileIframeRef.current;
                if (iframe) iframe.src = iframe.src;
              }} />
            ) : (
              <FooterBuilder onSave={() => {
                const iframe = mobileIframeRef.current;
                if (iframe) iframe.src = iframe.src;
              }} />
            )}
          </div>
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        destructive={confirmModal.destructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel || (() => setConfirmModal((prev) => ({ ...prev, open: false })))}
        altLabel={confirmModal.altLabel}
        onAlt={confirmModal.onAlt}
      />
    </div>
  );
}
