"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  children?: NavChild[];
}

const defaultNavLinks: NavLink[] = [
  {
    label: "Events",
    href: "/events",
    children: [
      { label: "Escape to the Cape — MA 2026", href: "/events#escape" },
      { label: "LIFTOFF! — FL 2027", href: "/events#liftoff" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About VanFest", href: "/about" },
      { label: "Found a Magnet?", href: "/magnet" },
      { label: "Terms & Conduct", href: "/terms" },
    ],
  },
  { label: "FAQ", href: "/faq" },
  {
    label: "Get Involved",
    href: "/get-involved",
    children: [
      { label: "Sponsors & Vendors", href: "/get-involved#sponsors" },
      { label: "Exhibit Your Rig", href: "/get-involved#exhibit" },
      { label: "Jobs @ VanFest", href: "/get-involved#jobs" },
    ],
  },
  { label: "Media", href: "/media" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Merch", href: "https://merch.vanfestusa.com/", external: true },
  { label: "Contact", href: "/contact" },
];

const escapeNavLinks: NavLink[] = [
  { label: "About", href: "/events#escape" },
  { label: "Schedule", href: "/events#escape-schedule" },
  {
    label: "Get Involved",
    href: "/get-involved",
    children: [
      { label: "Jobs & Volunteers", href: "/get-involved#jobs" },
      { label: "Sponsors & Vendors", href: "/get-involved#sponsors" },
      { label: "Exhibit Your Rig", href: "/get-involved#exhibit" },
    ],
  },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const liftoffNavLinks: NavLink[] = [
  { label: "About", href: "/events#liftoff" },
  { label: "Schedule & Details", href: "/events#liftoff" },
  {
    label: "Get Involved",
    href: "/get-involved",
    children: [
      { label: "Jobs & Volunteers", href: "/get-involved#jobs" },
      { label: "Sponsors & Vendors", href: "/get-involved#sponsors" },
      { label: "Exhibit Your Rig", href: "/get-involved#exhibit" },
    ],
  },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

type EventMode = "escape" | "liftoff" | null;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [eventMode, setEventMode] = useState<EventMode>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect event mode based on pathname + visible section
  useEffect(() => {
    if (pathname !== "/events") {
      setEventMode(null);
      return;
    }

    const detectEvent = () => {
      const escapeEl = document.getElementById("escape");
      const liftoffEl = document.getElementById("liftoff");
      if (!escapeEl && !liftoffEl) return;

      const viewportMid = window.innerHeight / 2;
      const escapeRect = escapeEl?.getBoundingClientRect();
      const liftoffRect = liftoffEl?.getBoundingClientRect();

      if (liftoffRect && liftoffRect.top < viewportMid && liftoffRect.bottom > 0) {
        setEventMode("liftoff");
      } else if (escapeRect && escapeRect.top < viewportMid && escapeRect.bottom > 0) {
        setEventMode("escape");
      } else {
        // Check hash on initial load
        const hash = window.location.hash;
        if (hash === "#liftoff") setEventMode("liftoff");
        else if (hash === "#escape") setEventMode("escape");
        else setEventMode("escape"); // default to first event
      }
    };

    detectEvent();
    window.addEventListener("scroll", detectEvent, { passive: true });
    return () => window.removeEventListener("scroll", detectEvent);
  }, [pathname]);

  const isEventPage = eventMode !== null;
  const navLinks = isEventPage
    ? eventMode === "liftoff"
      ? liftoffNavLinks
      : escapeNavLinks
    : defaultNavLinks;

  const eventAccent = eventMode === "liftoff"
    ? "from-purple-600 to-pink-500"
    : "from-blue-600 to-teal";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href={isEventPage ? "/" : "/"} className="flex items-center gap-3 group">
          <img
            src="/images/vanfest-logo.png"
            alt="VanFest"
            className={`transition-all duration-300 ${
              scrolled ? "h-14" : "h-20"
            }`}
            style={{ marginTop: scrolled ? "35%" : "35%", marginBottom: "-15%" }}
          />
          {isEventPage && (
            <span
              className={`font-display font-semibold text-white/80 hover:text-white transition-colors hidden sm:block ${
                scrolled ? "text-xs" : "text-sm"
              }`}
            >
              &larr; Return to VanFest
            </span>
          )}
        </Link>

        {/* Event title badge (visible only on event pages) */}
        {isEventPage && (
          <div className="hidden lg:flex items-center mr-auto ml-4">
            <span
              className={`bg-gradient-to-r ${eventAccent} text-white font-display font-bold px-4 py-1.5 rounded-xl text-sm`}
            >
              {eventMode === "liftoff" ? "LIFTOFF!" : "Escape to the Cape"}
            </span>
          </div>
        )}

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() =>
                link.children && setOpenDropdown(link.label)
              }
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-2.5 rounded-lg font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
                    scrolled ? "text-sm" : "text-base"
                  }`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={`px-3.5 py-2.5 rounded-lg font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
                    scrolled ? "text-sm" : "text-base"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <svg
                      className="inline ml-1 w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>
              )}
              {link.children && openDropdown === link.label && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-charcoal/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 py-2">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="https://vanfest.fieldpass.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`bg-teal hover:bg-teal-dark text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-attention ${
              scrolled
                ? "px-5 py-2 text-sm"
                : "px-7 py-2.5 text-base"
            }`}
          >
            Get Tickets
          </a>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-charcoal/95 backdrop-blur-md border-t border-white/10 mt-2">
          <div className="px-4 py-4 space-y-1">
            {isEventPage && (
              <div className="mb-3 pb-3 border-b border-white/10">
                <span
                  className={`inline-block bg-gradient-to-r ${eventAccent} text-white font-display font-bold px-4 py-1.5 rounded-xl text-sm`}
                >
                  {eventMode === "liftoff" ? "LIFTOFF!" : "Escape to the Cape"}
                </span>
              </div>
            )}
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
                {link.children && (
                  <div className="ml-4 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isEventPage && (
              <div className="pt-3 mt-3 border-t border-white/10">
                <Link
                  href="/"
                  className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  &larr; Return to VanFest
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
