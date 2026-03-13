"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

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
}

function buildTree(pages: PageItem[]): TreeNode {
  const root: TreeNode = {
    label: "vanfestusa.com",
    children: [],
    expanded: true,
  };

  // Sort pages by slug for consistent ordering
  const sorted = [...pages].sort((a, b) => a.slug.localeCompare(b.slug));

  for (const page of sorted) {
    const parts = page.slug.split("/").filter(Boolean);

    if (parts.length === 0) {
      // Homepage "/"
      root.page = page;
      continue;
    }

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      let child = current.children.find(
        (c) => c.label.toLowerCase().replace(/\s+/g, "-") === part ||
               c.page?.slug === "/" + parts.slice(0, i + 1).join("/")
      );

      if (!child) {
        child = {
          label: part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          children: [],
          expanded: true,
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

  return root;
}

function TreeItem({
  node,
  depth,
  activePageId,
  onSelect,
  collapsed,
}: {
  node: TreeNode;
  depth: number;
  activePageId: string | null;
  onSelect: (pageId: string) => void;
  collapsed: boolean;
}) {
  const [expanded, setExpanded] = useState(node.expanded);
  const hasChildren = node.children.length > 0;
  const isActive = node.page?.id === activePageId;

  if (collapsed) {
    // In collapsed mode, show just an icon for root
    if (depth === 0) {
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
    return null;
  }

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors group ${
          isActive
            ? "bg-teal/20 text-white"
            : "text-white/70 hover:bg-white/5 hover:text-white"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => {
          if (node.page) onSelect(node.page.id);
          // Root node (depth 0) only collapses via the chevron button
          if (hasChildren && depth > 0) setExpanded(!expanded);
        }}
      >
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

        {/* Published indicator */}
        {node.page && (
          <span
            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
              node.page.is_published ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {node.children.map((child, i) => (
            <TreeItem
              key={child.page?.id || `${depth}-${i}`}
              node={child}
              depth={depth + 1}
              activePageId={activePageId}
              onSelect={onSelect}
              collapsed={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PageTree({ collapsed }: { collapsed: boolean }) {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Extract active page ID from URL
  const activePageId = pathname.match(/\/admin\/pages\/([^/]+)/)?.[1] || null;

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => setPages(data.pages || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tree = buildTree(pages);

  const handleSelect = (pageId: string) => {
    router.push(`/admin/pages/${pageId}`);
  };

  if (loading) {
    return (
      <div className="px-3 py-2">
        <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="py-1">
      <TreeItem
        node={tree}
        depth={0}
        activePageId={activePageId}
        onSelect={handleSelect}
        collapsed={collapsed}
      />
    </div>
  );
}
