import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, DollarSign } from 'lucide-react'

// This would typically come from your API
const fetchOrderItems = async () => {
  // Simulating API call
  return [
    { order_item_id: 1, order_id: 101, product_id: 201, quantity: 2, item_price: 49.99, product_name: "Wireless Earbuds", order_status: "Processing" },
    { order_item_id: 2, order_id: 101, product_id: 202, quantity: 1, item_price: 99.99, product_name: "Smartwatch", order_status: "Processing" },
    { order_item_id: 3, order_id: 102, product_id: 203, quantity: 3, item_price: 19.99, product_name: "Phone Case", order_status: "Shipped" },
    { order_item_id: 4, order_id: 103, product_id: 204, quantity: 1, item_price: 799.99, product_name: "Laptop", order_status: "Delivered" },
    { order_item_id: 5, order_id: 104, product_id: 205, quantity: 2, item_price: 29.99, product_name: "Bluetooth Speaker", order_status: "Processing" },
  ]
}

const statusColors = {
  Processing: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Delivered: 'bg-green-500',
}

export default function OrderItems() {
  const [orderItems, setOrderItems] = useState([])
  const [filteredOrderItems, setFilteredOrderItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [orderFilter, setOrderFilter] = useState('all')

  useEffect(() => {
    const getOrderItems = async () => {
      const fetchedOrderItems = await fetchOrderItems()
      setOrderItems(fetchedOrderItems)
      setFilteredOrderItems(fetchedOrderItems)
    }
    getOrderItems()
  }, [])

  useEffect(() => {
    const filtered = orderItems.filter(item =>
      (item.order_item_id.toString().includes(searchTerm) ||
       item.order_id.toString().includes(searchTerm) ||
       item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (orderFilter === 'all' || item.order_id.toString() === orderFilter)
    )
    setFilteredOrderItems(filtered)
  }, [searchTerm, orderFilter, orderItems])

  const uniqueOrderIds = [...new Set(orderItems.map(item => item.order_id))]

  const getTotalQuantity = () => filteredOrderItems.reduce((sum, item) => sum + item.quantity, 0)
  const getTotalValue = () => filteredOrderItems.reduce((sum, item) => sum + (item.quantity * item.item_price), 0).toFixed(2)

  return (
    <div className="space-y-4 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Order Items</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4">
        <Input
          placeholder="Search by Order Item ID, Order ID, or Product Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={orderFilter} onValueChange={setOrderFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            {uniqueOrderIds.map(orderId => (
              <SelectItem key={orderId} value={orderId.toString()}>Order {orderId}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Items
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalQuantity()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalValue()}</div>
          </CardContent>
        </Card>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Item ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Item Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Order Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrderItems.length === 0 ? (
                <TableRow>
                <TableCell colSpan={7} className="text-center">No order items found.</TableCell>
                </TableRow>
            ) : (
                filteredOrderItems.map((item) => (
                <TableRow key={item.order_item_id}>
                    <TableCell>{item.order_item_id}</TableCell>
                    <TableCell>{item.order_id}</TableCell>
                    <TableCell>
                    <div className="flex items-center">
                        <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                        {item.product_name}
                    </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.item_price.toFixed(2)}</TableCell>
                    <TableCell>${(item.quantity * item.item_price).toFixed(2)}</TableCell>
                    <TableCell>
                    <Badge className={`${statusColors[item.order_status]} text-white`}>
                        {item.order_status}
                    </Badge>
                    </TableCell>
                </TableRow>
                ))
            )}
            </TableBody>
        </Table>
      </div>
    </div>
  )
}