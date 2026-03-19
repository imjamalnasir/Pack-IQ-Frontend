"use client"

import { PackIQLogoIcon } from "@/components/PackIQLogoIcon";


import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Database,
  Newspaper,
  Settings,
  UserStar,
  ShieldUser,
  FileUp,
} from "lucide-react"

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
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { DataManagmentSideBarNav } from "./data-managment-sidebar-nav";

// This is sample data.
const data = {
  user: {
    name: "Pack-IQ Admin",
    email: "admin@packiq.com",
    avatar: "/avatars/shadcn.jpg",
  },

  // Pack-IQ name logo

  teams: [
    {
      name: "Pack-IQ",
      logo: PackIQLogoIcon,
      //logo: GalleryVerticalEnd,
      plan: "EPR Compliance Platform",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Data Management",
      url: "",
      //icon: SquareTerminal,
      icon:Database,
      isActive: true,
      items: [
        {
          title: "Data Dashboard",
          icon:Database,
          url: "/data-management/data-dashboard",
        },
        {
          title: "Upload Center",
          url: "/data-management/upload-center",
        },
        {
          title: "Extraction Review",
          url: "/data-management/extraction-review",
        },
                {
          title: "Data Completeness",
          url: "/data-management/data-completeness",
        },
                        {
          title: "Sales Management",
          url: "#",
        },
      ],
    },
    {
      title: "Compliance",
      url: "#",
      //icon: Bot,
      icon:Newspaper,
      items: [
        {
          title: "Compliance Dashboard",
          url: "/piq-dashboard/compliance-dashboard",
        },
        {
          title: "Compliance Assistant",
          url: "/piq-dashboard/compliance-assistant",
        },
        {
          title: "Report Builder",
          url: "#",
        },
                {
          title: "Report Review",
          url: "#",
        },
      ],
    },
    {
      title: "Administration",
      url: "#",
      //icon: BookOpen,
      icon:Settings2,
      items: [
        {
          title: "Admin Dashboard",
          url: "#",
        },
        {
          title: "Manage Clients",
          url: "#",
        },
        {
          title: "Regulatory Update",
          url: "#",
        },
        {
          title: "System Configuration",
          url: "#",
        },
                {
          title: "Generate Impact Report",
          url: "#",
        },
                {
          title: "Security Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Executive",
      url: "#",
      icon: UserStar,
      items: [
        {
          title: "Executive Dashboard",
          url: "#",
        },
        {
          title: "System Usage Metrics",
          url: "#",
        },
        {
          title: "User Management",
          url: "#",
        },

      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function DataManagmentSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {

 

  return (
    <Sidebar collapsible="icon" {...props}>
       <SidebarHeader className="flex flex-row items-center justify-between p-2">
        <div className="group-data-[collapsible=icon]:hidden">
        <PackIQLogoIcon />
        </div>
                {/* ✅ Toggle button */}
        <SidebarTrigger className="h-8 w-8" />
        { /*<TeamSwitcher teams={data.teams} />*/}
      </SidebarHeader>
      <SidebarContent>
        <DataManagmentSideBarNav items={data.navMain}/>
        { /* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
