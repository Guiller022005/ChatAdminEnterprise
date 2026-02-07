"use client"

import {
  ShoppingCart,
  MessageSquare,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { formatDistanceToNow } from "date-fns"

const ordersChartData = [
  { day: "Mon", orders: 12 },
  { day: "Tue", orders: 19 },
  { day: "Wed", orders: 14 },
  { day: "Thu", orders: 22 },
  { day: "Fri", orders: 18 },
  { day: "Sat", orders: 25 },
  { day: "Sun", orders: 8 },
]

const responseTimeData = [
  { hour: "8AM", seconds: 45 },
  { hour: "9AM", seconds: 32 },
  { hour: "10AM", seconds: 28 },
  { hour: "11AM", seconds: 35 },
  { hour: "12PM", seconds: 50 },
  { hour: "1PM", seconds: 42 },
  { hour: "2PM", seconds: 30 },
  { hour: "3PM", seconds: 25 },
]

interface DashboardPageProps {
  onNavigate: (page: string) => void
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { orders, conversations, products, notifications } = useApp()

  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === new Date().toDateString()
  ).length || 3
  const pendingChats = conversations.filter((c) => c.status === "open").length
  const revenueToday = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((acc, o) => acc + o.total, 0)
  const lowStockCount = products.filter((p) => p.stock <= 5 && p.active).length

  const recentActivity = [
    ...conversations
      .filter((c) => c.status === "open")
      .map((c) => ({
        id: c.id,
        type: "chat" as const,
        text: `New chat from ${c.customerName}`,
        detail: c.lastMessage,
        time: c.lastMessageAt,
      })),
    ...orders
      .slice(0, 3)
      .map((o) => ({
        id: o.id,
        type: "order" as const,
        text: `Order ${o.id} - ${o.customerName}`,
        detail: `$${o.total.toFixed(2)} - ${o.status}`,
        time: o.createdAt,
      })),
    ...notifications
      .filter((n) => !n.read)
      .slice(0, 2)
      .map((n) => ({
        id: n.id,
        type: n.type as "chat" | "order" | "stock" | "system",
        text: n.title,
        detail: n.message,
        time: n.createdAt,
      })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8)

  const kpis = [
    {
      title: "Orders Today",
      value: ordersToday,
      icon: ShoppingCart,
      change: "+12%",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Chats",
      value: pendingChats,
      icon: MessageSquare,
      change: `${pendingChats} open`,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Revenue Today",
      value: `$${revenueToday.toFixed(0)}`,
      icon: DollarSign,
      change: "+8%",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      icon: AlertTriangle,
      change: `${lowStockCount} items`,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2 ${kpi.bgColor}`}>
                  <kpi.icon className={`size-4 ${kpi.color}`} />
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <TrendingUp className="size-3" />
                  {kpi.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Orders This Week</CardTitle>
            <CardDescription>Daily order volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Chat Response Time</CardTitle>
            <CardDescription>Average response time in seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} unit="s" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="seconds"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest events across your platform</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary" onClick={() => onNavigate("notifications")}>
            View all <ArrowUpRight className="ml-1 size-3" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
              No recent activity
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <Badge
                    variant="outline"
                    className={
                      item.type === "chat"
                        ? "border-primary/30 text-primary bg-primary/5"
                        : item.type === "order"
                          ? "border-success/30 text-success bg-success/5"
                          : item.type === "stock"
                            ? "border-warning/30 text-warning bg-warning/5"
                            : "border-muted-foreground/30 text-muted-foreground"
                    }
                  >
                    {item.type}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.text}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
