import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode_toggle";
import { ThemeSelector } from "@/components/theme-selector";
import { HeadingSiteHeader } from "@/components/heading-siteheader";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-2 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-1 sm:mx-2 data-[orientation=vertical]:h-4" />
        <HeadingSiteHeader className="truncate" />
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Mobile: Show only essential toggle */}
          <div className="block sm:hidden">
            <ModeToggle />
          </div>

          {/* Desktop: Show both toggles */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            <ThemeSelector />
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
