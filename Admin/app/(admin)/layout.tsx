import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { ActiveThemeProvider } from "@/components/active-theme";
import { META_THEME_COLORS } from "@/lib/config";
import { fontVariables } from "@/lib/font";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ThemeInitializer from "@/components/theme-initializer";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { AdminLayoutClient } from "@/components/layout/admin-layout-client";
import ThemeWrapper from "@/components/theme-wrapper";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  return (
    <html>
      <head>
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body>
        <AuthProvider>
          <ThemeInitializer />
          <ThemeWrapper>
            <ActiveThemeProvider>
              <AdminLayoutClient>{children}</AdminLayoutClient>
            </ActiveThemeProvider>
          </ThemeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
