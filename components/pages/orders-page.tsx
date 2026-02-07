"use client"

import React, { useState, useMemo } from "react"
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChefHat,
  ShoppingBag,
  Plus,
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  MessageSquare,
  Phone,
  Mail,
  StickyNote,
  ChevronRight,
  Minus,
  Trash2,
  X,
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import type { Order, OrderStatus, OrderItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"

// ── Status config ──

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ElementType }
> = {
  new: { label: "New", color: "bg-primary/10 text-primary", icon: ShoppingBag },
  confirmed: { label: "Confirmed", color: "bg-chart-2/10 text-chart-2", icon: CheckCircle2 },
  preparing: { label: "Preparing", color: "bg-warning/10 text-warning", icon: ChefHat },
  ready: { label: "Ready", color: "bg-success/10 text-success", icon: Package },
  delivering: { label: "Delivering", color: "bg-chart-5/10 text-chart-5", icon: Truck },
  completed: { label: "Completed", color: "bg-success/10 text-success", icon: CheckCircle2 },
  canceled: { label: "Canceled", color: "bg-destructive/10 text-destructive", icon: XCircle },
}

const paymentConfig: Record<string, string> = {
  paid: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
}

const ORDER_FLOW: OrderStatus[] = ["new", "confirmed", "preparing", "ready", "delivering", "completed"]

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_FLOW.indexOf(current)
  if (idx === -1 || idx >= ORDER_FLOW.length - 1) return null
  return ORDER_FLOW[idx + 1]
}

function getNextActionLabel(current: OrderStatus): string | null {
  const labels: Record<string, string> = {
    new: "Confirm Order",
    confirmed: "Start Preparing",
    preparing: "Mark Ready",
    ready: "Dispatch",
    delivering: "Complete",
  }
  return labels[current] || null
}

// ── Main page ──

export function OrdersPage() {
  const [view, setView] = useState<"list" | "detail">("list")
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showNewOrder, setShowNewOrder] = useState(false)

  const handleManage = (orderId: string) => {
    setSelectedOrderId(orderId)
    setView("detail")
  }

  const handleBack = () => {
    setView("list")
    setSelectedOrderId(null)
  }

  return (
    <>
      {view === "list" ? (
        <OrdersList onManage={handleManage} onNewOrder={() => setShowNewOrder(true)} />
      ) : (
        selectedOrderId && <OrderDetail orderId={selectedOrderId} onBack={handleBack} />
      )}
      <NewOrderDrawer open={showNewOrder} onClose={() => setShowNewOrder(false)} />
    </>
  )
}

// ── Orders List ──

function OrdersList({
  onManage,
  onNewOrder,
}: {
  onManage: (id: string) => void
  onNewOrder: () => void
}) {
  const { orders } = useApp()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search)
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["new", "preparing", "delivering", "completed"] as OrderStatus[]).map((s) => {
          const cfg = statusConfig[s]
          return (
            <Card
              key={s}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/30",
                statusFilter === s && "border-primary ring-1 ring-primary/20",
              )}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("rounded-lg p-2.5", cfg.color)}>
                  <cfg.icon className="size-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">{statusCounts[s] || 0}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <CardTitle className="text-base">All Orders</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-36">
                  <Filter className="size-3.5 mr-1.5" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="delivering">Delivering</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="h-9 gap-1.5" onClick={onNewOrder}>
                <Plus className="size-3.5" />
                <span className="hidden sm:inline">New Order</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Payment</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="w-24" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="size-8 text-muted-foreground/40" />
                        <p>No orders found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((order) => {
                    const cfg = statusConfig[order.status]
                    return (
                      <TableRow key={order.id} className="cursor-pointer group" onClick={() => onManage(order.id)}>
                        <TableCell className="font-mono text-xs font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-center text-sm text-muted-foreground">
                          {order.items.length}
                        </TableCell>
                        <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px]", cfg.color)} variant="secondary">
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className={cn("text-[10px] capitalize", paymentConfig[order.paymentStatus])} variant="secondary">
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM d, h:mm a")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              onManage(order.id)
                            }}
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── Order Detail / Manage ──

function OrderDetail({ orderId, onBack }: { orderId: string; onBack: () => void }) {
  const { orders, updateOrderStatus, conversations } = useApp()
  const order = orders.find((o) => o.id === orderId)
  const [showCancel, setShowCancel] = useState(false)

  if (!order) {
    return (
      <div className="p-6 flex flex-col items-center gap-4">
        <p className="text-muted-foreground">Order not found</p>
        <Button variant="outline" onClick={onBack}>Go back</Button>
      </div>
    )
  }

  const nextStatus = getNextStatus(order.status)
  const nextLabel = getNextActionLabel(order.status)
  const linkedConversation = order.conversationId
    ? conversations.find((c) => c.id === order.conversationId)
    : null
  const isCanceled = order.status === "canceled"
  const isCompleted = order.status === "completed"
  const canAdvance = !isCanceled && !isCompleted && nextStatus
  const canCancel = !isCanceled && !isCompleted

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b bg-card px-4 md:px-6 py-4">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="size-8">
            <ArrowLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold font-mono">{order.id}</h2>
            <Badge className={cn("text-xs", statusConfig[order.status].color)} variant="secondary">
              {statusConfig[order.status].label}
            </Badge>
            <Badge className={cn("text-xs capitalize", paymentConfig[order.paymentStatus])} variant="secondary">
              {order.paymentStatus}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground ml-auto hidden sm:block">
            {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </div>

        {/* Stepper */}
        <OrderStepper currentStatus={order.status} />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center w-20">Qty</TableHead>
                      <TableHead className="text-right w-24">Price</TableHead>
                      <TableHead className="text-right w-24">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium text-sm">{item.name}</TableCell>
                        <TableCell className="text-center text-sm">{item.quantity}</TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Separator />
                <div className="flex justify-between items-center px-4 py-3">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Linked Conversation */}
            {linkedConversation && (
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="rounded-lg p-2 bg-primary/10 text-primary">
                    <MessageSquare className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Linked Conversation</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {linkedConversation.customerName}: {`"${linkedConversation.lastMessage}"`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {linkedConversation.mode}
                  </Badge>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Customer & Delivery info */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="size-3.5" /> Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="size-3.5 text-muted-foreground flex-shrink-0" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-3.5 text-muted-foreground flex-shrink-0" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-3.5 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{order.customerEmail}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="size-3.5" /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{order.deliveryAddress}</p>
              </CardContent>
            </Card>

            {order.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <StickyNote className="size-3.5" /> Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{order.notes}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CreditCard className="size-3.5" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span className="capitalize font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className={cn("text-[10px] capitalize", paymentConfig[order.paymentStatus])} variant="secondary">
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky bottom action bar */}
      {(canAdvance || canCancel) && (
        <div className="sticky bottom-0 border-t bg-card px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          {canCancel && (
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5 bg-transparent" onClick={() => setShowCancel(true)}>
              <XCircle className="size-4 mr-1.5" />
              Cancel Order
            </Button>
          )}
          <div className="ml-auto">
            {canAdvance && nextLabel && (
              <Button onClick={() => updateOrderStatus(order.id, nextStatus!)}>
                {nextLabel}
                <ChevronRight className="size-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      <Dialog open={showCancel} onOpenChange={setShowCancel}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel order {order.id}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCancel(false)}>
              Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                updateOrderStatus(order.id, "canceled")
                setShowCancel(false)
              }}
            >
              Yes, Cancel Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Order Stepper ──

function OrderStepper({ currentStatus }: { currentStatus: OrderStatus }) {
  const isCanceled = currentStatus === "canceled"
  const currentIdx = ORDER_FLOW.indexOf(currentStatus)

  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex items-center min-w-[500px] md:min-w-0">
        {ORDER_FLOW.map((status, idx) => {
          const cfg = statusConfig[status]
          const isActive = status === currentStatus
          const isDone = !isCanceled && currentIdx > idx
          const isFuture = !isCanceled && currentIdx < idx

          return (
            <React.Fragment key={status}>
              {idx > 0 && (
                <div className={cn("h-0.5 flex-1 mx-1", isDone ? "bg-success" : "bg-border")} />
              )}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                    isDone && "bg-success text-success-foreground",
                    isActive && !isCanceled && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                    isActive && isCanceled && "bg-destructive text-destructive-foreground ring-4 ring-destructive/20",
                    isFuture && "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <cfg.icon className="size-3.5" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium whitespace-nowrap",
                    isActive ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {cfg.label}
                </span>
              </div>
            </React.Fragment>
          )
        })}
        {isCanceled && (
          <>
            <div className="h-0.5 flex-1 mx-1 bg-destructive/30" />
            <div className="flex flex-col items-center gap-1">
              <div className="size-8 rounded-full flex items-center justify-center bg-destructive text-destructive-foreground ring-4 ring-destructive/20">
                <XCircle className="size-3.5" />
              </div>
              <span className="text-[10px] font-medium text-destructive">Canceled</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── New Order Drawer ──

function NewOrderDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { customers, products, addOrder } = useApp()
  const [step, setStep] = useState(1)

  // Step 1 - customer
  const [customerSearch, setCustomerSearch] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", email: "", address: "" })
  const [creatingNew, setCreatingNew] = useState(false)

  // Step 2 - products
  const [productSearch, setProductSearch] = useState("")
  const [cartItems, setCartItems] = useState<(OrderItem & { productId: string })[]>([])

  // Step 3 - notes
  const [notes, setNotes] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("card")

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch),
  )

  const filteredProducts = products.filter(
    (p) =>
      p.active &&
      p.stock > 0 &&
      p.name.toLowerCase().includes(productSearch.toLowerCase()),
  )

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addToCart = (product: (typeof products)[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]
    })
  }

  const updateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    )
  }

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  const resetForm = () => {
    setStep(1)
    setCustomerSearch("")
    setSelectedCustomerId(null)
    setNewCustomer({ name: "", phone: "", email: "", address: "" })
    setCreatingNew(false)
    setProductSearch("")
    setCartItems([])
    setNotes("")
    setPaymentMethod("card")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const canProceedStep1 = selectedCustomerId || (creatingNew && newCustomer.name && newCustomer.phone)
  const canProceedStep2 = cartItems.length > 0

  const handleCreate = () => {
    const customer = creatingNew
      ? { name: newCustomer.name, phone: newCustomer.phone, email: newCustomer.email, address: newCustomer.address }
      : selectedCustomer
        ? { name: selectedCustomer.name, phone: selectedCustomer.phone, email: selectedCustomer.email, address: "" }
        : null

    if (!customer) return

    const newOrder: Order = {
      id: `ORD-${1048 + Math.floor(Math.random() * 100)}`,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      deliveryAddress: customer.address || "Address pending",
      notes,
      paymentMethod,
      items: cartItems.map(({ productId, ...rest }) => rest),
      total: cartTotal,
      status: "new",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    }

    addOrder(newOrder)
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle>New Order</DialogTitle>
          <DialogDescription>
            {step === 1 && "Select or create a customer"}
            {step === 2 && "Add products to the order"}
            {step === 3 && "Review and create order"}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="px-6 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "size-6 rounded-full flex items-center justify-center text-xs font-medium",
                  s < step && "bg-success text-success-foreground",
                  s === step && "bg-primary text-primary-foreground",
                  s > step && "bg-muted text-muted-foreground",
                )}
              >
                {s < step ? <CheckCircle2 className="size-3.5" /> : s}
              </div>
              {s < 3 && <div className={cn("h-0.5 flex-1", s < step ? "bg-success" : "bg-border")} />}
            </div>
          ))}
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-6 py-4">
          {/* Step 1: Customer */}
          {step === 1 && (
            <div className="space-y-4">
              {!creatingNew ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {filteredCustomers.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCustomerId(c.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                          selectedCustomerId === c.id
                            ? "bg-primary/10 border border-primary/30"
                            : "hover:bg-muted border border-transparent",
                        )}
                      >
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {c.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.phone}</p>
                        </div>
                        {selectedCustomerId === c.id && (
                          <CheckCircle2 className="size-4 text-primary" />
                        )}
                      </button>
                    ))}
                    {filteredCustomers.length === 0 && customerSearch && (
                      <p className="text-center text-sm text-muted-foreground py-4">No customer found</p>
                    )}
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full bg-transparent" onClick={() => setCreatingNew(true)}>
                    <Plus className="size-4 mr-1.5" />
                    Create New Customer
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs -ml-2"
                    onClick={() => setCreatingNew(false)}
                  >
                    <ArrowLeft className="size-3.5 mr-1" /> Back to search
                  </Button>
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone *</Label>
                    <Input
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      placeholder="+1 555-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery Address</Label>
                    <Textarea
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      placeholder="Full delivery address"
                      rows={2}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Products */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {filteredProducts.map((p) => {
                  const inCart = cartItems.find((i) => i.productId === p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addToCart(p)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted text-left transition-colors border border-transparent"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">${p.price.toFixed(2)} &middot; {p.stock} in stock</p>
                      </div>
                      {inCart ? (
                        <Badge variant="secondary" className="text-[10px]">{inCart.quantity} added</Badge>
                      ) : (
                        <Plus className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  )
                })}
              </div>

              {cartItems.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cart ({cartItems.length})</p>
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => updateCartQty(item.productId, -1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={() => updateCartQty(item.productId, 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Customer summary */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer</p>
                  <p className="text-sm font-medium">
                    {creatingNew ? newCustomer.name : selectedCustomer?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {creatingNew ? newCustomer.phone : selectedCustomer?.phone}
                  </p>
                </CardContent>
              </Card>

              {/* Items summary */}
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Items</p>
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span>
                        {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Notes & payment */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Delivery instructions, special requests..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              Create Order
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
