"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
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
  { label: "Merch", href: "/merch" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-charcoal/95 backdrop-blur-md py-2 shadow-lg"
          : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={`rounded-full bg-teal flex items-center justify-center font-bold text-white transition-all duration-300 ${
              scrolled ? "w-9 h-9 text-sm" : "w-12 h-12 text-lg"
            }`}
          >
            VF
          </div>
          <span
            className={`font-display font-bold text-white transition-all duration-300 ${
              scrolled ? "text-lg" : "text-xl"
            }`}
          >
            VanFest
          </span>
        </Link>

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
              <Link
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
                  scrolled ? "text-xs" : "text-sm"
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
            className={`bg-teal hover:bg-teal-dark text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
              scrolled
                ? "px-4 py-1.5 text-xs"
                : "px-5 py-2 text-sm"
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
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
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
          </div>
        </div>
      )}
    </nav>
  );
}
