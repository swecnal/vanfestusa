"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { NavbarBuilderConfig, NavbarLinkV2, NavbarCtaConfig, NavbarZone } from "@/lib/types";

/* ─── V1 Types + Defaults ─── */

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
      { label: "LIFTOFF!", href: "/events/liftoff" },
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
      { label: "Sponsors & Vendors", href: "/sponsors-vendors" },
      { label: "Exhibit Your Rig", href: "/exhibit-your-rig" },
      { label: "Jobs @ VanFest", href: "/jobs" },
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
  { label: "Schedule", href: "/events/escape/schedule" },
  { label: "Map", href: "/events/escape/map" },
  {
    label: "Get Involved",
    href: "/events/escape/sponsors-vendors",
    children: [
      { label: "Jobs & Volunteers", href: "/events/escape/jobs" },
      { label: "Sponsors & Vendors", href: "/events/escape/sponsors-vendors" },
      { label: "Exhibit Your Rig", href: "/events/escape/exhibit-your-rig" },
    ],
  },
  { label: "FAQ", href: "/events/escape/faq" },
  { label: "Contact", href: "/contact" },
];

const liftoffNavLinks: NavLink[] = [
  { label: "About", href: "/events/liftoff" },
  { label: "Schedule", href: "/events/liftoff/schedule" },
  { label: "Map", href: "/events/liftoff/map" },
  {
    label: "Get Involved",
    href: "/events/liftoff/sponsors-vendors",
    children: [
      { label: "Jobs & Volunteers", href: "/events/liftoff/jobs" },
      { label: "Sponsors & Vendors", href: "/events/liftoff/sponsors-vendors" },
      { label: "Exhibit Your Rig", href: "/events/liftoff/exhibit-your-rig" },
    ],
  },
  { label: "FAQ", href: "/events/liftoff/faq" },
  { label: "Contact", href: "/contact" },
];

/* ─── V2 Navbar Renderer ─── */

function NavbarV2({ config, embedded }: { config: NavbarBuilderConfig; embedded?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const ctaRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, [pathname]);

  // Bounce animation for CTA buttons
  useEffect(() => {
    ctaRefs.current.forEach((ref) => {
      if (!ref) return;
      ref.style.animationDuration = `${2 + Math.random() * 3}s`;
      ref.style.animationDelay = `${Math.random() * 3}s`;
    });
  }, []);

  // Detect event mode (matches /events/escape and all sub-pages like /events/escape/map)
  const eventMode = pathname.startsWith("/events/escape") ? "escape" : pathname.startsWith("/events/liftoff") ? "liftoff" : null;
  const isEventPage = eventMode !== null;

  // Resolve links and CTAs (event overrides) — try exact path first, then base event path
  const eventBasePath = eventMode ? `/events/${eventMode}` : null;
  const eventOverride = config.eventOverrides?.[pathname] || (eventBasePath ? config.eventOverrides?.[eventBasePath] : undefined);
  const navLinks: NavbarLinkV2[] = eventOverride?.links || config.links;
  const ctaButtons: NavbarCtaConfig[] = eventOverride?.ctaButtons || config.ctaButtons;

  const style = config.style || { bgColor: "#1a1a1a", bgOpacity: 95, textColor: "#ffffff", hoverColor: "#2dd4bf" };
  const bgOpacity = Math.round((style.bgOpacity / 100) * 255).toString(16).padStart(2, "0");

  // Badge from config (replaces old hardcoded eventAccent logic)
  const badge = config.badge;
  const badgeStyle = badge ? {
    background: badge.bgColorEnd
      ? `linear-gradient(to right, ${badge.bgColor}, ${badge.bgColorEnd})`
      : badge.bgColor,
    color: badge.textColor || "#ffffff",
  } : undefined;

  // Build zone content
  const renderLogo = () => (
    <div className="flex items-center gap-3">
      {isEventPage && (
        <Link
          href="/"
          className="hidden lg:flex items-center text-xs font-semibold transition-colors mr-1"
          style={{ color: `${style.textColor}80` }}
        >
          <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          VanFest
        </Link>
      )}
      <Link href="/" className="flex items-center gap-3 group">
        <img
          src={config.logo.src}
          alt={config.logo.text || "VanFest"}
          className="transition-all duration-300"
          style={{
            height: scrolled ? config.logo.heightScrolled : config.logo.height,
            marginTop: "0%",
            marginBottom: scrolled ? "-30%" : "-40%",
          }}
        />
        {config.logo.showText && (
          <span className="font-display font-bold text-xl" style={{ color: style.textColor }}>{config.logo.text}</span>
        )}
      </Link>
      {badge && (
        <span
          className="hidden lg:inline-block font-display font-bold px-4 py-1.5 rounded-xl text-sm ml-2"
          style={badgeStyle}
        >
          {badge.text}
        </span>
      )}
    </div>
  );

  const renderLinks = () => (
    <div className="hidden lg:flex items-center gap-1 whitespace-nowrap">
      {navLinks.map((link) => (
        <div
          key={link.id}
          className="relative"
          onMouseEnter={() => link.children && setOpenDropdown(link.id)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {link.external ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-3.5 py-2.5 rounded-lg font-semibold transition-colors ${scrolled ? "text-sm" : "text-base"}`}
              style={{ color: `${style.textColor}e6` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = style.textColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${style.textColor}e6`; }}
            >
              {link.label}
            </a>
          ) : link.children ? (
            <span
              className={`px-3.5 py-2.5 rounded-lg font-semibold transition-colors cursor-default select-none ${scrolled ? "text-sm" : "text-base"}`}
              style={{ color: `${style.textColor}e6` }}
            >
              {link.label}
              <svg className="inline ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          ) : link.href.includes("#") ? (
            <a
              href={link.href}
              className={`px-3.5 py-2.5 rounded-lg font-semibold transition-colors ${scrolled ? "text-sm" : "text-base"}`}
              style={{ color: `${style.textColor}e6` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = style.textColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${style.textColor}e6`; }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              href={link.href}
              className={`px-3.5 py-2.5 rounded-lg font-semibold transition-colors ${scrolled ? "text-sm" : "text-base"}`}
              style={{ color: `${style.textColor}e6` }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = style.textColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${style.textColor}e6`; }}
            >
              {link.label}
            </Link>
          )}
          {link.children && openDropdown === link.id && (
            <div
              className="absolute top-full left-0 mt-1 w-56 backdrop-blur-md rounded-lg shadow-xl border py-2"
              style={{ backgroundColor: `${style.bgColor}f2`, borderColor: `${style.textColor}1a` }}
            >
              {link.children.map((child) =>
                child.href.includes("#") ? (
                <a
                  key={child.id}
                  href={child.href}
                  className="block px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: `${style.textColor}cc` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = style.textColor; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${style.textColor}cc`; }}
                >
                  {child.label}
                </a>
                ) : (
                <Link
                  key={child.id}
                  href={child.href}
                  className="block px-4 py-2 text-sm font-medium transition-colors"
                  style={{ color: `${style.textColor}cc` }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = style.textColor; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${style.textColor}cc`; }}
                >
                  {child.label}
                </Link>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const getCtaClasses = (cta: NavbarCtaConfig) => {
    const base = `font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${scrolled ? "px-5 py-2 text-sm" : "px-7 py-2.5 text-base"}`;
    if (cta.bounce) return `${base} animate-bounce-attention`;
    return base;
  };

  const getCtaStyle = (cta: NavbarCtaConfig) => {
    const bg = cta.bgColor || style.hoverColor;
    const text = cta.textColor || "#ffffff";
    if (cta.variant === "outline") {
      return { backgroundColor: "transparent", color: bg, border: `2px solid ${bg}` };
    }
    if (cta.variant === "secondary") {
      return { backgroundColor: `${bg}33`, color: bg };
    }
    return { backgroundColor: bg, color: text };
  };

  const renderCtaButtons = () => (
    <div className="hidden lg:flex items-center gap-3">
      {ctaButtons.map((cta, i) => (
        <a
          key={i}
          ref={(el) => { ctaRefs.current[i] = el; }}
          href={cta.href}
          target={cta.external !== false ? "_blank" : undefined}
          rel={cta.external !== false ? "noopener noreferrer" : undefined}
          className={getCtaClasses(cta)}
          style={getCtaStyle(cta)}
        >
          {cta.text}
        </a>
      ))}
    </div>
  );

  // Build zone map — track which zone has links so it can flex-grow
  const disabled = config.disabledZones || [];
  const zoneContent: Record<NavbarZone, React.ReactNode[]> = { left: [], center: [], right: [] };
  const zoneHasLinks: Record<NavbarZone, boolean> = { left: false, center: false, right: false };
  if (!disabled.includes("logo")) zoneContent[config.layout.logo].push(<div key="logo">{renderLogo()}</div>);
  if (!disabled.includes("links")) {
    zoneContent[config.layout.links].push(<div key="links">{renderLinks()}</div>);
    zoneHasLinks[config.layout.links] = true;
  }
  if (!disabled.includes("cta")) zoneContent[config.layout.cta].push(<div key="cta">{renderCtaButtons()}</div>);

  const zoneAlign: Record<NavbarZone, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  // Show opaque background when embedded (admin preview) or scrolled
  const showOpaque = embedded || scrolled;

  return (
    <nav
      className={`${embedded ? "relative" : "fixed top-0 left-0 right-0"} z-50 transition-all duration-300`}
      style={{
        backgroundColor: showOpaque ? `${style.bgColor}${bgOpacity}` : "transparent",
        backdropFilter: showOpaque ? "blur(12px)" : undefined,
        paddingTop: showOpaque ? "0.75rem" : "1.25rem",
        paddingBottom: showOpaque ? "0.75rem" : "1.25rem",
        boxShadow: scrolled && !embedded ? "0 10px 15px -3px rgb(0 0 0 / 0.1)" : undefined,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Three zones — links zone grows, others shrink to content */}
        {(["left", "center", "right"] as NavbarZone[]).map((zone) => (
          <div
            key={zone}
            className={`flex items-center gap-2 ${zoneAlign[zone]} ${
              zoneHasLinks[zone] ? "flex-1 min-w-0" : "flex-shrink-0"
            }`}
          >
            {zoneContent[zone]}
          </div>
        ))}
        {/* Mobile hamburger — always visible, outside zone system */}
        <button
          className="lg:hidden p-2 ml-2 flex-shrink-0"
          style={{ color: style.textColor }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (() => {
        const mobileDisabled = config.mobileDisabledZones || [];
        const mobileOrder = config.mobileLayout || ["logo", "links", "cta"];

        const renderMobileLogo = () => {
          if (mobileDisabled.includes("logo")) return null;
          if (!isEventPage && !badge) return null;
          return (
            <div key="mobile-logo" className="mb-3 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: `${style.textColor}1a` }}>
              {isEventPage && (
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-semibold transition-colors"
                  style={{ color: style.textColor }}
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to VanFest Home
                </Link>
              )}
              {badge && (
                <span
                  className="inline-block font-display font-bold px-4 py-1.5 rounded-xl text-sm mt-2"
                  style={badgeStyle}
                >
                  {badge.text}
                </span>
              )}
            </div>
          );
        };

        const renderMobileLinks = () => {
          if (mobileDisabled.includes("links")) return null;
          return (
            <div key="mobile-links">
              {navLinks.map((link) => (
                <div key={link.id}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-2.5 rounded-lg font-semibold"
                      style={{ color: `${style.textColor}e6` }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : link.children ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.id ? null : link.id)}
                        className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg font-semibold transition-colors"
                        style={{ color: `${style.textColor}e6` }}
                      >
                        {link.label}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === link.id ? "rotate-180" : ""}`}
                          style={{ color: `${style.textColor}80` }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {mobileExpanded === link.id && (
                        <div className="ml-4 space-y-1 mt-1">
                          {link.children.map((child) =>
                            child.href.includes("#") ? (
                            <a
                              key={child.id}
                              href={child.href}
                              className="block px-3 py-2 text-sm font-medium rounded-lg"
                              style={{ color: `${style.textColor}99` }}
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </a>
                            ) : (
                            <Link
                              key={child.id}
                              href={child.href}
                              className="block px-3 py-2 text-sm font-medium rounded-lg"
                              style={{ color: `${style.textColor}99` }}
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                            )
                          )}
                        </div>
                      )}
                    </>
                  ) : link.href.includes("#") ? (
                    <a
                      href={link.href}
                      className="block px-3 py-2.5 rounded-lg font-semibold"
                      style={{ color: `${style.textColor}e6` }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="block px-3 py-2.5 rounded-lg font-semibold"
                      style={{ color: `${style.textColor}e6` }}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          );
        };

        const renderMobileCta = () => {
          if (mobileDisabled.includes("cta") || ctaButtons.length === 0) return null;
          return (
            <div key="mobile-cta" className="pt-3 mt-3 flex flex-col gap-2" style={{ borderTopWidth: 1, borderTopColor: `${style.textColor}1a` }}>
              {ctaButtons.map((cta, i) => (
                <a
                  key={i}
                  href={cta.href}
                  target={cta.external !== false ? "_blank" : undefined}
                  rel={cta.external !== false ? "noopener noreferrer" : undefined}
                  className="block text-center font-bold rounded-xl px-5 py-2.5 text-sm transition-all"
                  style={getCtaStyle(cta)}
                  onClick={() => setMobileOpen(false)}
                >
                  {cta.text}
                </a>
              ))}
            </div>
          );
        };

        const mobileRenderers: Record<string, () => React.ReactNode> = {
          logo: renderMobileLogo,
          links: renderMobileLinks,
          cta: renderMobileCta,
        };

        return (
        <div
          className="lg:hidden backdrop-blur-md border-t mt-2"
          style={{ backgroundColor: `${style.bgColor}f2`, borderColor: `${style.textColor}1a` }}
        >
          <div className="px-4 py-4 space-y-1">
            {mobileOrder.map((key) => mobileRenderers[key]?.())}
          </div>
        </div>
        );
      })()}
    </nav>
  );
}

/* ─── V1 Navbar Renderer (existing) ─── */

interface NavbarV1Props {
  config?: {
    links: NavLink[];
    ctaButton: { text: string; href: string; external?: boolean };
    eventOverrides?: Record<string, {
      links: NavLink[];
      ctaButton?: { text: string; href: string; external?: boolean };
      badgeText?: string;
      badgeGradient?: string;
    }>;
  };
}

function NavbarV1({ config }: NavbarV1Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, [pathname]);

  useEffect(() => {
    if (!ctaRef.current) return;
    ctaRef.current.style.animationDuration = `${2 + Math.random() * 3}s`;
    ctaRef.current.style.animationDelay = `${Math.random() * 3}s`;
  }, []);

  const eventMode = pathname.startsWith("/events/escape") ? "escape" : pathname.startsWith("/events/liftoff") ? "liftoff" : null;
  const isEventPage = eventMode !== null;

  const eventOverride = config?.eventOverrides?.[pathname];
  const navLinks = eventOverride?.links
    ? eventOverride.links
    : config?.links?.length
      ? (isEventPage
          ? eventMode === "liftoff" ? liftoffNavLinks : escapeNavLinks
          : config.links)
      : (isEventPage
          ? eventMode === "liftoff" ? liftoffNavLinks : escapeNavLinks
          : defaultNavLinks);

  const ctaButton = eventOverride?.ctaButton || config?.ctaButton || {
    text: "Get Tickets",
    href: eventMode === "escape" ? "https://vanfest.ticketspice.com/escape2026" : "https://tickets.vanfestusa.com",
    external: true,
  };

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
        <div className="flex items-center gap-3">
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
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/vanfest-logo.png"
              alt="VanFest"
              className={`transition-all duration-300 ${scrolled ? "h-14" : "h-20"}`}
              style={{ marginTop: "0%", marginBottom: scrolled ? "-30%" : "-40%" }}
            />
          </Link>
          {isEventPage && (
            <span
              className={`hidden lg:inline-block bg-gradient-to-r ${eventAccent} text-white font-display font-bold px-4 py-1.5 rounded-xl text-sm ml-2`}
            >
              {eventMode === "liftoff" ? "LIFTOFF!" : "Escape to the Cape"}
            </span>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-3.5 py-2.5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors ${scrolled ? "text-sm" : "text-base"}`}
                >
                  {link.label}
                </a>
              ) : link.children ? (
                <span
                  className={`px-3.5 py-2.5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-default select-none ${scrolled ? "text-sm" : "text-base"}`}
                >
                  {link.label}
                  <svg className="inline ml-1 w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              ) : link.href.includes("#") ? (
                <a
                  href={link.href}
                  className={`px-3.5 py-2.5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors ${scrolled ? "text-sm" : "text-base"}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={`px-3.5 py-2.5 rounded-lg font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors ${scrolled ? "text-sm" : "text-base"}`}
                >
                  {link.label}
                </Link>
              )}
              {link.children && openDropdown === link.label && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-charcoal/95 backdrop-blur-md rounded-lg shadow-xl border border-white/10 py-2">
                  {link.children.map((child) => (
                    child.href.includes("#") ? (
                    <a
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {child.label}
                    </a>
                    ) : (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {child.label}
                    </Link>
                    )
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            ref={ctaRef}
            href={ctaButton.href}
            target={ctaButton.external !== false ? "_blank" : undefined}
            rel={ctaButton.external !== false ? "noopener noreferrer" : undefined}
            className={`bg-teal hover:bg-teal-dark text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl animate-bounce-attention ${
              scrolled ? "px-5 py-2 text-sm" : "px-7 py-2.5 text-base"
            }`}
          >
            {ctaButton.text}
          </a>
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-charcoal/95 backdrop-blur-md border-t border-white/10 mt-2">
          <div className="px-4 py-4 space-y-1">
            {isEventPage && (
              <div className="mb-3 pb-3 border-b border-white/10">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-3 py-2.5 text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to VanFest Home
                </Link>
                <span
                  className={`inline-block bg-gradient-to-r ${eventAccent} text-white font-display font-bold px-4 py-1.5 rounded-xl text-sm mt-2`}
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
                    className="block px-3 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : link.children ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                      className="flex items-center justify-between w-full px-3 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-semibold transition-colors"
                    >
                      {link.label}
                      <svg
                        className={`w-4 h-4 text-white/50 transition-transform duration-200 ${mobileExpanded === link.label ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileExpanded === link.label && (
                      <div className="ml-4 space-y-1 mt-1">
                        {link.children.map((child) =>
                          child.href.includes("#") ? (
                          <a
                            key={child.label}
                            href={child.href}
                            className="block px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </a>
                          ) : (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="block px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : link.href.includes("#") ? (
                  <a
                    href={link.href}
                    className="block px-3 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-3 py-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg font-semibold"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── Main Navbar Component (detects v1 vs v2) ─── */

interface NavbarProps {
  config?: NavbarV1Props["config"];
  builderConfig?: NavbarBuilderConfig | null;
  embedded?: boolean;
}

export default function Navbar({ config, builderConfig, embedded }: NavbarProps) {
  if (builderConfig?.version === 2) {
    return <NavbarV2 config={builderConfig} embedded={embedded} />;
  }
  return <NavbarV1 config={config} />;
}
