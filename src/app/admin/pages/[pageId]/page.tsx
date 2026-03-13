"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
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

function SortableItem({
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
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "bg-teal/10 border border-teal/30" : "hover:bg-gray-100 border border-transparent"
      }`}
      onClick={onSelect}
    >
      {/* Drag handle */}
      <button
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
        {...attributes}
        {...listeners}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm8-12a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>

      {/* Section info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-charcoal truncate">
          {SECTION_TYPE_LABELS[section.section_type as SectionType] || section.section_type}
        </p>
      </div>

      {/* Visibility toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
        className={`p-1 rounded transition-colors ${
          section.is_visible ? "text-gray-400 hover:text-gray-600" : "text-red-300"
        }`}
        title={section.is_visible ? "Visible" : "Hidden"}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {section.is_visible ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          )}
        </svg>
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-1 text-gray-300 hover:text-red-500 rounded transition-colors"
        title="Delete section"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

const ALL_SECTION_TYPES: SectionType[] = [
  "hero_carousel", "hero_simple", "text_block", "two_column_cards",
  "feature_grid", "event_cards", "cta_cards", "cta_section",
  "faq_accordion", "schedule_accordion", "sponsor_tiers", "sponsor_marquee",
  "image_carousel", "photo_strip", "image_gallery", "wave_divider",
  "vehicle_convoy", "vehicle_stream", "contact_form", "html_block",
];

export default function PageEditorPage() {
  const params = useParams();
  const pageId = params.pageId as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPalette, setShowPalette] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const handleAddSection = async (type: SectionType) => {
    setShowPalette(false);

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
      setSections((prev) => [...prev, section]);
      setSelectedSectionId(section.id);
      toast.success(`Added ${SECTION_TYPE_LABELS[type]}`);
    }
  };

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
      {/* Left panel: Section list */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-display font-bold text-sm text-charcoal truncate">
            {page.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{page.slug}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableItem
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onSelect={() => setSelectedSectionId(section.id)}
                  onToggleVisibility={() => handleToggleVisibility(section)}
                  onDelete={() => handleDeleteSection(section.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => setShowPalette(!showPalette)}
            className="w-full bg-teal hover:bg-teal-dark text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Section
          </button>
        </div>
      </div>

      {/* Center: Preview or palette */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        {showPalette ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-lg text-charcoal">
                Add Section
              </h3>
              <button
                onClick={() => setShowPalette(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {ALL_SECTION_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => handleAddSection(type)}
                  className="bg-white rounded-xl p-4 border border-gray-200 hover:border-teal hover:shadow-md transition-all text-left group"
                >
                  <div className="w-8 h-8 bg-teal/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-teal/20 transition-colors">
                    <svg className="w-4 h-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </div>
                  <p className="font-display font-semibold text-xs text-charcoal">
                    {SECTION_TYPE_LABELS[type]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-400 text-sm">
                {sections.length === 0
                  ? "No sections yet. Click 'Add Section' to get started."
                  : "Select a section from the left panel to edit it, or drag to reorder."}
              </p>
              {page.slug && (
                <a
                  href={page.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-4 text-teal hover:text-teal-dark text-sm font-semibold transition-colors"
                >
                  Preview Page
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
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
