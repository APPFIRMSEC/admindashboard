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
  IconHelp,
  IconSearch,
  IconInnerShadowTop,
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

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
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
  ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                <span className="text-base font-semibold">Admin Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
