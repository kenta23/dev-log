"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TerminalSquareIcon, BookOpenIcon, Settings2Icon, PlusCircleIcon, ChartBarIcon, PlusSquareIcon } from "lucide-react"
import { usePathname } from "next/navigation"

// This is sample data.

interface SidebarItem { 
   title:  string;
   url: string;
   icon: React.ReactNode;
   isActive?: boolean;
   brand: { 
       name: string;
       logo: React.ReactNode;
       plan: string;
   }[]
}

const data: { brand: SidebarItem['brand']; navMain: Omit<SidebarItem, 'brand'>[]; } = {
  brand: [
    { 
      name: "Dev Log",
      logo: <TerminalSquareIcon />,
      plan: "Free",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: (
        <TerminalSquareIcon
        />
      ),
      isActive: true, 
    },

    {
      title: "New Entry",
      url: "/new-entry",
      icon: (
        <PlusSquareIcon
        />
      ),
      isActive: false,
    },
    {
      title: "Analytics",
      url: "#",
      icon: (
        <ChartBarIcon
        />
      ),
      isActive: false,
    },
  ],
}

const user = { 
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://github.com/shadcn.png",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const pathName = usePathname();
  
  const dataWithActiveStates = data.navMain.map((item) => ({  
    ...item,
    isActive: item.url === pathName
  }));


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.brand} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={dataWithActiveStates} />
      
      </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
