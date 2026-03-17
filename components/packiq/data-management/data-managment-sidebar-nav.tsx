"use client"

import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function DataManagmentSideBarNav({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {

  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {

          const isOpen = item.items?.some(
            (subItem) => pathname === subItem.url
          )

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>

                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} >
                    {item.icon && <item.icon />}
                    <span className="sidebar-nav-group-heading">{item.title}</span>

                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarMenuSub>

                    {item.items?.map((subItem) => {

                      const isActive = pathname === subItem.url

                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              isActive && "bg-prime-color font-medium  piq-sidebar-nav-link-active"
                            )}
                          >
                            <a className="piq-sidebar-nav-link" href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}

                  </SidebarMenuSub>
                </CollapsibleContent>

              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}