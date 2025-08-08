import "../globals.css";
import { ActiveThemeProvider } from "@/components/active-theme";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { AdminLayoutClient } from "@/components/layout/admin-layout-client";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) {
    redirect("/login");
  }

  return (
    <AuthProvider>
      <ActiveThemeProvider>
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </ActiveThemeProvider>
    </AuthProvider>
  );
}
