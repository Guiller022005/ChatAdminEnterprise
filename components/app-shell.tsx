"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { MobileNav } from "@/components/mobile-nav"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { ChatsPage } from "@/components/pages/chats-page"
import { OrdersPage } from "@/components/pages/orders-page"
import { ProductsPage } from "@/components/pages/products-page"
import { CustomersPage } from "@/components/pages/customers-page"
import { TeamPage } from "@/components/pages/team-page"
import { SettingsPage } from "@/components/pages/settings-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { NotificationsPage } from "@/components/pages/notifications-page"

export function AppShell() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    if (page !== "chats") setSelectedConversation(null)
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={handleNavigate} />
      case "chats":
        return (
          <ChatsPage
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        )
      case "orders":
        return <OrdersPage />
      case "products":
        return <ProductsPage />
      case "customers":
        return <CustomersPage />
      case "team":
        return <TeamPage />
      case "settings":
        return <SettingsPage />
      case "profile":
        return <ProfilePage />
      case "notifications":
        return <NotificationsPage />
      default:
        return <DashboardPage onNavigate={handleNavigate} />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <SidebarInset>
        <Topbar currentPage={currentPage} onNavigate={handleNavigate} />
        <div className="flex-1 overflow-auto pb-16 md:pb-0">{renderPage()}</div>
      </SidebarInset>
      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
    </SidebarProvider>
  )
}
