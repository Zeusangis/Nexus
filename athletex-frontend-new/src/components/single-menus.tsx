"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Icon } from "iconsax-reactjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function SingleMenu({
  item,
}: {
  item: {
    name: string;
    url: string;
    icon: LucideIcon | Icon;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        {item.map((item) => {
          const isRootDashboard = item.url === "/dashboard";
          const isActive = isRootDashboard
            ? pathname === item.url
            : pathname.startsWith(item.url);

          console.log(
            `${item.url} ${isActive ? "active" : "inactive"} ${pathname} `
          );

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={cn(
                  isActive &&
                    "bg-primary text-white rounded-md hover:bg-primary hover:text-white"
                )}
              >
                <a href={item.url}>
                  <item.icon className="!size-5" />
                  <span className="text-[14px]">{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
