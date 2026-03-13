import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VehicleStream from "@/components/VehicleStream";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <VehicleStream />
      <Footer />
    </>
  );
}
