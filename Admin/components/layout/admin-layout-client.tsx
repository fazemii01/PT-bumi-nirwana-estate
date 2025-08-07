"use client";

import { useAuth } from "@/app/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import React, { ReactNode } from "react";
import { redirect } from "next/navigation";
import ThemeInitializer from "@/components/theme-initializer";

// Komponen klien ini akan menggunakan data dari AuthContext
export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Jika user tidak ada (misalnya token sudah expired),
  // Anda bisa melakukan redirect di sini, atau biarkan AuthProvider menanganinya.
  if (!user) {
    redirect("/login"); // Redirect ini harus ditangani oleh Next.js client-side router
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <main className="px-4 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
