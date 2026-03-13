import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FooterDivider from "@/components/FooterDivider";
import type { VehicleStreamConfig } from "@/components/VehicleStream";
import { getSupabaseServer } from "@/lib/supabase/server";

async function getGlobalSetting(key: string) {
  try {
    const supabase = getSupabaseServer();
    const { data } = await supabase
      .from("global_settings")
      .select("value")
      .eq("key", key)
      .single();
    return data?.value || null;
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [navbarConfig, footerConfig, vehicleStreamConfig] = await Promise.all([
    getGlobalSetting("navbar_config"),
    getGlobalSetting("footer_config"),
    getGlobalSetting("vehicle_stream_config"),
  ]);

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Navbar config={navbarConfig as any} />
      <main>{children}</main>
      <FooterDivider config={vehicleStreamConfig as VehicleStreamConfig | null} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Footer config={footerConfig as any} />
    </>
  );
}
