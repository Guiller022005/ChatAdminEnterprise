"use client"

import { useState } from "react"
import { Bot, Globe, Bell, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SettingsPage() {
  const [aiEnabled, setAiEnabled] = useState(true)
  const [autoAssign, setAutoAssign] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [soundNotifs, setSoundNotifs] = useState(false)

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="text-xs">
            <Globe className="size-3.5 mr-1.5" /> General
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">
            <Bot className="size-3.5 mr-1.5" /> AI Settings
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="size-3.5 mr-1.5" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs">
            <Shield className="size-3.5 mr-1.5" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Information</CardTitle>
              <CardDescription>Manage your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm">Business Name</Label>
                  <Input defaultValue="Acme Corp" className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Support Email</Label>
                  <Input defaultValue="support@acmecorp.com" className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Phone Number</Label>
                  <Input defaultValue="+1 555-0100" className="h-9" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Timezone</Label>
                  <Select defaultValue="america-new-york">
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-new-york">America/New York</SelectItem>
                      <SelectItem value="america-chicago">America/Chicago</SelectItem>
                      <SelectItem value="america-los-angeles">America/Los Angeles</SelectItem>
                      <SelectItem value="europe-london">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Chatbot Configuration</CardTitle>
              <CardDescription>Configure how the AI handles conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Enable AI Chatbot</Label>
                  <p className="text-xs text-muted-foreground">Let AI handle incoming conversations</p>
                </div>
                <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Auto-assign to agents</Label>
                  <p className="text-xs text-muted-foreground">Automatically route complex queries to human agents</p>
                </div>
                <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm">AI Model</Label>
                <Select defaultValue="gpt4">
                  <SelectTrigger className="h-9 w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt35">GPT-3.5</SelectItem>
                    <SelectItem value="claude">Claude 3.5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Response Tone</Label>
                <Select defaultValue="professional">
                  <SelectTrigger className="h-9 w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive email alerts for important events</p>
                </div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Sound Notifications</Label>
                  <p className="text-xs text-muted-foreground">Play sound for new messages</p>
                </div>
                <Switch checked={soundNotifs} onCheckedChange={setSoundNotifs} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Current Password</Label>
                <Input type="password" className="h-9 max-w-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">New Password</Label>
                <Input type="password" className="h-9 max-w-xs" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Confirm New Password</Label>
                <Input type="password" className="h-9 max-w-xs" />
              </div>
              <Button size="sm">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
