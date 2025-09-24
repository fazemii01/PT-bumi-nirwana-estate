"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

export function HeadingSiteHeader() {
  const pathname = usePathname();

  const { pageTitle, linkTo } = useMemo(() => {
    if (pathname.startsWith("/properties")) {
      return {
        pageTitle: "Data Properties",
        linkTo: "/properties",
      };
    }
    if (pathname.startsWith("/building-properties")) {
      return {
        pageTitle: "Data Building",
        linkTo: "/building-properties",
      };
    }
    if (pathname.startsWith("/agent")) {
      return {
        pageTitle: "Data Agents",
        linkTo: "/agent",
      };
    }
    if (pathname.startsWith("/developer")) {
      return {
        pageTitle: "Data Developers",
        linkTo: "/developer",
      };
    }
    if (pathname.startsWith("/dashboard")) {
      return {
        pageTitle: "Data Dashboard",
        linkTo: "/dashboard",
      };
    }
    if (pathname.startsWith("/bank")) {
      return {
        pageTitle: "Data Bank",
        linkTo: "/bank",
      };
    }
    return {
      pageTitle: "Halaman Tidak Dikenal",
      linkTo: "",
    };
  }, [pathname]);

  const isSubPage = linkTo && pathname !== linkTo;

  let subPath = "";
  if (isSubPage) {
    const afterBase = pathname.replace(linkTo, "").replace(/^\//, "");
    const segments = afterBase.split("/");
    subPath = segments.slice(0, 1).join(" ").replace(/-/g, " ");
  }
  return (
    <h1 className="text-base font-medium flex gap-2 items-center">
      {isSubPage ? (
        <>
          <Link href={linkTo} className="text-blue-600 hover:underline">
            {pageTitle}
          </Link>
          <span>|</span>
          <span className="capitalize">{subPath}</span>
        </>
      ) : (
        pageTitle
      )}
    </h1>
  );
}
