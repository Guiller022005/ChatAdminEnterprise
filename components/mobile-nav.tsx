"use client"

import { MessageSquare, ShoppingCart, Package, MoreHorizontal, LayoutDashboard } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const mobileNavItems = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "chats", label: "Chats", icon: MessageSquare, badge: true },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "more", label: "More", icon: MoreHorizontal },
]

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const { conversations } = useApp()
  const unreadChats = conversations.filter((c) => c.unreadCount > 0).length
  const morePages = ["customers", "team", "settings", "profile", "notifications"]
  const isMoreActive = morePages.includes(currentPage)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-card md:hidden">
      {mobileNavItems.map((item) => {
        const isActive =
          item.id === "more" ? isMoreActive : currentPage === item.id
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === "more") {
                onNavigate("customers")
              } else {
                onNavigate(item.id)
              }
            }}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-xs transition-colors",
              isActive
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
            {item.badge && unreadChats > 0 && (
              <span className="absolute right-1 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                {unreadChats}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
