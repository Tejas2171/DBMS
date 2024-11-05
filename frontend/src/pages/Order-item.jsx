import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';

const API_URL = 'http://localhost:5000/api/order-items';

// This function simulates an API call to fetch order items
const fetchOrderItems = async () => {
  try {
    // const response = await fetch('/api/order-items'); // Adjust the endpoint as necessary
    const response = await axios.get(API_URL);
    return await response.data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Rethrow the error for handling in the component
  }
};



const statusColors = {
  Processing: 'bg-yellow-500',
  pending: 'bg-blue-500',
  Delivered: 'bg-green-500',
};

export default function OrderItems() {
  const [orderItems, setOrderItems] = useState([]);
  const [filteredOrderItems, setFilteredOrderItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrderItems = async () => {
      try {
        const fetchedOrderItems = await fetchOrderItems();
        setOrderItems(fetchedOrderItems);
        setFilteredOrderItems(fetchedOrderItems);
      } catch (err) {
        setError('Failed to load order items');
      } finally {
        setLoading(false);
      }
    };
    getOrderItems();
  }, []);

  useEffect(() => {
    const filtered = orderItems.filter(item =>
      (item.order_item_id.toString().includes(searchTerm) ||
       item.order_id.toString().includes(searchTerm)) &&
      (orderFilter === 'all' || item.order_id.toString() === orderFilter)
    );
    setFilteredOrderItems(filtered);
  }, [searchTerm, orderFilter, orderItems]);

  const uniqueOrderIds = [...new Set(orderItems.map(item => item.order_id))];

  const getTotalQuantity = () => filteredOrderItems.reduce((sum, item) => sum + item.quantity, 0);
  const getTotalValue = () => filteredOrderItems.reduce((sum, item) => sum + (item.quantity * item.item_price), 0);

  return (
    <div className="space-y-4 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Order Items</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
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
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalQuantity()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
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
              <TableHead>Product ID</TableHead>
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
                    <div className="flex items-center">{item.product_id}</div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.item_price}</TableCell>
                  <TableCell>${(item.quantity * item.item_price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[item.status]} text-white`}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
