"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { usePageEditor } from "@/lib/page-editor-context";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Section, SectionType } from "@/lib/types";
import { SECTION_TYPE_LABELS } from "@/lib/types";
import { SECTION_DEFAULTS } from "@/lib/section-defaults";
import SectionEditorPanel from "@/components/admin/SectionEditorPanel";

interface PageData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_published: boolean;
  sections: Section[];
}

/* ─── Visual Section Preview Card ─── */
function SectionPreview({
  section,
  isSelected,
  onSelect,
}: {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const d = section.data as Record<string, unknown>;
  const type = section.section_type;

  const renderPreviewContent = () => {
    switch (type) {
      case "hero_carousel":
      case "hero_simple": {
        const bgImage = d.bgImage as string;
        const slides = d.slides as Array<Record<string, unknown>> | undefined;
        const firstSlide = slides?.[0];
        return (
          <div
            className="relative h-40 rounded-lg overflow-hidden flex items-center justify-center"
            style={{
              background: bgImage
                ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage}) center/cover`
                : "linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%)",
            }}
          >
            <div className="text-center px-4">
              <p className="text-white font-display font-bold text-lg leading-tight">
                {(d.title as string) || (firstSlide?.title as string) || "Hero Section"}
              </p>
              {((d.subtitle as string) || (firstSlide?.subtitle as string)) && (
                <p className="text-white/70 text-xs mt-1">
                  {(d.subtitle as string) || (firstSlide?.subtitle as string)}
                </p>
              )}
            </div>
          </div>
        );
      }

      case "text_block": {
        const html = d.html as string;
        return (
          <div className="p-4 bg-white rounded-lg">
            <div
              className="prose prose-sm max-w-none line-clamp-4 text-xs text-gray-600"
              dangerouslySetInnerHTML={{ __html: html || "<p>Text content...</p>" }}
            />
          </div>
        );
      }

      case "feature_grid": {
        const items = (d.items as Array<Record<string, string>>) || [];
        const cols = (d.columns as number) || 3;
        return (
          <div className={`grid gap-2 p-3 ${cols === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
            {items.slice(0, 6).map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="w-6 h-6 bg-teal/10 rounded-full mx-auto mb-1" />
                <p className="text-[10px] font-semibold text-charcoal truncate">{item.title}</p>
              </div>
            ))}
          </div>
        );
      }

      case "event_cards": {
        const cards = (d.cards as Array<Record<string, unknown>>) || [];
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {cards.slice(0, 2).map((card, i) => (
              <div
                key={i}
                className="rounded-lg h-20 flex items-end p-2 overflow-hidden"
                style={{
                  background: (card.gradient as string) || "linear-gradient(135deg, #1CA288 0%, #0d6b5c 100%)",
                }}
              >
                <p className="text-white text-xs font-bold truncate">{card.title as string}</p>
              </div>
            ))}
          </div>
        );
      }

      case "faq_accordion": {
        const items = (d.items as Array<Record<string, string>>) || [];
        return (
          <div className="p-3 space-y-1">
            {items.slice(0, 4).map((item, i) => (
              <div key={i} className="bg-gray-50 rounded px-3 py-2 flex items-center gap-2">
                <svg className="w-3 h-3 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <p className="text-[11px] text-charcoal truncate">{item.question}</p>
              </div>
            ))}
            {items.length > 4 && (
              <p className="text-[10px] text-gray-400 text-center">+{items.length - 4} more</p>
            )}
          </div>
        );
      }

      case "cta_section": {
        return (
          <div className="p-6 text-center rounded-lg" style={{ background: "linear-gradient(135deg, #1CA288, #0d6b5c)" }}>
            <p className="text-white font-display font-bold text-sm">{(d.title as string) || "Call to Action"}</p>
            {(d.subtitle as string) && <p className="text-white/70 text-xs mt-1">{d.subtitle as string}</p>}
          </div>
        );
      }

      case "sponsor_marquee":
      case "sponsor_list":
      case "sponsor_tiers": {
        return (
          <div className="p-4 text-center bg-gray-50 rounded-lg">
            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg" />
              ))}
            </div>
            <p className="text-[10px] text-gray-400">Sponsors</p>
          </div>
        );
      }

      case "image_carousel":
      case "photo_strip":
      case "image_gallery": {
        const images = (d.images as Array<Record<string, string>>) || [];
        return (
          <div className="flex gap-1 p-2 overflow-hidden rounded-lg bg-gray-50">
            {(images.length > 0 ? images.slice(0, 4) : [{}, {}, {}, {}]).map((img, i) => (
              <div key={i} className="flex-1 h-16 bg-gray-200 rounded overflow-hidden">
                {img.src && (
                  <img src={img.src} alt="" className="w-full h-full object-cover" />
                )}
              </div>
            ))}
          </div>
        );
      }

      case "wave_divider": {
        return (
          <div className="h-12 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0" style={{ background: (d.fromColor as string) || "white" }} />
            <svg viewBox="0 0 1440 100" className="absolute bottom-0 w-full">
              <path
                d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z"
                fill={(d.toColor as string) || "#1a1a1a"}
              />
            </svg>
          </div>
        );
      }

      case "contact_form": {
        return (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-2/3" />
              <div className="h-6 bg-gray-200 rounded" />
              <div className="h-16 bg-gray-200 rounded" />
              <div className="h-8 bg-teal rounded w-24" />
            </div>
          </div>
        );
      }

      case "two_column_cards":
      case "cta_cards": {
        const cards = (d.cards as Array<Record<string, string>>) || [];
        return (
          <div className="grid grid-cols-2 gap-2 p-3">
            {(cards.length > 0 ? cards.slice(0, 2) : [{ title: "Card 1" }, { title: "Card 2" }]).map((card, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3">
                <p className="text-[11px] font-semibold text-charcoal truncate">{card.title || `Card ${i + 1}`}</p>
                {card.description && (
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{card.description}</p>
                )}
              </div>
            ))}
          </div>
        );
      }

      case "schedule_accordion": {
        const days = (d.days as Array<Record<string, unknown>>) || [];
        return (
          <div className="p-3 space-y-1">
            {days.slice(0, 3).map((day, i) => (
              <div key={i} className="bg-gray-50 rounded px-3 py-2">
                <p className="text-[11px] font-semibold text-charcoal">{(day.label as string) || `Day ${i + 1}`}</p>
              </div>
            ))}
          </div>
        );
      }

      default: {
        return (
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-400">{SECTION_TYPE_LABELS[type as SectionType] || type}</p>
          </div>
        );
      }
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
        isSelected
          ? "border-teal shadow-lg shadow-teal/10"
          : "border-transparent hover:border-gray-300"
      } ${!section.is_visible ? "opacity-40" : ""}`}
    >
      {/* Section type label */}
      <div className={`flex items-center justify-between px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold ${
        isSelected ? "bg-teal text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
      }`}>
        <span>{SECTION_TYPE_LABELS[type as SectionType] || type}</span>
        {!section.is_visible && (
          <span className="text-[9px] normal-case tracking-normal font-normal">Hidden</span>
        )}
      </div>

      {/* Preview content */}
      <div className="bg-white">
        {renderPreviewContent()}
      </div>
    </div>
  );
}

/* ─── Drag handle for reorder mode ─── */
function SortablePreviewItem({
  section,
  isSelected,
  onSelect,
  onToggleVisibility,
  onDelete,
}: {
  section: Section;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/sort">
      {/* Floating action bar */}
      <div className="absolute -top-3 right-2 z-10 flex items-center gap-1 opacity-0 group-hover/sort:opacity-100 transition-opacity">
        <button
          className="bg-charcoal text-white rounded-full p-1.5 shadow-lg cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
          {...attributes}
          {...listeners}
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

      <SectionPreview
        section={section}
        isSelected={isSelected}
        onSelect={onSelect}
      />
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
          ? "h-14 bg-teal/10 border-2 border-dashed border-teal/50 mx-0"
          : "h-6 mx-4"
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
  const dragCounter = useRef(0);

  const { registerHandler, unregisterHandler } = usePageEditor();

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

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
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
    if (selectedSectionId === sectionId) setSelectedSectionId(null);

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
        // Insert at specific index and reorder
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
        // Append to end
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

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>;
  }

  if (!page) {
    return <div className="text-center text-gray-400 py-12">Page not found</div>;
  }

  return (
    <div className="flex gap-0 -m-6 h-[calc(100vh-57px)]">
      {/* Center: Visual preview */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        {/* Page header bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
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

        {/* Visual sections */}
        <div
          className="p-4 max-w-4xl mx-auto"
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
              className={`text-center py-20 rounded-xl transition-all ${
                externalDragActive ? "bg-teal/5 border-2 border-dashed border-teal/40" : ""
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
            <div className="space-y-0">
              <DropZone index={0} onDrop={handleAddSectionAtIndex} isActive={externalDragActive} />
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section, idx) => (
                    <div key={section.id}>
                      <SortablePreviewItem
                        section={section}
                        isSelected={selectedSectionId === section.id}
                        onSelect={() => setSelectedSectionId(section.id)}
                        onToggleVisibility={() => handleToggleVisibility(section)}
                        onDelete={() => handleDeleteSection(section.id)}
                      />
                      <DropZone index={idx + 1} onDrop={handleAddSectionAtIndex} isActive={externalDragActive} />
                    </div>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Section editor */}
      {selectedSection && (
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-semibold text-sm text-charcoal">
              {SECTION_TYPE_LABELS[selectedSection.section_type as SectionType]}
            </h3>
            <button
              onClick={() => setSelectedSectionId(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <SectionEditorPanel
            section={selectedSection}
            onSave={(data, settings) => handleSaveSection(selectedSection.id, data, settings)}
            saving={saving}
          />
        </div>
      )}
    </div>
  );
}
