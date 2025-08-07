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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={META_THEME_COLORS.light} />
      </head>
      <body
        suppressHydrationWarning
        className={cn("text-foreground group/body overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]", fontVariables)}
      >
        <AuthProvider>
          <ThemeInitializer />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ActiveThemeProvider>
              <AdminLayoutClient>{children}</AdminLayoutClient>
            </ActiveThemeProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
