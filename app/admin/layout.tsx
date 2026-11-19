import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import "@/components/admin/admin-workspace.css";
import "@/components/admin/admin-single-sidebar.css";

export const metadata: Metadata = {
  title: { default: "Admin Workspace", template: "%s | SHoP Admin" },
  robots: { index: false, follow: false, noarchive: true },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shop-admin min-h-screen bg-[#f5f4f0] text-[#20231f] md:flex">
      <AdminSidebar />
      <div className="shop-admin-content min-w-0 flex-1">{children}</div>
    </div>
  );
}
