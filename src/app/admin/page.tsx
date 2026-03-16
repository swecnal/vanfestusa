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

interface VisitorStats {
  today: number;
  week: number;
  month: number;
  year: number;
  all_time: number;
}

const statTiles = [
  { key: "today" as const, label: "Today" },
  { key: "week" as const, label: "This Week" },
  { key: "month" as const, label: "This Month" },
  { key: "year" as const, label: "This Year" },
  { key: "all_time" as const, label: "All Time" },
];

export default function AdminDashboard() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [stats, setStats] = useState<VisitorStats>({
    today: 0, week: 0, month: 0, year: 0, all_time: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/pages").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
    ])
      .then(([pagesData, analyticsData]) => {
        setPages(pagesData.pages || []);
        if (analyticsData.stats) setStats(analyticsData.stats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-charcoal">
          Dashboard
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Site traffic and content overview.
        </p>
      </div>

      {/* Visitor metrics - 5 tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statTiles.map((tile) => (
          <div
            key={tile.key}
            className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-sm transition-shadow"
          >
            <p className="text-2xl sm:text-3xl font-display font-bold text-teal tabular-nums">
              {loading ? (
                <span className="inline-block w-10 h-8 bg-gray-100 rounded animate-pulse" />
              ) : (
                stats[tile.key].toLocaleString()
              )}
            </p>
            <p className="text-gray-500 text-sm mt-1">{tile.label}</p>
          </div>
        ))}
      </div>

      {/* Content stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-2xl font-display font-bold text-charcoal">
            {pages.length}
          </p>
          <p className="text-gray-500 text-sm">Pages</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-2xl font-display font-bold text-charcoal">
            {pages.reduce((sum, p) => sum + p.section_count, 0)}
          </p>
          <p className="text-gray-500 text-sm">Total Sections</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-2xl font-display font-bold text-charcoal">
            {pages.filter((p) => p.is_published).length}
          </p>
          <p className="text-gray-500 text-sm">Published</p>
        </div>
      </div>

      {/* Recent pages */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-3 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-semibold text-charcoal">
            Recent Pages
          </h3>
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
                className="flex items-center justify-between px-3 sm:px-6 py-3 hover:bg-gray-50 transition-colors"
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
