"use client";

import { useState, useEffect, useRef } from "react";
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
      { label: "Escape to the Cape — MA 2026", href: "/events/escape" },
      { label: "LIFTOFF! — FL 2027", href: "/events/liftoff" },
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
  {
    label: "Media",
    href: "/media",
    children: [
      { label: "Gallery", href: "/media#gallery" },
      { label: "Community Media", href: "/media#community" },
    ],
  },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Merch", href: "https://merch.vanfestusa.com/", external: true },
  { label: "Contact", href: "/contact" },
];

const escapeNavLinks: NavLink[] = [
  { label: "About", href: "/events/escape" },
  { label: "Schedule", href: "/events/escape#schedule" },
  { label: "Map", href: "/map" },
  {
    label: "Get Involved",
    href: "/events/escape#sponsors",
    children: [
      { label: "Jobs & Volunteers", href: "/events/escape#jobs" },
      { label: "Sponsors & Vendors", href: "/events/escape#sponsors" },
      { label: "Exhibit Your Rig", href: "/events/escape#exhibit" },
    ],
  },
  { label: "FAQ", href: "/events/escape#faq" },
  { label: "Contact", href: "/contact" },
];

const liftoffNavLinks: NavLink[] = [
  { label: "About", href: "/events/liftoff" },
  { label: "Schedule", href: "/events/liftoff#schedule" },
  { label: "Map", href: "/map" },
  {
    label: "Get Involved",
    href: "/events/liftoff#sponsors",
    children: [
      { label: "Jobs & Volunteers", href: "/events/liftoff#jobs" },
      { label: "Sponsors & Vendors", href: "/events/liftoff#sponsors" },
      { label: "Exhibit Your Rig", href: "/events/liftoff#exhibit" },
    ],
  },
  { label: "FAQ", href: "/events/liftoff#faq" },
  { label: "Contact", href: "/contact" },
];

type EventMode = "escape" | "liftoff" | null;

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Randomize CTA bounce timing
  useEffect(() => {
    if (!ctaRef.current) return;
    ctaRef.current.style.animationDuration = `${2 + Math.random() * 3}s`;
    ctaRef.current.style.animationDelay = `${Math.random() * 3}s`;
  }, []);

  // Detect event mode based on pathname
  const eventMode: EventMode =
    pathname === "/events/escape"
      ? "escape"
      : pathname === "/events/liftoff"
        ? "liftoff"
        : null;

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
        {/* Left side: Return link (event pages) + Logo + Event badge */}
        <div className="flex items-center gap-3">
          {/* Return to VanFest link (visible only on event pages) */}
          {isEventPage && (
            <Link
              href="/"
              className="hidden lg:flex items-center text-white/50 hover:text-white text-xs font-semibold transition-colors mr-1"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              VanFest
            </Link>
          )}

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/vanfest-logo.png"
              alt="VanFest"
              className={`transition-all duration-300 ${
                scrolled ? "h-14" : "h-20"
              }`}
              style={{ marginTop: "0%", marginBottom: scrolled ? "-30%" : "-40%" }}
            />
          </Link>

          {/* Event title badge (visible only on event pages, between logo and nav) */}
          {isEventPage && (
            <span
              className={`hidden lg:inline-block bg-gradient-to-r ${eventAccent} text-white font-display font-bold px-4 py-1.5 rounded-xl text-sm ml-2`}
            >
              {eventMode === "liftoff" ? "LIFTOFF!" : "Escape to the Cape"}
            </span>
          )}
        </div>

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
                  className={`px-3.5 py-2.5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
                    scrolled ? "text-sm" : "text-base"
                  }`}
                >
                  {link.label}
                </a>
              ) : link.children ? (
                <span
                  className={`px-3.5 py-2.5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-default select-none ${
                    scrolled ? "text-sm" : "text-base"
                  }`}
                >
                  {link.label}
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
                </span>
              ) : (
                <Link
                  href={link.href}
                  className={`px-3.5 py-2.5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
                    scrolled ? "text-sm" : "text-base"
                  }`}
                >
                  {link.label}
                </Link>
              )}
              {link.children && openDropdown === link.label && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-charcoal/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 py-2">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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
            ref={ctaRef}
            href={eventMode === "escape" ? "https://vanfest.ticketspice.com/escape2026" : "https://tickets.vanfestusa.com"}
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
                    className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : link.children ? (
                  <span className="block px-3 py-2 text-white/60 rounded-lg font-semibold text-sm uppercase tracking-wider">
                    {link.label}
                  </span>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-semibold"
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
                        className="block px-3 py-1.5 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
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
                  className="block px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg font-semibold"
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
