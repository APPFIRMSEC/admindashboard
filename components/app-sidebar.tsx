"use client"

import * as React from "react"
import Link from "next/link"
import {
  IconDashboard,
  IconFileDescription,
  IconMicrophone,
  IconPhoto,
  IconSettings,
  IconUsers,
  IconInnerShadowTop,
  IconStar,
  IconEdit,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSiteContext } from "@/contexts/site-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { currentSite } = useSiteContext();

  const appFirmSecNavMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Edit Home Page",
      url: "/edit-home",
      icon: IconEdit,
    },
    {
      title: "Featured Post",
      url: "/featured-posts",
      icon: IconStar,
    },
    {
      title: "Blog Posts",
      url: "/blogs",
      icon: IconFileDescription,
    },
    {
      title: "Podcasts",
      url: "/podcasts",
      icon: IconMicrophone,
    },
    {
      title: "Media Library",
      url: "/media",
      icon: IconPhoto,
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
    },
  ];

  const ennieBoatEngNavMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Edit Home Page",
      url: "/edit-home",
      icon: IconEdit,
    },
    {
      title: "Featured Post",
      url: "/featured-posts",
      icon: IconStar,
    },
    {
      title: "Blog Posts",
      url: "/blogs",
      icon: IconFileDescription,
    },
    {
      title: "Media Library",
      url: "/media",
      icon: IconPhoto,
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
    },
  ];

  const navMain = currentSite === "appfirmsec" ? appFirmSecNavMain : ennieBoatEngNavMain;

  const data = {
    user: {
      name: "Admin",
      email: "admin@example.com",
      avatar: "/avatars/admin.jpg",
    },
    navSecondary: [
      {
        title: "Site Settings",
        url: "/settings",
        icon: IconSettings,
      },
    ],
    documents: [
      {
        name: "Draft Posts",
        url: "/blogs?status=draft",
        icon: IconFileDescription,
      },
      {
        name: "Scheduled Posts",
        url: "/blogs?status=scheduled",
        icon: IconFileDescription,
      },
      {
        name: "Published Posts",
        url: "/blogs?status=published",
        icon: IconFileDescription,
      },
    ],
  }

  const siteName = currentSite === "appfirmsec" ? "AppFirmSec" : "EnnieBoatEng";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{siteName} Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
