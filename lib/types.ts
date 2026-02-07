export type UserRole = "admin" | "operator"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  status: "online" | "offline" | "away"
  lastSeen: string
}

export type ConversationStatus = "open" | "pending" | "closed"
export type ConversationMode = "ai" | "human"
export type MessageSender = "customer" | "ai" | "human" | "system"

export interface Conversation {
  id: string
  customerName: string
  customerPhone: string
  customerAvatar?: string
  status: ConversationStatus
  mode: ConversationMode
  assignedAgent?: string
  priority: "low" | "medium" | "high" | "urgent"
  labels: string[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: Message[]
}

export interface Message {
  id: string
  sender: MessageSender
  senderName: string
  content: string
  timestamp: string
}

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "delivering"
  | "completed"
  | "canceled"

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentStatus: "paid" | "pending" | "failed"
  conversationId?: string
  createdAt: string
}

export type ProductType = "physical" | "digital" | "service"

export interface Product {
  id: string
  name: string
  price: number
  type: ProductType
  stock: number
  active: boolean
  image?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  tags: string[]
  notes: string
  lastContact: string
  conversationCount: number
  orderCount: number
}

export interface TeamMember extends User {
  invitedAt: string
}

export interface Notification {
  id: string
  type: "order" | "chat" | "stock" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
}
