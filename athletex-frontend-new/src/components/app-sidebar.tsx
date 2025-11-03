"use client";

import * as React from "react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Import sidebar constants from constants folder
import { ScrollArea } from "./ui/scroll-area";
import { SingleMenu } from "./single-menus";
import { SingleMenuItems } from "@/constants/single-menus";
import { useGetUser } from "@/utils/getUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData, isLoading } = useGetUser();
  const role = userData?.data.user.role;

  const items = React.useMemo(() => {
    if (!role) return SingleMenuItems;

    if (role === "COACH") {
      // Coach should not see Daily logs and analyze
      return SingleMenuItems.filter(
        (i) =>
          i.url !== "/dashboard/daily" &&
          i.url !== "/dashboard/analyze" + "/:id"
      );
    }

    if (role === "ATHELETE") {
      // Athlete should not see Athletes management
      return SingleMenuItems.filter((i) => i.url !== "/dashboard/athletes");
    }

    return SingleMenuItems;
  }, [role]);

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-gray-200/70">
      <SidebarHeader>Logo</SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="overflow-y-auto">
          <SingleMenu item={items} />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
