"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Module-level page cache — shared across all UrlInput instances
let cachedPages: Array<{ slug: string; title: string }> | null = null;
let fetchPromise: Promise<void> | null = null;

function ensurePages(): Promise<Array<{ slug: string; title: string }>> {
  if (cachedPages) return Promise.resolve(cachedPages);
  if (fetchPromise) return fetchPromise.then(() => cachedPages || []);
  fetchPromise = fetch("/api/pages")
    .then((r) => r.json())
    .then((res) => {
      cachedPages = ((res.pages || []) as Array<{ slug: string; title: string }>).map((p) => ({
        slug: p.slug,
        title: p.title,
      }));
    })
    .catch(() => {
      cachedPages = [];
    });
  return fetchPromise.then(() => cachedPages || []);
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function UrlInput({ value, onChange, placeholder, className }: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [pages, setPages] = useState<Array<{ slug: string; title: string }>>([]);
  const [filter, setFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (val.startsWith("/")) {
      setFilter(val);
      ensurePages().then((p) => {
        setPages(p);
        setShowDropdown(true);
      });
    } else {
      setShowDropdown(false);
    }
  }, [onChange]);

  const handleSelect = useCallback((slug: string) => {
    onChange(slug);
    setShowDropdown(false);
  }, [onChange]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  // Filter pages by typed value
  const filtered = pages.filter((p) => {
    const q = filter.toLowerCase();
    return p.slug.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
  });

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => {
          if (value.startsWith("/")) {
            setFilter(value);
            ensurePages().then((p) => {
              setPages(p);
              setShowDropdown(true);
            });
          }
        }}
        placeholder={placeholder}
        className={className}
      />
      {showDropdown && filtered.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => handleSelect(p.slug)}
              className="w-full text-left px-3 py-1.5 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span className="text-xs font-mono text-teal truncate">{p.slug}</span>
              <span className="text-[10px] text-gray-400 truncate">{p.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
