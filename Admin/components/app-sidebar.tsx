"use client";

import Image from "next/image";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

import {
  IconDashboard,
  IconListDetails,
  IconUser,
  IconBuildingSkyscraper,
  IconCashBanknote,
  IconBuilding,
  IconSettings,
  IconHelp,
  IconSearch,
  IconNews,
  IconNewsOff,
} from "@tabler/icons-react";
import { User } from "@/types/user";
import { title } from "process";

const navData = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    {
      title: "Master Data",
      icon: IconListDetails,
      items: [
        { title: "Properties", url: "/properties", icon: IconListDetails },
        { title: "Agent", url: "/agent", icon: IconUser },
        { title: "Developer", url: "/developer", icon: IconBuildingSkyscraper },
      ],
    },
    {
      title: "Master KPR",
      icon: IconCashBanknote,
      items: [{ title: "Bank", url: "/bank", icon: IconBuilding }],
    },
    {
      title: "Berita",
      icon: IconNews,
      items: [
        { title: "Kategori Berita", url: "/news-category", icon: IconNews },
        { title: "Berita", url: "/news", icon: IconNews },
      ],
    },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & { user: User };

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a
                href="/dashboard"
                aria-label="Go to Dashboard"
                className="flex items-center gap-2"
              >
                <Image src="/logo_bar.svg" width={28} height={28} alt="Logo" />
                <span className="text-sm font-semibold leading-none">
                  Bumi Nirwana
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navData.navMain} />
        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
