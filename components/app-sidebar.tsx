"use client"

import {
  LayoutDashboard,
  MessageSquare,
  ShoppingCart,
  Package,
  Users,
  UserCog,
  Settings,
  User,
  Bot,
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const adminNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "chats", label: "Chats", icon: MessageSquare, badge: true },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
]

const adminManageNav = [
  { id: "team", label: "Team", icon: UserCog },
  { id: "settings", label: "Settings", icon: Settings },
]

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { user, conversations } = useApp()
  const unreadChats = conversations.filter((c) => c.unreadCount > 0).length

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">ChatAdmin</span>
                <span className="truncate text-xs text-muted-foreground">Enterprise</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={currentPage === item.id}
                    onClick={() => onNavigate(item.id)}
                    tooltip={item.label}
                  >
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge && unreadChats > 0 && (
                    <SidebarMenuBadge className="bg-primary text-primary-foreground rounded-full text-[10px] min-w-5 h-5 flex items-center justify-center">
                      {unreadChats}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user.role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Manage</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminManageNav.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={currentPage === item.id}
                      onClick={() => onNavigate(item.id)}
                      tooltip={item.label}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              isActive={currentPage === "profile"}
              onClick={() => onNavigate("profile")}
              tooltip="Profile"
            >
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
