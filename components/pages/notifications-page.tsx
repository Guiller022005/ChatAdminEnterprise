"use client"

import React from "react"

import {
  MessageSquare,
  ShoppingCart,
  AlertTriangle,
  Settings,
  CheckCheck,
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

const typeIcons: Record<string, { icon: React.ElementType; color: string }> = {
  chat: { icon: MessageSquare, color: "bg-primary/10 text-primary" },
  order: { icon: ShoppingCart, color: "bg-success/10 text-success" },
  stock: { icon: AlertTriangle, color: "bg-warning/10 text-warning" },
  system: { icon: Settings, color: "bg-muted text-muted-foreground" },
}

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {unreadCount} unread
              </span>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary"
              onClick={markAllNotificationsRead}
            >
              <CheckCheck className="size-3.5 mr-1" /> Mark all read
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => {
                const cfg = typeIcons[n.type] || typeIcons.system
                return (
                  <button
                    key={n.id}
                    type="button"
                    className={cn(
                      "flex items-start gap-3 px-6 py-4 text-left transition-colors hover:bg-muted/50 border-b last:border-b-0",
                      !n.read && "bg-primary/[0.03]"
                    )}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className={cn("rounded-lg p-2 shrink-0 mt-0.5", cfg.color)}>
                      <cfg.icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-sm truncate", !n.read && "font-semibold")}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="size-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
