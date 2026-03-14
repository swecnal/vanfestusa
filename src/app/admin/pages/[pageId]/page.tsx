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
  onMoveToAccordion,
  accordionGroups,
  siteStyles,
  editingData,
  editingSettings,
  activeDragId,
  activeDragType,
}: {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
  onMoveToAccordion?: (sectionId: string, accordionId: string) => void;
  accordionGroups?: { id: string; title: string }[];
  siteStyles: SiteStyles;
  editingData?: Record<string, unknown>;
  editingSettings?: Record<string, unknown>;
  activeDragId?: string | null;
  activeDragType?: string | null;
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

  return (
    <div ref={setNodeRef} style={style} className="relative group/section">
      {/* Click target overlay - captures clicks without interfering with section rendering */}
      <div
        onClick={onSelect}
        className={`absolute inset-0 z-10 cursor-pointer transition-all ${
          isSelected
            ? "ring-2 ring-teal ring-inset shadow-lg shadow-teal/10"
            : "hover:ring-1 hover:ring-gray-400 hover:ring-inset"
        } ${!section.is_visible ? "bg-white/60" : ""}`}
      />

      {/* Section type label — appears on hover */}
      <div className={`absolute top-2 left-2 z-20 transition-opacity ${
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
      <div className={`absolute top-2 right-2 z-20 flex items-center gap-1 transition-opacity ${
        isSelected ? "opacity-100" : "opacity-0 group-hover/section:opacity-100"
      }`}>
        <button
          className="bg-charcoal text-white rounded-full p-1.5 shadow-lg cursor-grab active:cursor-grabbing"
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
          className={`rounded-full p-1.5 shadow-lg ${
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
        {/* Move to Accordion — only for non-accordion sections when accordions exist */}
        {accordionGroups && accordionGroups.length > 0 && section.section_type !== "accordion_parent" && (
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowAccordionMenu(!showAccordionMenu); }}
              className="bg-charcoal text-white rounded-full p-1.5 shadow-lg"
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
          className="bg-red-500 text-white rounded-full p-1.5 shadow-lg"
          title="Delete section"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Live section render */}
      <div className={!section.is_visible ? "opacity-30" : ""}>
        <SectionRenderer section={displaySection} siteStyles={siteStyles} />
      </div>

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

  const { registerHandler, unregisterHandler } = usePageEditor();
  const [editPaneMode, setEditPaneMode] = useState<"floating" | "static">("floating");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
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

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("Delete this section?")) return;

    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(null);
      setEditingData(null);
      setEditingSettings(null);
    }

    await fetch(`/api/pages/${pageId}/sections/${sectionId}`, {
      method: "DELETE",
    });

    toast.success("Section deleted");
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
  }, []);

  // Accordion groups on the page (for "move into accordion" feature)
  const accordionGroups = sections
    .filter((s) => s.section_type === "accordion_parent")
    .map((s) => ({ id: s.id, title: (s.data.title as string) || "Accordion Group" }));

  // Move a section into an accordion group
  const handleMoveToAccordion = async (sectionId: string, accordionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    const accordion = sections.find((s) => s.id === accordionId);
    if (!section || !accordion) return;

    const label = SECTION_TYPE_LABELS[section.section_type as SectionType] || section.section_type;
    if (!confirm(`Move "${label}" into "${(accordion.data.title as string) || "Accordion Group"}"?`)) return;

    // Add section as accordion child
    const accChildren = (accordion.data.children as Array<Record<string, unknown>>) || [];
    const newChild = {
      title: (section.data.title as string) || (section.data.heading as string) || label,
      body: "",
      sectionType: section.section_type,
      sectionData: section.data,
      sectionSettings: section.settings,
    };
    const updatedAccordionData = { ...accordion.data, children: [...accChildren, newChild] };

    // Save updated accordion
    await fetch(`/api/pages/${pageId}/sections/${accordionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: updatedAccordionData }),
    });

    // Delete the original section
    await fetch(`/api/pages/${pageId}/sections/${sectionId}`, { method: "DELETE" });

    // Update local state
    setSections((prev) =>
      prev
        .map((s) => (s.id === accordionId ? { ...s, data: updatedAccordionData } : s))
        .filter((s) => s.id !== sectionId)
    );

    if (selectedSectionId === sectionId) {
      setSelectedSectionId(accordionId);
      setEditingData(null);
      setEditingSettings(null);
    }

    toast.success(`Moved ${label} into accordion`);
  };

  // Click-to-toggle: clicking the same section deselects it, clicking a different one switches
  const handleSelectSection = useCallback((id: string | null) => {
    if (id !== null && id === selectedSectionId) {
      setSelectedSectionId(null);
    } else {
      setSelectedSectionId(id);
    }
    setEditingData(null);
    setEditingSettings(null);
  }, [selectedSectionId]);

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>;
  }

  if (!page) {
    return <div className="text-center text-gray-400 py-12">Page not found</div>;
  }

  const isStatic = editPaneMode === "static" && selectedSection;

  return (
    <div className="flex gap-0 -m-6 h-[calc(100vh-57px)]">
      {/* Center: Live preview */}
      <div className={`overflow-auto bg-white transition-all ${isStatic ? "flex-1 min-w-0" : "flex-1"}`}>
        {/* Page header bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-bold text-sm text-charcoal">
              {page.title}
            </h3>
            <span className="text-xs text-gray-400">{page.slug}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              page.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
            }`}>
              {page.is_published ? "Published" : "Draft"}
            </span>
          </div>
          <a
            href={page.slug}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Preview page"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>

        {/* Live sections */}
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
                          onMoveToAccordion={handleMoveToAccordion}
                          accordionGroups={accordionGroups}
                          siteStyles={siteStyles}
                          editingData={selectedSectionId === section.id && editingData ? editingData : undefined}
                          editingSettings={selectedSectionId === section.id && editingSettings ? editingSettings : undefined}
                          activeDragId={activeDragId}
                          activeDragType={dragSection?.section_type || null}
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
      </div>

      {/* Editor panel — floating (overlay) or static (side column) */}
      {selectedSection && (
        <div className={
          editPaneMode === "static"
            ? "w-96 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col h-full"
            : "fixed top-[57px] right-0 bottom-0 w-96 z-40 bg-white border-l border-gray-200 shadow-2xl flex flex-col"
        }>
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
              onChange={handleEditorChange}
              stickyButtons
            />
          </div>
        </div>
      )}
    </div>
  );
}
