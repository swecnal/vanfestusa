"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface PageSummary {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  updated_at: string;
  section_count: number;
}

export default function PagesListPage() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = () => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => {
        setPages(data.pages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const togglePublished = async (page: PageSummary) => {
    const res = await fetch(`/api/pages/${page.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !page.is_published }),
    });
    if (res.ok) {
      toast.success(`Page ${!page.is_published ? "published" : "unpublished"}`);
      fetchPages();
    }
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display font-bold text-2xl text-charcoal">
          All Pages
        </h2>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-100">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between px-3 sm:px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <Link
                href={`/admin/pages/${page.id}`}
                className="flex-1 min-w-0"
              >
                <p className="font-medium text-charcoal">{page.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{page.slug}</p>
              </Link>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <span className="text-xs text-gray-400">
                  {page.section_count} sections
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    togglePublished(page);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    page.is_published
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {page.is_published ? "Published" : "Draft"}
                </button>
                <Link
                  href={`/admin/pages/${page.id}`}
                  className="text-teal hover:text-teal-dark transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
