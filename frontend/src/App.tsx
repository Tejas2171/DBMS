import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { cn } from "./lib/utils"
import { Button } from "./components/ui/button"
import { ScrollArea } from "./components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { Separator } from "./components/ui/separator"
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  Boxes,
  ClipboardList,
  CreditCard,
  BarChart2,
  Star,
  ShoppingCart,
  FileText,
  Menu,
  X
} from 'lucide-react'

// Import your page components here
import Home from './pages/Home'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import OrderItems from './pages/Order-item'
import Suppliers from './pages/Suppliers'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Payments from './pages/Payment'
import Reviews from './pages/Reviews'
import Shipments from './pages/Shipment'

const SidebarItem = ({ icon: Icon, label, to }) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-base font-normal",
          isActive && "bg-primary/10 text-primary font-medium"
        )}
      >
        <Icon className="mr-3 h-5 w-5" />
        {label}
      </Button>
    </Link>
  )
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}>
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="flex items-center mb-8">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                  <AvatarFallback>TS</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">Admin Panel</h2>
                  <p className="text-sm text-gray-500">E-commerce System</p>
                </div>
              </div>
              <nav className="space-y-1">
                <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" />
                <SidebarItem icon={Package} label="Products" to="/products" />
                <SidebarItem icon={Users} label="Customers" to="/customers" />
                <SidebarItem icon={Truck} label="Suppliers" to="/suppliers" />
                <SidebarItem icon={Boxes} label="Inventory" to="/inventory-transactions" />
                <SidebarItem icon={ClipboardList} label="Orders" to="/orders" />
                <SidebarItem icon={ShoppingCart} label="Order Items" to="/order-items" />
                <SidebarItem icon={CreditCard} label="Payments" to="/payments" />
                <SidebarItem icon={Truck} label="Shipments" to="/shipments" />
                <SidebarItem icon={BarChart2} label="Reports" to="/reports" />
                <SidebarItem icon={Star} label="Reviews" to="/reviews" />
              </nav>
            </div>
          </ScrollArea>
        </aside>
        <div className="flex-1 flex flex-col md:pl-64">
          <header className="bg-white shadow-sm h-16 flex items-center">
            <div className="flex-1 px-4 flex justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex-1 flex justify-between px-4">
                <h1 className="text-2xl font-semibold text-gray-900">E-commerce Management System</h1>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/inventory-transactions" element={<Inventory />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/order-items" element={<OrderItems />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/shipments" element={<Shipments />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/reviews" element={<Reviews />} />
                </Routes>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}