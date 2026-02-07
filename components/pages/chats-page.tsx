"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  Filter,
  Bot,
  UserCheck,
  Send,
  HandMetal,
  RotateCcw,
  X,
  ChevronLeft,
  StickyNote,
  Info,
  UserCircle,
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import type { Conversation, ConversationStatus, ConversationMode } from "@/lib/types"
import { teamMembers } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow, format } from "date-fns"

interface ChatsPageProps {
  selectedConversation: string | null
  onSelectConversation: (id: string | null) => void
}

const statusColors: Record<ConversationStatus, string> = {
  open: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
  closed: "bg-muted text-muted-foreground",
}

const priorityColors: Record<string, string> = {
  low: "border-muted-foreground/30 text-muted-foreground",
  medium: "border-primary/30 text-primary",
  high: "border-warning/30 text-warning",
  urgent: "border-destructive/30 text-destructive",
}

const modeColors: Record<ConversationMode, { bg: string; text: string }> = {
  ai: { bg: "bg-primary/10", text: "text-primary" },
  human: { bg: "bg-success/10", text: "text-success" },
}

export function ChatsPage({
  selectedConversation,
  onSelectConversation,
}: ChatsPageProps) {
  const { conversations } = useApp()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [modeFilter, setModeFilter] = useState<string>("all")

  const filtered = conversations.filter((c) => {
    const matchSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.customerPhone.includes(search) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || c.status === statusFilter
    const matchMode = modeFilter === "all" || c.mode === modeFilter
    return matchSearch && matchStatus && matchMode
  })

  const selected = conversations.find((c) => c.id === selectedConversation)

  return (
    <div className="flex h-[calc(100svh-3.5rem-4rem)] md:h-[calc(100svh-3.5rem)]">
      {/* Conversation List */}
      <div
        className={cn(
          "flex flex-col border-r w-full md:w-80 lg:w-96 shrink-0",
          selected ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-3 space-y-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <Filter className="size-3 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="human">Human</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <ScrollArea className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
              <Search className="size-8 mb-2 opacity-50" />
              No conversations found
            </div>
          ) : (
            <div className="flex flex-col">
              {filtered.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={conv.id === selectedConversation}
                  onClick={() => onSelectConversation(conv.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Detail */}
      {selected ? (
        <ChatDetail
          conversation={selected}
          onBack={() => onSelectConversation(null)}
        />
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Bot className="size-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Select a conversation to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ConversationListItem({
  conversation: c,
  isSelected,
  onClick,
}: {
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-3 text-left hover:bg-muted/50 transition-colors border-b",
        isSelected && "bg-accent"
      )}
    >
      <Avatar className="size-9 shrink-0 mt-0.5">
        <AvatarFallback className="text-xs bg-muted">
          {c.customerName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium truncate">{c.customerName}</span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(c.lastMessageAt), { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <Badge className={cn("h-5 text-[10px] px-1.5", statusColors[c.status])}>
            {c.status}
          </Badge>
          <Badge
            variant="outline"
            className={cn("h-5 text-[10px] px-1.5", modeColors[c.mode].text)}
          >
            {c.mode === "ai" ? (
              <>
                <Bot className="size-2.5 mr-0.5" /> AI
              </>
            ) : (
              <>
                <UserCheck className="size-2.5 mr-0.5" /> Human
              </>
            )}
          </Badge>
          {c.unreadCount > 0 && (
            <span className="ml-auto flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
              {c.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

function ChatDetail({
  conversation,
  onBack,
}: {
  conversation: Conversation
  onBack: () => void
}) {
  const {
    updateConversationStatus,
    updateConversationMode,
    addMessage,
    user,
  } = useApp()
  const [message, setMessage] = useState("")
  const [showTakeoverDialog, setShowTakeoverDialog] = useState(false)
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [returnReason, setReturnReason] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages.length])

  const handleSend = () => {
    if (!message.trim()) return
    addMessage(conversation.id, message.trim(), "human")
    setMessage("")
  }

  const handleTakeover = () => {
    updateConversationMode(conversation.id, "human", user.id)
    setShowTakeoverDialog(false)
  }

  const handleReturnToAI = () => {
    updateConversationMode(conversation.id, "ai")
    setReturnReason("")
    setShowReturnDialog(false)
  }

  const quickReplies = [
    "I'll look into this right away.",
    "Thank you for your patience.",
    "Could you provide more details?",
    "Your issue has been resolved.",
  ]

  return (
    <div className="flex flex-1 flex-col min-w-0">
      {/* Chat Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={onBack}>
          <ChevronLeft className="size-4" />
        </Button>
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-xs bg-muted">
            {conversation.customerName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{conversation.customerName}</p>
          <p className="text-xs text-muted-foreground">{conversation.customerPhone}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            className={cn(
              "text-[10px]",
              modeColors[conversation.mode].bg,
              modeColors[conversation.mode].text
            )}
            variant="outline"
          >
            {conversation.mode === "ai" ? "AI Active" : "Human Active"}
          </Badge>
          <Select
            value={conversation.status}
            onValueChange={(v) =>
              updateConversationStatus(conversation.id, v as ConversationStatus)
            }
          >
            <SelectTrigger className="h-7 text-xs w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Takeover Banner */}
      {conversation.mode === "human" && (
        <div className="flex items-center justify-between bg-success/10 px-4 py-2 text-sm">
          <span className="text-success font-medium flex items-center gap-1.5">
            <UserCheck className="size-4" /> Human takeover active
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-transparent"
            onClick={() => setShowReturnDialog(true)}
          >
            <RotateCcw className="size-3 mr-1" /> Return to AI
          </Button>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Messages area */}
        <div className="flex flex-1 flex-col min-w-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3 max-w-2xl mx-auto">
              {conversation.messages.map((msg) => {
                const isCustomer = msg.sender === "customer"
                const isSystem = msg.sender === "system"
                const isAi = msg.sender === "ai"

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <span className="text-[11px] text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        {msg.content}
                      </span>
                    </div>
                  )
                }

                return (
                  <div
                    key={msg.id}
                    className={cn("flex gap-2", isCustomer ? "justify-start" : "justify-end")}
                  >
                    {isCustomer && (
                      <Avatar className="size-7 shrink-0 mt-1">
                        <AvatarFallback className="text-[10px] bg-muted">
                          {msg.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2",
                        isCustomer
                          ? "bg-muted text-foreground rounded-bl-sm"
                          : isAi
                            ? "bg-primary/10 text-foreground rounded-br-sm"
                            : "bg-primary text-primary-foreground rounded-br-sm"
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-medium opacity-70">
                          {isAi && (
                            <Bot className="inline size-2.5 mr-0.5" />
                          )}
                          {msg.senderName}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p
                        className={cn(
                          "text-[10px] mt-1 opacity-50",
                          !isCustomer && !isAi && "text-primary-foreground"
                        )}
                      >
                        {format(new Date(msg.timestamp), "h:mm a")}
                      </p>
                    </div>
                    {!isCustomer && (
                      <Avatar className="size-7 shrink-0 mt-1">
                        <AvatarFallback
                          className={cn(
                            "text-[10px]",
                            isAi ? "bg-primary/10 text-primary" : "bg-success/10 text-success"
                          )}
                        >
                          {isAi ? <Bot className="size-3.5" /> : msg.senderName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Composer */}
          <div className="border-t p-3">
            {conversation.mode === "ai" ? (
              <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bot className="size-4 text-primary" />
                  <span>AI is handling this conversation</span>
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setShowTakeoverDialog(true)}
                >
                  <HandMetal className="size-3.5 mr-1.5" /> Take Control
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      className="rounded-full border px-2.5 py-1 text-xs hover:bg-muted transition-colors"
                      onClick={() => setMessage(reply)}
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <div className="flex items-end gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-10 max-h-32 resize-none"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleSend}
                    disabled={!message.trim()}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Desktop only */}
        <div className="hidden lg:flex w-72 flex-col border-l">
          <Tabs defaultValue="customer" className="flex-1 flex flex-col">
            <TabsList className="mx-2 mt-2 h-9">
              <TabsTrigger value="customer" className="text-xs flex-1">
                <UserCircle className="size-3.5 mr-1" /> Customer
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs flex-1">
                <Info className="size-3.5 mr-1" /> Details
              </TabsTrigger>
              <TabsTrigger value="notes" className="text-xs flex-1">
                <StickyNote className="size-3.5 mr-1" /> Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customer" className="flex-1 m-0 p-3">
              <div className="space-y-3">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="size-14 mb-2">
                    <AvatarFallback className="text-lg bg-primary/10 text-primary">
                      {conversation.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm">{conversation.customerName}</p>
                  <p className="text-xs text-muted-foreground">{conversation.customerPhone}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {conversation.labels.length > 0 ? (
                      conversation.labels.map((l) => (
                        <Badge key={l} variant="secondary" className="text-[10px]">
                          {l}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No tags</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Priority</p>
                  <Badge variant="outline" className={cn("text-[10px]", priorityColors[conversation.priority])}>
                    {conversation.priority}
                  </Badge>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="flex-1 m-0 p-3">
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Badge className={cn("mt-1 text-[10px]", statusColors[conversation.status])}>
                    {conversation.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Mode</p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mt-1 text-[10px]",
                      modeColors[conversation.mode].text
                    )}
                  >
                    {conversation.mode === "ai" ? "AI" : "Human"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Assigned To</p>
                  <p className="mt-0.5 text-xs">
                    {conversation.assignedAgent
                      ? teamMembers.find((t) => t.id === conversation.assignedAgent)?.name || "Unknown"
                      : "Unassigned"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Last Message</p>
                  <p className="mt-0.5 text-xs">
                    {format(new Date(conversation.lastMessageAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Messages</p>
                  <p className="mt-0.5 text-xs">{conversation.messages.length} total</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Actions</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                        Assign Agent
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {teamMembers.map((t) => (
                        <DropdownMenuItem
                          key={t.id}
                          onClick={() =>
                            updateConversationMode(conversation.id, "human", t.id)
                          }
                        >
                          {t.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs bg-transparent"
                    onClick={() =>
                      updateConversationStatus(conversation.id, "closed")
                    }
                  >
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notes" className="flex-1 m-0 p-3">
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Internal Notes</p>
                <Textarea
                  placeholder="Add a note visible only to your team..."
                  className="min-h-24 text-xs resize-none"
                />
                <Button size="sm" className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                  Save Note
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Takeover Confirmation Dialog */}
      <Dialog open={showTakeoverDialog} onOpenChange={setShowTakeoverDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take Control of Conversation</DialogTitle>
            <DialogDescription>
              You are about to switch this conversation from AI mode to human mode.
              The AI will stop responding and you will handle this customer directly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTakeoverDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleTakeover}>
              <HandMetal className="size-4 mr-1.5" /> Take Control
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return to AI Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return to AI</DialogTitle>
            <DialogDescription>
              The AI will resume handling this conversation. Optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for returning to AI (optional)..."
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            className="min-h-20"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleReturnToAI}>
              <RotateCcw className="size-4 mr-1.5" /> Return to AI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
