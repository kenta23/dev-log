"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { CollectionSwitcher } from "@/components/collection-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BookOpenIcon,
  Settings2Icon,
  PlusCircleIcon,
  ChartBarIcon,
  PlusSquareIcon,
  Folders,
} from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCollections } from "@/actions/data";
import { useSession } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathName = usePathname();
  const { data: sessionData } = useSession();
  const authUser = sessionData?.user ?? null;
  const params = useParams<{ collectionId?: string }>();

  // const dataWithActiveStates = data.navMain.map((item) => ({
  //   ...item,
  //   isActive: item.url === pathName,
  // }));

  // Fetch collections (shares the TanStack Query cache with CollectionSwitcher)
  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => await getCollections(),
  });

  // 1. Get current collectionId from URL params, or fallback to the first available collection
  const activeCollectionId = params?.collectionId;

  // 2. Build the dynamic new entry URL
  const newEntryUrl = activeCollectionId
    ? `/collections/new-entry/${activeCollectionId}`
    : "/new-entry";

  const navMainItems = [
    {
      title: "Dashboard",
      url: `/dashboard`,
      icon: <TerminalSquareIcon />,
      isActive: pathName === "/" || pathName === `/dashboard`,
    },
    {
      title: "New Entry",
      url: newEntryUrl,
      icon: <PlusSquareIcon />,
      isActive: pathName.includes("/new-entry"),
    },
    {
      title: "Collections",
      url: "/collections",
      icon: <Folders />,
      isActive: pathName === "/collections",
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: <ChartBarIcon />,
      isActive: pathName === "/analytics",
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <CollectionSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={authUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
