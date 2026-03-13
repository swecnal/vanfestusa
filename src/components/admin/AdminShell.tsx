"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Toaster } from "sonner";
import PageTree from "./PageTree";
import { PageEditorProvider, usePageEditor } from "@/lib/page-editor-context";
import type { SectionType } from "@/lib/types";

interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
}

const ELEMENT_GROUPS: { label: string; items: { type: SectionType; label: string }[] }[] = [
  { label: "Heroes", items: [{ type: "hero_carousel", label: "Hero Carousel" }, { type: "hero_simple", label: "Hero Banner" }] },
  { label: "Content", items: [{ type: "text_block", label: "Text Block" }, { type: "html_block", label: "HTML Block" }] },
  { label: "Cards & Grids", items: [{ type: "two_column_cards", label: "Two-Column Cards" }, { type: "feature_grid", label: "Feature Grid" }, { type: "event_cards", label: "Event Cards" }, { type: "cta_cards", label: "CTA Cards" }] },
  { label: "Actions", items: [{ type: "cta_section", label: "CTA Section" }, { type: "contact_form", label: "Contact Form" }] },
  { label: "Accordions", items: [{ type: "faq_accordion", label: "FAQ Accordion" }, { type: "schedule_accordion", label: "Schedule" }, { type: "sponsor_tiers", label: "Sponsor Tiers" }, { type: "sponsor_list", label: "Sponsor List" }] },
  { label: "Media", items: [{ type: "image_carousel", label: "Image Carousel" }, { type: "photo_strip", label: "Photo Strip" }, { type: "image_gallery", label: "Image Gallery" }, { type: "sponsor_marquee", label: "Marquee" }] },
  { label: "Decorative", items: [{ type: "wave_divider", label: "Wave Divider" }, { type: "vehicle_convoy", label: "Vehicle Convoy" }, { type: "vehicle_stream", label: "Vehicle Stream" }] },
];

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Media", href: "/admin/media", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Styles", href: "/admin/styles", icon: "M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" },
  { label: "Settings", href: "/admin/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
  { label: "Users", href: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
];

function InlineElementPalette() {
  const { addSection } = usePageEditor();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isActive = addSection !== null;

  return (
    <div className="space-y-0.5">
      {ELEMENT_GROUPS.map((group) => {
        const isOpen = expanded[group.label] ?? true;
        return (
          <div key={group.label}>
            <button
              onClick={() => setExpanded((prev) => ({ ...prev, [group.label]: !isOpen }))}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-white/40 hover:text-white/70 transition-colors"
            >
              <svg
                className={`w-3 h-3 transition-transform flex-shrink-0 ${isOpen ? "rotate-90" : ""}`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
              </svg>
              <span className="text-[10px] uppercase tracking-wider font-semibold truncate">
                {group.label}
              </span>
            </button>
            {isOpen && (
              <div className="ml-4 space-y-px">
                {group.items.map((item) => (
                  <div
                    key={item.type}
                    draggable={isActive}
                    onDragStart={(e) => {
                      if (!isActive) { e.preventDefault(); return; }
                      e.dataTransfer.setData("application/section-type", item.type);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => { if (isActive && addSection) addSection(item.type); }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${
                      isActive
                        ? "text-white/60 hover:text-white hover:bg-white/10 cursor-grab active:cursor-grabbing"
                        : "text-white/30 cursor-default"
                    }`}
                    title={isActive ? `Drag or click to add ${item.label}` : "Open a page to add elements"}
                  >
                    <svg className="w-3 h-3 flex-shrink-0 text-teal/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm-4 8a2 2 0 104 0 2 2 0 00-4 0zm12-14a2 2 0 11-4 0 2 2 0 014 0zm-4 6a2 2 0 104 0 2 2 0 00-4 0zm0 8a2 2 0 104 0 2 2 0 00-4 0z" />
                    </svg>
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      {!isActive && (
        <p className="px-4 py-2 text-[10px] text-white/20 italic">
          Open a page to add elements
        </p>
      )}
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [elementsOpen, setElementsOpen] = useState(true);

  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/change-password";
  const isPageEditor = pathname.startsWith("/admin/pages/") && pathname !== "/admin/pages";

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      // Not authenticated
    }
  }, []);

  useEffect(() => {
    if (!isLoginPage) {
      fetchUser();
    }
  }, [isLoginPage, fetchUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  // Login / change-password gets no shell
  if (isLoginPage) {
    return (
      <>
        <Toaster position="top-right" richColors toastOptions={{ duration: 1500 }} />
        {children}
      </>
    );
  }

  // Determine active nav label for top bar
  const getTopBarTitle = () => {
    if (isPageEditor) return "Page Editor";
    if (pathname === "/admin/pages") return "Pages";
    const nav = navItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(item.href))
    );
    return nav?.label || "Admin";
  };

  return (
    <PageEditorProvider>
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" richColors toastOptions={{ duration: 1500 }} />

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} bg-charcoal text-white flex flex-col transition-all duration-200 flex-shrink-0`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <img src="/images/vanfest-logo.png" alt="VanFest" className="h-8 w-8 object-contain flex-shrink-0" />
          {sidebarOpen && (
            <span className="font-display font-bold text-lg">VanFest</span>
          )}
        </div>

        {/* Nav */}
        <nav className="py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-teal text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Scrollable area: Site Pages + Elements */}
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
          {/* SITE PAGES */}
          <div className="px-4 pt-2 pb-1">
            {sidebarOpen ? (
              <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                Site Pages
              </p>
            ) : (
              <div className="border-t border-white/10" />
            )}
          </div>
          <div className="px-1" onClick={() => { if (!sidebarOpen) setSidebarOpen(true); }}>
            <PageTree collapsed={!sidebarOpen} />
          </div>

          {/* ELEMENTS */}
          {sidebarOpen && (
            <>
              <button
                onClick={() => setElementsOpen(!elementsOpen)}
                className="w-full flex items-center gap-1.5 px-4 pt-4 pb-1 group"
              >
                <svg
                  className={`w-3 h-3 text-white/30 transition-transform flex-shrink-0 ${elementsOpen ? "rotate-90" : ""}`}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                </svg>
                <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold group-hover:text-white/50 transition-colors">
                  Elements
                </p>
              </button>
              {elementsOpen && (
                <div className="px-1 pb-2">
                  <InlineElementPalette />
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 p-4">
          <a
            href="https://vanfestusa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors mb-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            {sidebarOpen && <span>View Site</span>}
          </a>
          {user && sidebarOpen && (
            <div className="flex items-center justify-between">
              <div className="text-xs">
                <p className="text-white/80 font-medium">{user.display_name}</p>
                <p className="text-white/40">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-white/40 hover:text-white transition-colors"
                title="Logout"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          )}
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mt-3 text-white/30 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={sidebarOpen ? "M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" : "M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"} />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="text-lg font-display font-semibold text-charcoal">
            {getTopBarTitle()}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
    </PageEditorProvider>
  );
}
