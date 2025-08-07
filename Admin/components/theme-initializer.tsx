"use client";

import { useEffect } from "react";
import { META_THEME_COLORS } from "@/lib/config";

export default function ThemeInitializer() {
  useEffect(() => {
    try {
      if (localStorage.theme === "dark" || ((!("theme" in localStorage) || localStorage.theme === "system") && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_THEME_COLORS.dark);
      }

      if (localStorage.layout) {
        document.documentElement.classList.add("layout-" + localStorage.layout);
      }
    } catch (_) {}
  }, []);

  return null;
}
