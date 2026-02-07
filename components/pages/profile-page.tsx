"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ProfilePage() {
  const { user } = useApp()

  return (
    <div className="p-4 md:p-6 max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Profile</CardTitle>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs capitalize">{user.role}</Badge>
                <span className="flex items-center gap-1 text-xs text-success">
                  <span className="size-1.5 rounded-full bg-success" />
                  Online
                </span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm">Full Name</Label>
              <Input defaultValue={user.name} className="h-9" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Email</Label>
              <Input defaultValue={user.email} className="h-9" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm">Save Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
