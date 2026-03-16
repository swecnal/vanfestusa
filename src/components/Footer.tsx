import Link from "next/link";
import type {
  FooterBuilderConfig,
  FooterColumnConfig,
  FooterElement,
  FooterLogoTextData,
  FooterTextAreaData,
  FooterSocialIconsData,
  FooterLinkListData,
  FooterContactInfoData,
} from "@/lib/types";

interface FooterConfig {
  brand?: { tagline?: string };
  socialLinks?: Array<{ platform: string; url: string }>;
  columns?: Array<{ title: string; links: Array<{ label: string; href: string; external?: boolean }> }>;
  contactInfo?: { email?: string; phone?: string; instagram?: string };
}

const SOCIAL_ICONS: Record<string, string> = {
  instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  facebook: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  twitter: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
};

const ICON_SIZE: Record<string, string> = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-11 h-11",
};

const SVG_SIZE: Record<string, string> = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const TEXT_ALIGN: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const VERTICAL_ALIGN: Record<string, string> = {
  top: "justify-start",
  center: "justify-center",
  bottom: "justify-end",
};

/* ─── V2 Element Renderers ─── */

function RenderLogoText({ data, textColor, accentColor }: { data: FooterLogoTextData; textColor: string; accentColor: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {data.logoSrc && (
          <img src={data.logoSrc} alt={data.brandName} style={{ height: data.logoHeight || 40 }} />
        )}
        {data.brandName && (
          <span className="font-display font-bold text-xl" style={{ color: textColor }}>{data.brandName}</span>
        )}
      </div>
      {data.tagline && (
        <div className="text-sm leading-relaxed site-html-content" style={{ color: `${textColor}99` }} dangerouslySetInnerHTML={{ __html: data.tagline }} />
      )}
      {data.subtitle && (
        <div className="text-xs mt-2 italic font-accent site-html-content" style={{ color: `${textColor}66` }} dangerouslySetInnerHTML={{ __html: data.subtitle }} />
      )}
    </div>
  );
  void accentColor;
}

function RenderTextArea({ data, textColor }: { data: FooterTextAreaData; textColor: string }) {
  return (
    <div className="site-html-content" style={{ color: `${textColor}99` }} dangerouslySetInnerHTML={{ __html: data.html }} />
  );
}

function RenderSocialIcons({ data, accentColor }: { data: FooterSocialIconsData; accentColor: string }) {
  const iconSize = ICON_SIZE[data.iconSize] || ICON_SIZE.md;
  const svgSize = SVG_SIZE[data.iconSize] || SVG_SIZE.md;

  return (
    <div className="flex flex-wrap" style={{ gap: data.spacing || 12 }}>
      {data.links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target={link.newTab ? "_blank" : undefined}
          rel={link.newTab ? "noopener noreferrer" : undefined}
          className={`${iconSize} rounded-full bg-white/10 flex items-center justify-center transition-colors`}
          style={{ color: "white" }}
          aria-label={link.platform}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = accentColor; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)"; }}
        >
          <svg className={svgSize} fill="currentColor" viewBox="0 0 24 24">
            <path d={SOCIAL_ICONS[link.platform] || SOCIAL_ICONS.instagram} />
          </svg>
        </a>
      ))}
    </div>
  );
}

function RenderLinkList({ data, textColor, accentColor }: { data: FooterLinkListData; textColor: string; accentColor: string }) {
  return (
    <div>
      {data.headerHtml && (
        <h3
          className="font-display font-bold text-sm uppercase tracking-wider mb-4 site-html-content"
          style={{ color: accentColor }}
          dangerouslySetInnerHTML={{ __html: data.headerHtml }}
        />
      )}
      <ul style={{ gap: data.spacing || 8 }} className="flex flex-col">
        {data.links.map((link) => (
          <li key={link.id}>
            {link.newTab ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors"
                style={{ color: `${textColor}99` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${textColor}99`; }}
              >
                {link.text}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm transition-colors"
                style={{ color: `${textColor}99` }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${textColor}99`; }}
              >
                {link.text}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RenderContactInfo({ data, textColor, accentColor }: { data: FooterContactInfoData; textColor: string; accentColor: string }) {
  return (
    <ul className="space-y-3 text-sm" style={{ color: `${textColor}99` }}>
      {data.items.map((item) => (
        <li key={item.id}>
          {item.href ? (
            <a
              href={item.href}
              target={item.type === "instagram" || item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.type === "instagram" || item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="transition-colors"
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = textColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = `${textColor}99`; }}
            >
              {item.value}
            </a>
          ) : (
            <span>{item.value}</span>
          )}
        </li>
      ))}
    </ul>
  );
  void accentColor;
}

function RenderElement({ element, textColor, accentColor }: { element: FooterElement; textColor: string; accentColor: string }) {
  switch (element.type) {
    case "logo_text":
      return <RenderLogoText data={element.data as FooterLogoTextData} textColor={textColor} accentColor={accentColor} />;
    case "text_area":
      return <RenderTextArea data={element.data as FooterTextAreaData} textColor={textColor} />;
    case "social_icons":
      return <RenderSocialIcons data={element.data as FooterSocialIconsData} accentColor={accentColor} />;
    case "link_list":
      return <RenderLinkList data={element.data as FooterLinkListData} textColor={textColor} accentColor={accentColor} />;
    case "contact_info":
      return <RenderContactInfo data={element.data as FooterContactInfoData} textColor={textColor} accentColor={accentColor} />;
    default:
      return null;
  }
}

function RenderColumn({ column, textColor, accentColor }: { column: FooterColumnConfig; textColor: string; accentColor: string }) {
  return (
    <div className={`flex flex-col gap-4 ${TEXT_ALIGN[column.alignment] || ""} ${VERTICAL_ALIGN[column.verticalAlign] || ""}`}>
      {column.elements.map((element) => (
        <RenderElement key={element.id} element={element} textColor={textColor} accentColor={accentColor} />
      ))}
    </div>
  );
}

/* ─── V2 Footer Renderer ─── */

function FooterV2({ config }: { config: FooterBuilderConfig }) {
  const { columns, columnCount, columnGap, backgroundColor, textColor, accentColor, paddingY, paddingX, bottomBar } = config;
  const visibleColumns = columns.slice(0, columnCount);

  return (
    <footer style={{ backgroundColor, color: textColor }}>
      <div
        className="mx-auto max-w-7xl"
        style={{ paddingTop: paddingY, paddingBottom: paddingY, paddingLeft: paddingX, paddingRight: paddingX }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: columnGap,
            gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
          }}
        >
          {visibleColumns.map((col) => (
            <RenderColumn key={col.id} column={col} textColor={textColor} accentColor={accentColor} />
          ))}
        </div>

        {bottomBar.enabled && (
          <div
            className="mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
            style={{ borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: `${textColor}1a` }}
          >
            {bottomBar.copyrightHtml && (
              <p className="text-xs" style={{ color: `${textColor}66` }} dangerouslySetInnerHTML={{ __html: bottomBar.copyrightHtml }} />
            )}
            {bottomBar.legalHtml && (
              <p className="text-xs" style={{ color: `${textColor}4d` }} dangerouslySetInnerHTML={{ __html: bottomBar.legalHtml }} />
            )}
          </div>
        )}
      </div>

      {/* Responsive grid override */}
      <style>{`
        @media (min-width: 1024px) {
          footer > div > .grid { grid-template-columns: repeat(${columnCount}, minmax(0, 1fr)) !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          footer > div > .grid { grid-template-columns: repeat(${Math.min(columnCount, 2)}, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </footer>
  );
}

/* ─── V1 Footer Renderer (existing) ─── */

function FooterV1({ config }: { config?: FooterConfig | null }) {
  const tagline = config?.brand?.tagline || "The ULTIMATE vanlife experience!";
  const socialLinks = config?.socialLinks || [
    { platform: "instagram", url: "https://instagram.com/vanfestusa" },
    { platform: "facebook", url: "https://facebook.com/vanfestusa" },
  ];
  const columns = config?.columns || [
    {
      title: "Quick Links",
      links: [
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
        { label: "About", href: "/about" },
        { label: "FAQ", href: "/faq" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Get Involved",
      links: [
        { label: "Sponsors & Vendors", href: "/sponsors-vendors" },
        { label: "Exhibit Your Rig", href: "/exhibit-your-rig" },
        { label: "Jobs @ VanFest", href: "/jobs" },
        { label: "Merch", href: "/merch" },
      ],
    },
  ];
  const contact = config?.contactInfo || {
    email: "hello@vanfestusa.com",
    phone: "805.826.3378",
    instagram: "@vanfestusa",
  };

  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns.length + 2} gap-10`}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/vanfest-logo.png" alt="VanFest" className="h-10" />
              <span className="font-display font-bold text-xl">VanFest</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{tagline}</p>
            <p className="text-white/40 text-xs mt-2 italic font-accent">
              miles &bull; moments &bull; music &bull; memories
            </p>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((sl, i) => (
                <a
                  key={i}
                  href={sl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-teal flex items-center justify-center transition-colors"
                  aria-label={sl.platform}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={SOCIAL_ICONS[sl.platform] || SOCIAL_ICONS.instagram} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic columns */}
          {columns.map((col, ci) => (
            <div key={ci}>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-teal">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link, li) => (
                  <li key={li}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-sm uppercase tracking-wider mb-4 text-teal">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.phone && (
                <li>
                  <a href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`} className="hover:text-white transition-colors">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.instagram && (
                <li>
                  <a
                    href={`https://instagram.com/${contact.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {contact.instagram}
                  </a>
                </li>
              )}
            </ul>
            <ul className="space-y-2 text-sm text-white/40 mt-5">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conduct
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            &copy;2020 - {new Date().getFullYear()} VanFest - All Rights Reserved.
          </p>
          <p className="text-white/30 text-xs">
            VanFest is a nomadic event series brand run by Ever Onward LLC, a Massachusetts-based Limited Liability Company
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Footer Component (detects v1 vs v2) ─── */

export default function Footer({
  config,
  builderConfig,
}: {
  config?: FooterConfig | null;
  builderConfig?: FooterBuilderConfig | null;
}) {
  // V2 takes priority
  if (builderConfig?.version === 2) {
    return <FooterV2 config={builderConfig} />;
  }
  return <FooterV1 config={config} />;
}
