"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PageSummary {
  id: string;
  slug: string;
  title: string;
  is_published: boolean;
  updated_at: string;
  section_count: number;
}

export default function AdminDashboard() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pages")
      .then((r) => r.json())
      .then((data) => {
        setPages(data.pages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-charcoal">
          Welcome to VanFest Admin
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your website content, images, and settings.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-display font-bold text-teal">
            {pages.length}
          </p>
          <p className="text-gray-500 text-sm">Pages</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-display font-bold text-teal">
            {pages.reduce((sum, p) => sum + p.section_count, 0)}
          </p>
          <p className="text-gray-500 text-sm">Total Sections</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-3xl font-display font-bold text-teal">
            {pages.filter((p) => p.is_published).length}
          </p>
          <p className="text-gray-500 text-sm">Published</p>
        </div>
      </div>

      {/* Recent pages */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-semibold text-charcoal">Pages</h3>
          <Link
            href="/admin/pages"
            className="text-teal hover:text-teal-dark text-sm font-semibold transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pages.slice(0, 8).map((page) => (
              <Link
                key={page.id}
                href={`/admin/pages/${page.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm text-charcoal">
                    {page.title}
                  </p>
                  <p className="text-xs text-gray-400">{page.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {page.section_count} sections
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      page.is_published ? "bg-green-400" : "bg-gray-300"
                    }`}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
