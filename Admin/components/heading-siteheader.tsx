"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function HeadingSiteHeader() {
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    if (pathname.startsWith("/properties")) return "Data Properti";
    if (pathname.startsWith("/agent")) return "Data Agent";
    if (pathname.startsWith("/developers")) return "Data Developer";
    if (pathname.startsWith("/dashboard")) return "Dashboard";
    return "Halaman Tidak Dikenal";
  }, [pathname]);

  return <h1 className="text-base font-medium">{pageTitle}</h1>;
}
