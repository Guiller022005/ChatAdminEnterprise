"use client"

import { Bell } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  chats: "Chats",
  orders: "Orders",
  products: "Products",
  customers: "Customers",
  team: "Team",
  settings: "Settings",
  profile: "Profile",
  notifications: "Notifications",
}

interface TopbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Topbar({ currentPage, onNavigate }: TopbarProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="flex h-14 items-center border-b bg-card px-4">
      <SidebarTrigger className="-ml-1 mr-2" />
      <h1 className="text-lg font-semibold">{pageTitles[currentPage] || "Dashboard"}</h1>
      <div className="ml-auto flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary h-auto p-0"
                  onClick={markAllNotificationsRead}
                >
                  Mark all read
                </Button>
              )}
            </div>
            <Separator />
            <ScrollArea className="h-72">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className={`flex flex-col items-start px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                        !n.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => {
                        markNotificationRead(n.id)
                        if (n.type === "chat") onNavigate("chats")
                        else if (n.type === "order") onNavigate("orders")
                        else onNavigate("notifications")
                      }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-sm font-medium truncate flex-1">{n.title}</span>
                        {!n.read && (
                          <Badge className="bg-primary text-primary-foreground h-1.5 w-1.5 p-0 rounded-full" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.message}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
            <Separator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-sm text-primary"
                onClick={() => onNavigate("notifications")}
              >
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
