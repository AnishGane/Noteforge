import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import React from "react";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  console.log(cookieStore);
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="flex-1">{children}</main>
    </SidebarProvider>
  );
}

export default DashboardLayout;
