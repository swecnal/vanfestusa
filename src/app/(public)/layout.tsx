import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterDivider from "@/components/FooterDivider";
import PermanentPopup from "@/components/PermanentPopup";
import SectionRenderer from "@/components/sections/SectionRenderer";
import type { VehicleStreamConfig } from "@/components/VehicleStream";
import type { FooterBuilderConfig, NavbarBuilderConfig, Section, SavedNavbar } from "@/lib/types";
import { type SiteStyles, EMPTY_SITE_STYLES } from "@/lib/styles";
import { getSupabaseServer } from "@/lib/supabase/server";

interface SiteBehavior {
  hide_navbar?: boolean;
  popup_enabled?: boolean;
  popup_page_id?: string | null;
}

async function getGlobalSettings() {
  try {
    const supabase = getSupabaseServer();
    const { data: rows } = await supabase
      .from("global_settings")
      .select("key, value")
      .in("key", [
        "navbar_config",
        "footer_config",
        "vehicle_stream_config",
        "footer_builder_config",
        "navbar_builder_config",
        "site_behavior",
        "button_styles",
        "link_styles",
        "heading_styles",
        "navbars",
      ]);

    if (!rows) {
      return {
        navbarConfig: null,
        footerConfig: null,
        vehicleStreamConfig: null,
        footerBuilderConfig: null,
        navbarBuilderConfig: null,
        siteBehavior: null,
        siteStyles: EMPTY_SITE_STYLES,
        savedNavbars: [] as SavedNavbar[],
      };
    }

    const map: Record<string, unknown> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }

    return {
      navbarConfig: map.navbar_config || null,
      footerConfig: map.footer_config || null,
      vehicleStreamConfig: map.vehicle_stream_config || null,
      footerBuilderConfig: (map.footer_builder_config as FooterBuilderConfig) || null,
      navbarBuilderConfig: (map.navbar_builder_config as NavbarBuilderConfig) || null,
      siteBehavior: (map.site_behavior as SiteBehavior) || null,
      siteStyles: {
        button_styles: (map.button_styles as SiteStyles["button_styles"]) || EMPTY_SITE_STYLES.button_styles,
        link_styles: (map.link_styles as SiteStyles["link_styles"]) || EMPTY_SITE_STYLES.link_styles,
        heading_styles: (map.heading_styles as SiteStyles["heading_styles"]) || EMPTY_SITE_STYLES.heading_styles,
      },
      savedNavbars: (map.navbars as SavedNavbar[]) || [],
    };
  } catch {
    return {
      navbarConfig: null,
      footerConfig: null,
      vehicleStreamConfig: null,
      footerBuilderConfig: null,
      navbarBuilderConfig: null,
      siteBehavior: null,
      siteStyles: EMPTY_SITE_STYLES,
      savedNavbars: [] as SavedNavbar[],
    };
  }
}

async function getPopupSections(pageId: string): Promise<Section[]> {
  try {
    const supabase = getSupabaseServer();
    const { data: sections } = await supabase
      .from("sections")
      .select("*")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: true });
    return (sections || []).filter((s) => s.is_visible);
  } catch {
    return [];
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    navbarConfig,
    footerConfig,
    vehicleStreamConfig,
    footerBuilderConfig,
    navbarBuilderConfig,
    siteBehavior,
    siteStyles,
    savedNavbars,
  } = await getGlobalSettings();

  const hideNavbar = Boolean(siteBehavior?.hide_navbar);
  const popupEnabled = Boolean(siteBehavior?.popup_enabled && siteBehavior?.popup_page_id);

  const popupSections = popupEnabled && siteBehavior?.popup_page_id
    ? await getPopupSections(siteBehavior.popup_page_id)
    : [];

  // If v2 footer builder config exists, the divider is managed within the footer builder
  const showStandaloneDivider = !footerBuilderConfig?.version;

  return (
    <>
      {!hideNavbar && (
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        <div id="layout-navbar">
          <Navbar config={navbarConfig as any} builderConfig={navbarBuilderConfig} />
        </div>
      )}
      <main>{children}</main>
      {showStandaloneDivider && (
        <FooterDivider config={vehicleStreamConfig as VehicleStreamConfig | null} />
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Footer config={footerConfig as any} builderConfig={footerBuilderConfig} />
      {popupEnabled && popupSections.length > 0 && (
        <PermanentPopup>
          {popupSections.map((section) => (
            <SectionRenderer
              key={section.id}
              section={section}
              siteStyles={siteStyles}
              navbars={savedNavbars}
            />
          ))}
        </PermanentPopup>
      )}
    </>
  );
}
