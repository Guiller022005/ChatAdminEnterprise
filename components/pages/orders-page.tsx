"use client"

import React from "react"

import { useState } from "react"
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
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import type { OrderStatus } from "@/lib/types"
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
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

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

export function OrdersPage() {
  const { orders } = useApp()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const selected = orders.find((o) => o.id === selectedOrder)

  const statusCounts = orders.reduce(
    (acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["new", "preparing", "delivering", "completed"] as OrderStatus[]).map((s) => {
          const cfg = statusConfig[s]
          return (
            <Card
              key={s}
              className={cn(
                "cursor-pointer transition-colors hover:border-primary/30",
                statusFilter === s && "border-primary"
              )}
              onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("rounded-lg p-2", cfg.color)}>
                  <cfg.icon className="size-4" />
                </div>
                <div>
                  <p className="text-xl font-bold">{statusCounts[s] || 0}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

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
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Payment</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((order) => {
                    const cfg = statusConfig[order.status]
                    return (
                      <TableRow
                        key={order.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        <TableCell className="font-mono text-xs font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{order.customerName}</p>
                            <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 && "s"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("text-[10px]", cfg.color)} variant="secondary">
                            {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge
                            className={cn("text-[10px]", paymentConfig[order.paymentStatus])}
                            variant="secondary"
                          >
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {format(new Date(order.createdAt), "MMM d, h:mm a")}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View
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

      <Dialog open={!!selected} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="font-mono">{selected.id}</span>
                  <Badge
                    className={cn("text-[10px]", statusConfig[selected.status].color)}
                    variant="secondary"
                  >
                    {statusConfig[selected.status].label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">{selected.customerName}</p>
                  <p className="text-xs text-muted-foreground">{selected.customerPhone}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">Items</p>
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>
                        {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>${selected.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className={cn("text-xs", paymentConfig[selected.paymentStatus])}
                    variant="secondary"
                  >
                    Payment: {selected.paymentStatus}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(selected.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
