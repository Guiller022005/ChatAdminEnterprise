"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import type {
  Conversation,
  ConversationMode,
  ConversationStatus,
  Notification,
  Order,
  Product,
  User,
} from "./types"
import {
  conversations as initialConversations,
  orders as initialOrders,
  products as initialProducts,
  notifications as initialNotifications,
  currentUser,
} from "./mock-data"

interface AppContextType {
  user: User
  conversations: Conversation[]
  orders: Order[]
  products: Product[]
  notifications: Notification[]
  updateConversationStatus: (id: string, status: ConversationStatus) => void
  updateConversationMode: (id: string, mode: ConversationMode, agentId?: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  addMessage: (conversationId: string, content: string, sender: "human" | "customer") => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [orders] = useState<Order[]>(initialOrders)
  const [products] = useState<Product[]>(initialProducts)
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications)

  const updateConversationStatus = useCallback((id: string, status: ConversationStatus) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    )
  }, [])

  const updateConversationMode = useCallback(
    (id: string, mode: ConversationMode, agentId?: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c
          const updated = { ...c, mode, assignedAgent: agentId || c.assignedAgent }
          const systemMsg = {
            id: `sys-${Date.now()}`,
            sender: "system" as const,
            senderName: "System",
            content:
              mode === "human"
                ? `Conversation taken over by ${currentUser.name}`
                : "Conversation returned to AI",
            timestamp: new Date().toISOString(),
          }
          updated.messages = [...updated.messages, systemMsg]
          return updated
        })
      )
    },
    []
  )

  const markNotificationRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const addMessage = useCallback(
    (conversationId: string, content: string, sender: "human" | "customer") => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c
          const msg = {
            id: `msg-${Date.now()}`,
            sender,
            senderName: sender === "human" ? currentUser.name : c.customerName,
            content,
            timestamp: new Date().toISOString(),
          }
          return {
            ...c,
            messages: [...c.messages, msg],
            lastMessage: content,
            lastMessageAt: new Date().toISOString(),
          }
        })
      )
    },
    []
  )

  return (
    <AppContext.Provider
      value={{
        user: currentUser,
        conversations,
        orders,
        products,
        notifications: notifs,
        updateConversationStatus,
        updateConversationMode,
        markNotificationRead,
        markAllNotificationsRead,
        addMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
