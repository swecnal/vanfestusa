import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterDivider from "@/components/FooterDivider";
import type { VehicleStreamConfig } from "@/components/VehicleStream";
import type { FooterBuilderConfig, NavbarBuilderConfig } from "@/lib/types";
import { getSupabaseServer } from "@/lib/supabase/server";

async function getGlobalSettings() {
  try {
    const supabase = getSupabaseServer();
    const { data: rows } = await supabase
      .from("global_settings")
      .select("key, value")
      .in("key", ["navbar_config", "footer_config", "vehicle_stream_config", "footer_builder_config", "navbar_builder_config"]);

    if (!rows) return { navbarConfig: null, footerConfig: null, vehicleStreamConfig: null, footerBuilderConfig: null, navbarBuilderConfig: null };

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
    };
  } catch {
    return { navbarConfig: null, footerConfig: null, vehicleStreamConfig: null, footerBuilderConfig: null, navbarBuilderConfig: null };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { navbarConfig, footerConfig, vehicleStreamConfig, footerBuilderConfig, navbarBuilderConfig } = await getGlobalSettings();

  // If v2 footer builder config exists, the divider is managed within the footer builder
  const showStandaloneDivider = !footerBuilderConfig?.version;

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Navbar config={navbarConfig as any} builderConfig={navbarBuilderConfig} />
      <main>{children}</main>
      {showStandaloneDivider && (
        <FooterDivider config={vehicleStreamConfig as VehicleStreamConfig | null} />
      )}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Footer config={footerConfig as any} builderConfig={footerBuilderConfig} />
    </>
  );
}
