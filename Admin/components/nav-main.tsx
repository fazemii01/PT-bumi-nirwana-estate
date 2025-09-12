"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { IconChevronDown } from "@tabler/icons-react";

export type NavItem = {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  items?: NavItem[];
};

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const isActive = (url?: string) =>
    !!url && (pathname === url || pathname.startsWith(`${url}/`));

  return (
    <>
      {items.map((group) => {
        const GroupIcon = group.icon;

        if (!group.items?.length) {
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(group.url)}
                      className="
                      h-8 text-[13px]
                      [&[data-active=true]]:bg-primary
                      [&[data-active=true]]:text-primary-foreground
                      [&[data-active=true]]:hover:bg-primary/90
                    "
                    >
                      <Link href={group.url ?? "#"} className="truncate">
                        {GroupIcon ? (
                          <GroupIcon className="mr-2 h-4 w-4" />
                        ) : null}
                        <span>{group.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        }

        const defaultOpen = group.items.some((it) => isActive(it.url));

        return (
          <SidebarGroup key={group.title} className="mb-1">
            <Collapsible defaultOpen={defaultOpen} className="group/collap">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="w-full flex items-center justify-between text-left text-[11px] uppercase tracking-wide text-muted-foreground hover:text-foreground px-2 py-1">
                  <span className="flex items-center gap-2">
                    {GroupIcon ? <GroupIcon className="h-4 w-4" /> : null}
                    {group.title}
                  </span>
                  <IconChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/collap:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarGroupContent className="mt-1">
                  <SidebarMenu className="gap-0.5">
                    {group.items.map((child) => {
                      const ChildIcon = child.icon ?? GroupIcon;
                      return (
                        <SidebarMenuItem key={child.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive(child.url)}
                            className={
                              isActive(child.url)
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 [&[data-active=true]]:bg-[var(--primary)] [&[data-active=true]]:text-[var(--primary-foreground)]"
                                : "h-8 text-[13px] pl-7"
                            }
                          >
                            <Link href={child.url ?? "#"} className="truncate">
                              {ChildIcon ? (
                                <ChildIcon className="mr-2 h-3.5 w-3.5" />
                              ) : null}
                              <span>{child.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        );
      })}
    </>
  );
}
