import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "VanFest Admin",
  description: "VanFest CMS Admin Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <Toaster position="top-right" richColors />
    </>
  );
}
