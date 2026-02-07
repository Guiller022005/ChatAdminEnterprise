"use client"

import { teamMembers } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"

const statusColors: Record<string, { dot: string; text: string }> = {
  online: { dot: "bg-success", text: "text-success" },
  away: { dot: "bg-warning", text: "text-warning" },
  offline: { dot: "bg-muted-foreground", text: "text-muted-foreground" },
}

export function TeamPage() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Members ({teamMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {teamMembers.map((member) => {
              const sc = statusColors[member.status]
              return (
                <div
                  key={member.id}
                  className="flex items-start gap-4 rounded-xl border p-4"
                >
                  <div className="relative">
                    <Avatar className="size-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 size-3 rounded-full border-2 border-card",
                        sc.dot
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{member.name}</p>
                      <Badge
                        variant="secondary"
                        className="text-[10px] capitalize shrink-0"
                      >
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className={cn("flex items-center gap-1 capitalize", sc.text)}>
                        <span className={cn("size-1.5 rounded-full", sc.dot)} />
                        {member.status}
                      </span>
                      <span>Joined {format(new Date(member.invitedAt), "MMM yyyy")}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
