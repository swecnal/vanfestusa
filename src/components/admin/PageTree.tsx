"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";

interface PageItem {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  section_count: number;
}

interface TreeNode {
  label: string;
  page?: PageItem;
  children: TreeNode[];
  expanded: boolean;
  parentSlug: string;
}

/* ─── In-app modal for creating / duplicating pages ─── */
function NewPageModal({
  parentSlug,
  sourcePageId,
  onClose,
  onCreated,
}: {
  parentSlug: string;
  sourcePageId?: string;
  onClose: () => void;
  onCreated: (pageId: string) => void;
}) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const slug = parentSlug === "/"
    ? `/${name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`
    : `${parentSlug}/${name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      // Create the page
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title: name.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        const newPageId = data.page.id;

        // If duplicating, copy all sections from the source page
        if (sourcePageId) {
          try {
            const srcRes = await fetch(`/api/pages/${sourcePageId}/sections`);
            if (srcRes.ok) {
              const { sections } = await srcRes.json();
              for (const sec of sections || []) {
                await fetch(`/api/pages/${newPageId}/sections`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    section_type: sec.section_type,
                    data: sec.data,
                    settings: sec.settings,
                    sort_order: sec.sort_order,
                    is_visible: sec.is_visible,
                  }),
                });
              }
            }
          } catch {
            // Sections copy failed, page still created
          }
          toast.success(`Duplicated as "${name.trim()}"`);
        } else {
          toast.success(`Page "${name.trim()}" created`);
        }

        onCreated(newPageId);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to create page");
      }
    } catch {
      toast.error("Failed to create page");
    }
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-xl shadow-2xl p-5 w-80 space-y-3"
      >
        <h3 className="text-sm font-semibold text-charcoal">{sourcePageId ? "Duplicate Page" : "New Page"}</h3>
        <div>
          <label className="block text-[11px] text-gray-500 mb-1">Page Name</label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-teal focus:border-teal outline-none"
            placeholder="e.g. About Us"
          />
        </div>
        {name.trim() && (
          <p className="text-[11px] text-gray-400">
            Slug: <code className="bg-gray-100 px-1 rounded text-gray-700">{slug}</code>
          </p>
        )}
        <div className="flex gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || creating}
            className="px-4 py-1.5 text-xs font-semibold bg-teal text-white rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            {creating ? (sourcePageId ? "Duplicating..." : "Creating...") : (sourcePageId ? "Duplicate" : "Create")}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Tree builder ─── */
function buildTree(pages: PageItem[], orderMap: Record<string, string[]>): TreeNode {
  const root: TreeNode = {
    label: "vanfestusa.com",
    children: [],
    expanded: true,
    parentSlug: "",
  };

  const sorted = [...pages].sort((a, b) => a.slug.localeCompare(b.slug));

  for (const page of sorted) {
    const parts = page.slug.split("/").filter(Boolean);

    if (parts.length === 0) {
      root.page = page;
      continue;
    }

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const parentPath = "/" + parts.slice(0, i).join("/");
      let child = current.children.find(
        (c) =>
          c.label.toLowerCase().replace(/\s+/g, "-") === part ||
          c.page?.slug === "/" + parts.slice(0, i + 1).join("/")
      );

      if (!child) {
        child = {
          label: part
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          children: [],
          expanded: true,
          parentSlug: parentPath,
        };
        current.children.push(child);
      }

      if (i === parts.length - 1) {
        child.page = page;
        child.label = page.title;
      }

      current = child;
    }
  }

  // Apply stored order
  function applyOrder(node: TreeNode) {
    const key = node.parentSlug || "/";
    const order = orderMap[key];
    if (order && order.length > 0) {
      node.children.sort((a, b) => {
        const aId = a.page?.id || "";
        const bId = b.page?.id || "";
        const aIdx = order.indexOf(aId);
        const bIdx = order.indexOf(bId);
        if (aIdx === -1 && bIdx === -1) return 0;
        if (aIdx === -1) return 1;
        if (bIdx === -1) return -1;
        return aIdx - bIdx;
      });
    }
    node.children.forEach(applyOrder);
  }
  applyOrder(root);

  return root;
}

/* ─── Sortable tree item ─── */
function SortableTreeItem({
  node,
  depth,
  activePageId,
  onSelect,
  onAddChild,
  addMenuFor,
  onNewPage,
  onDuplicatePage,
  onCloseMenu,
  activeDragId,
  nestTargetId,
}: {
  node: TreeNode;
  depth: number;
  activePageId: string | null;
  onSelect: (pageId: string) => void;
  onAddChild: (parentSlug: string, pageId: string) => void;
  addMenuFor: { slug: string; pageId: string } | null;
  onNewPage: (parentSlug: string) => void;
  onDuplicatePage: (parentSlug: string, sourcePageId: string) => void;
  onCloseMenu: () => void;
  activeDragId: string | null;
  nestTargetId: string | null;
}) {
  const [expanded, setExpanded] = useState(node.expanded);
  const hasChildren = node.children.length > 0;
  const isActive = node.page?.id === activePageId;
  const itemId = node.page?.id || `folder-${node.label}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId, disabled: !node.page });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Show nest indicator when this item is the hover-to-nest target
  const showNestIndicator = nestTargetId === node.page?.id;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        data-page-id={node.page?.id || ""}
        className={`flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors group relative ${
          showNestIndicator
            ? "bg-teal/20 text-white ring-1 ring-teal/40"
            : isActive
              ? "bg-teal/20 text-white"
              : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (node.page) onSelect(node.page.id);
          if (hasChildren && depth > 0) setExpanded(!expanded);
        }}
      >
        {/* Drag handle */}
        {node.page && (
          <span
            className="w-4 h-4 flex-shrink-0 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-60 transition-opacity"
            {...attributes}
            {...listeners}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm-4 8a2 2 0 104 0 2 2 0 00-4 0zm12-14a2 2 0 11-4 0 2 2 0 014 0zm-4 6a2 2 0 104 0 2 2 0 00-4 0zm0 8a2 2 0 104 0 2 2 0 00-4 0z" />
            </svg>
          </span>
        )}

        {/* Expand/collapse chevron */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="w-4 h-4 flex-shrink-0 flex items-center justify-center"
          >
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <span className="w-4 flex-shrink-0" />
        )}

        {/* Icon */}
        {depth === 0 ? (
          <svg className="w-4 h-4 flex-shrink-0 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
          </svg>
        ) : hasChildren ? (
          <svg className="w-4 h-4 flex-shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 flex-shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        )}

        {/* Label */}
        <span className="text-xs truncate flex-1">{node.label}</span>

        {/* Add child page button — muted until hover */}
        {node.page && (
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.page!.slug, node.page!.id);
              }}
              className="w-4 h-4 flex items-center justify-center rounded opacity-20 group-hover:opacity-80 hover:!opacity-100 hover:bg-teal/30 transition-all"
              title={`Add sub-page under ${node.label}`}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            {addMenuFor?.pageId === node.page.id && (
              <div className="absolute right-0 top-5 z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-36 text-gray-700">
                <button
                  onClick={(e) => { e.stopPropagation(); onCloseMenu(); onNewPage(node.page!.slug); }}
                  className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-gray-100 transition-colors"
                >
                  New Page
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onCloseMenu(); onDuplicatePage(node.page!.slug, node.page!.id); }}
                  className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-gray-100 transition-colors"
                >
                  Duplicate Page
                </button>
              </div>
            )}
          </div>
        )}

        {/* Published indicator */}
        {node.page && (
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              node.page.is_published ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        )}
      </div>

      {/* Nest indicator line — shown when hovering over this item for 300ms during a drag */}
      {showNestIndicator && (
        <div className="ml-8 mr-2 h-0.5 bg-purple-400 rounded-full my-0.5" />
      )}

      {/* Children */}
      {expanded && hasChildren && (
        <SortableChildren
          nodes={node.children}
          depth={depth + 1}
          activePageId={activePageId}
          onSelect={onSelect}
          onAddChild={onAddChild}
          addMenuFor={addMenuFor}
          onNewPage={onNewPage}
          onDuplicatePage={onDuplicatePage}
          onCloseMenu={onCloseMenu}
          activeDragId={activeDragId}
          nestTargetId={nestTargetId}
        />
      )}
    </div>
  );
}

function SortableChildren({
  nodes,
  depth,
  activePageId,
  onSelect,
  onAddChild,
  addMenuFor,
  onNewPage,
  onDuplicatePage,
  onCloseMenu,
  activeDragId,
  nestTargetId,
}: {
  nodes: TreeNode[];
  depth: number;
  activePageId: string | null;
  onSelect: (pageId: string) => void;
  onAddChild: (parentSlug: string, pageId: string) => void;
  addMenuFor: { slug: string; pageId: string } | null;
  onNewPage: (parentSlug: string) => void;
  onDuplicatePage: (parentSlug: string, sourcePageId: string) => void;
  onCloseMenu: () => void;
  activeDragId: string | null;
  nestTargetId: string | null;
}) {
  const ids = nodes.map((n) => n.page?.id || `folder-${n.label}`);

  return (
    <SortableContext items={ids} strategy={verticalListSortingStrategy}>
      <div>
        {nodes.map((child, i) => (
          <SortableTreeItem
            key={child.page?.id || `${depth}-${i}`}
            node={child}
            depth={depth}
            activePageId={activePageId}
            onSelect={onSelect}
            onAddChild={onAddChild}
            addMenuFor={addMenuFor}
            onNewPage={onNewPage}
            onDuplicatePage={onDuplicatePage}
            onCloseMenu={onCloseMenu}
            activeDragId={activeDragId}
            nestTargetId={nestTargetId}
          />
        ))}
      </div>
    </SortableContext>
  );
}

/* ─── Main component ─── */
export default function PageTree({ collapsed }: { collapsed: boolean }) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderMap, setOrderMap] = useState<Record<string, string[]>>({});
  const [newPageParent, setNewPageParent] = useState<string | null>(null);
  const [newPageSource, setNewPageSource] = useState<string | undefined>(undefined);
  const [addMenuFor, setAddMenuFor] = useState<{ slug: string; pageId: string } | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [nestTargetId, setNestTargetId] = useState<string | null>(null);
  const [dropIntent, setDropIntent] = useState<{ type: "reorder" | "nest"; targetTitle?: string } | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const router = useRouter();
  const pathname = usePathname();

  const activePageId =
    pathname.match(/\/admin\/pages\/([^/]+)/)?.[1] || null;

  // Close add menu on click outside
  useEffect(() => {
    if (!addMenuFor) return;
    const handler = () => setAddMenuFor(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [addMenuFor]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fetchPages = useCallback(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => setPages(data.pages || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchOrder = useCallback(() => {
    fetch("/api/global-settings")
      .then((r) => r.json())
      .then((data) => {
        const settings = data.settings || {};
        if (settings.page_order) {
          setOrderMap(settings.page_order as Record<string, string[]>);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchPages();
    fetchOrder();
  }, [fetchPages, fetchOrder]);

  // Track pointer position during drag for zone detection
  useEffect(() => {
    if (!activeDragId) return;
    const handler = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", handler);
    return () => window.removeEventListener("pointermove", handler);
  }, [activeDragId]);

  // Listen for page-tree-refresh events (e.g. after page deletion)
  useEffect(() => {
    const handler = () => fetchPages();
    window.addEventListener("page-tree-refresh", handler);
    return () => window.removeEventListener("page-tree-refresh", handler);
  }, [fetchPages]);

  const saveOrder = useCallback(
    async (newOrder: Record<string, string[]>) => {
      setOrderMap(newOrder);
      try {
        await fetch("/api/global-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page_order: newOrder }),
        });
      } catch {
        // silently fail
      }
    },
    []
  );

  const tree = buildTree(pages, orderMap);

  const handleSelect = (pageId: string) => {
    router.push(`/admin/pages/${pageId}`);
  };

  const handleAddChild = (parentSlug: string, pageId: string) => {
    setAddMenuFor({ slug: parentSlug, pageId });
  };

  const handlePageCreated = (pageId: string) => {
    setNewPageParent(null);
    setNewPageSource(undefined);
    fetchPages();
    router.push(`/admin/pages/${pageId}`);
  };

  // Cross-parent move: move a page (and its children) to a different parent level
  const handleMoveToLevel = useCallback(async (draggedPageId: string, newParentSlug: string, insertNearId?: string) => {
    const draggedPage = pages.find((p) => p.id === draggedPageId);
    if (!draggedPage) return;

    const currentParent = getParentSlug(draggedPage.slug);
    if (currentParent === newParentSlug) return;

    const lastPart = draggedPage.slug.split("/").filter(Boolean).pop();
    if (!lastPart) return;

    const newSlug = newParentSlug === "/" ? `/${lastPart}` : `${newParentSlug}/${lastPart}`;
    const childPages = pages.filter(
      (p) => p.id !== draggedPage.id && p.slug.startsWith(draggedPage.slug + "/")
    );

    try {
      const res = await fetch(`/api/pages/${draggedPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: newSlug }),
      });
      if (res.ok) {
        await fetch("/api/slug-migrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldSlug: draggedPage.slug, newSlug }),
        });

        for (const child of childPages) {
          const childNewSlug = child.slug.replace(draggedPage.slug, newSlug);
          await fetch(`/api/pages/${child.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: childNewSlug }),
          });
          await fetch("/api/slug-migrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldSlug: child.slug, newSlug: childNewSlug }),
          });
        }

        // Update order: insert near the target in the new parent
        const parentKey = newParentSlug === "/" ? "/" : newParentSlug;
        const newSiblingIds = pages
          .filter((p) => getParentSlug(p.slug) === newParentSlug && p.slug !== "/" && p.id !== draggedPage.id)
          .map((p) => p.id);
        if (insertNearId) {
          const targetIdx = newSiblingIds.indexOf(insertNearId);
          if (targetIdx !== -1) {
            newSiblingIds.splice(targetIdx + 1, 0, draggedPage.id);
          } else {
            newSiblingIds.push(draggedPage.id);
          }
        } else {
          newSiblingIds.push(draggedPage.id);
        }
        const oldParentKey = currentParent === "/" ? "/" : currentParent;
        const oldOrder = (orderMap[oldParentKey] || []).filter((id) => id !== draggedPage.id);
        saveOrder({ ...orderMap, [parentKey]: newSiblingIds, [oldParentKey]: oldOrder });

        const parentPage = pages.find((p) => p.slug === newParentSlug);
        toast.success(`Moved "${draggedPage.title}" to ${newParentSlug === "/" ? "top level" : `under "${parentPage?.title}"`}`);
        window.dispatchEvent(new CustomEvent("page-slug-changed", {
          detail: { pageId: draggedPage.id, oldSlug: draggedPage.slug, newSlug },
        }));
        for (const child of childPages) {
          window.dispatchEvent(new CustomEvent("page-slug-changed", {
            detail: { pageId: child.id, oldSlug: child.slug, newSlug: child.slug.replace(draggedPage.slug, newSlug) },
          }));
        }
        window.dispatchEvent(new CustomEvent("navbar-data-changed"));
        fetchPages();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to move page");
      }
    } catch {
      toast.error("Failed to move page");
    }
  }, [pages, orderMap, saveOrder, fetchPages]);

  // Nesting: move a page under another by updating its slug + slug migration
  const handleNestUnder = useCallback(async (draggedPageId: string, targetPageId: string) => {
    const draggedPage = pages.find((p) => p.id === draggedPageId);
    const targetPage = pages.find((p) => p.id === targetPageId);
    if (!draggedPage || !targetPage) return;

    // Don't nest under self or if already nested there
    if (draggedPage.id === targetPage.id) return;
    const currentParent = getParentSlug(draggedPage.slug);
    if (currentParent === targetPage.slug) return;

    // Build new slug: targetSlug + last part of dragged slug
    const lastPart = draggedPage.slug.split("/").filter(Boolean).pop();
    if (!lastPart) return;
    const newSlug = `${targetPage.slug}/${lastPart}`;

    // Find all child pages whose slugs need updating (pages nested under dragged page)
    const childPages = pages.filter(
      (p) => p.id !== draggedPage.id && p.slug.startsWith(draggedPage.slug + "/")
    );

    try {
      const res = await fetch(`/api/pages/${draggedPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: newSlug }),
      });
      if (res.ok) {
        // Migrate sections referencing the old slug
        await fetch("/api/slug-migrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oldSlug: draggedPage.slug, newSlug }),
        });

        // Recursively update child page slugs and migrate each
        for (const child of childPages) {
          const childOldSlug = child.slug;
          const childNewSlug = child.slug.replace(draggedPage.slug, newSlug);
          await fetch(`/api/pages/${child.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: childNewSlug }),
          });
          await fetch("/api/slug-migrate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oldSlug: childOldSlug, newSlug: childNewSlug }),
          });
        }

        toast.success(`Moved "${draggedPage.title}" under "${targetPage.title}"`);
        // Notify open page editors that slugs changed
        window.dispatchEvent(new CustomEvent("page-slug-changed", {
          detail: { pageId: draggedPage.id, oldSlug: draggedPage.slug, newSlug },
        }));
        for (const child of childPages) {
          window.dispatchEvent(new CustomEvent("page-slug-changed", {
            detail: { pageId: child.id, oldSlug: child.slug, newSlug: child.slug.replace(draggedPage.slug, newSlug) },
          }));
        }
        // Notify navbar manager to refetch if open
        window.dispatchEvent(new CustomEvent("navbar-data-changed"));
        fetchPages();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to move page");
      }
    } catch {
      toast.error("Failed to move page");
    }
  }, [pages, fetchPages]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragOver = () => {
    const { x, y } = pointerRef.current;
    if (!x && !y) { setNestTargetId(null); setDropIntent(null); return; }

    // Find which page row the cursor is physically over (ignores sortable animation shifts)
    const els = document.elementsFromPoint(x, y);
    const rowEl = els.find((el) => {
      const pid = el.getAttribute("data-page-id");
      return pid && pid !== activeDragId;
    });

    if (!rowEl) {
      setNestTargetId(null);
      setDropIntent(null);
      return;
    }

    const pageId = rowEl.getAttribute("data-page-id")!;
    const rect = rowEl.getBoundingClientRect();
    const relativeY = (y - rect.top) / rect.height;

    if (relativeY > 0.25 && relativeY < 0.75) {
      // Center zone → nest
      const targetPage = pages.find((p) => p.id === pageId);
      setNestTargetId(pageId);
      setDropIntent({ type: "nest", targetTitle: targetPage?.title || "page" });
    } else {
      // Edge zone → reorder
      setNestTargetId(null);
      setDropIntent({ type: "reorder" });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const currentNestTarget = nestTargetId;
    setActiveDragId(null);
    setNestTargetId(null);
    setDropIntent(null);

    if (!over || active.id === over.id) return;

    const activeId = String(active.id);

    // If nest target is set, perform nesting
    if (currentNestTarget) {
      handleNestUnder(activeId, currentNestTarget);
      return;
    }

    // Otherwise, perform reorder among siblings
    const overId = String(over.id);
    const activePage = pages.find((p) => p.id === activeId);
    const overPage = pages.find((p) => p.id === overId);
    if (!activePage || !overPage) return;

    const activeParent = getParentSlug(activePage.slug);
    const overParent = getParentSlug(overPage.slug);

    // Cross-parent: move page to the over page's level (un-nest or re-parent)
    if (activeParent !== overParent) {
      handleMoveToLevel(activeId, overParent, overId);
      return;
    }

    const siblings = pages
      .filter((p) => getParentSlug(p.slug) === activeParent)
      .sort((a, b) => {
        const existing = orderMap[activeParent];
        if (existing) {
          const ai = existing.indexOf(a.id);
          const bi = existing.indexOf(b.id);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
        }
        return a.slug.localeCompare(b.slug);
      });

    const oldIdx = siblings.findIndex((p) => p.id === activeId);
    const newIdx = siblings.findIndex((p) => p.id === overId);
    if (oldIdx === -1 || newIdx === -1) return;

    const reordered = arrayMove(siblings, oldIdx, newIdx);
    const newOrder = { ...orderMap, [activeParent]: reordered.map((p) => p.id) };
    saveOrder(newOrder);
  };

  if (loading) {
    return (
      <div className="px-3 py-2">
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
      </div>
    );
  }

  if (collapsed) {
    return (
      <div className="px-2 py-1">
        <div
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10"
          title="Pages"
        >
          <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="py-1">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableTreeItem
          node={tree}
          depth={0}
          activePageId={activePageId}
          onSelect={handleSelect}
          onAddChild={handleAddChild}
          addMenuFor={addMenuFor}
          onNewPage={(slug) => { setNewPageParent(slug); setNewPageSource(undefined); }}
          onDuplicatePage={(slug, sourceId) => { setNewPageParent(slug); setNewPageSource(sourceId); }}
          onCloseMenu={() => setAddMenuFor(null)}
          activeDragId={activeDragId}
          nestTargetId={nestTargetId}
        />
        <DragOverlay dropAnimation={null}>
          {activeDragId && (() => {
            const p = pages.find((pg) => pg.id === activeDragId);
            return p ? (
              <div className="opacity-80 pointer-events-none">
                <div className="bg-charcoal text-white text-xs px-3 py-1.5 rounded-md shadow-xl border border-teal/40">
                  {p.title}
                </div>
                {dropIntent && (
                  <div className={`mt-1 text-[10px] font-medium px-2 py-0.5 rounded whitespace-nowrap ${
                    dropIntent.type === "reorder"
                      ? "text-teal bg-teal/10"
                      : "text-orange-300 bg-orange-400/10"
                  }`}>
                    {dropIntent.type === "reorder"
                      ? "↕ Reorder"
                      : `↳ Nest under ${dropIntent.targetTitle}`}
                  </div>
                )}
              </div>
            ) : null;
          })()}
        </DragOverlay>
      </DndContext>

      {/* In-app new page modal */}
      {newPageParent !== null && (
        <NewPageModal
          parentSlug={newPageParent}
          sourcePageId={newPageSource}
          onClose={() => { setNewPageParent(null); setNewPageSource(undefined); }}
          onCreated={handlePageCreated}
        />
      )}
    </div>
  );
}

function getParentSlug(slug: string): string {
  const parts = slug.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  return "/" + parts.slice(0, -1).join("/");
}
