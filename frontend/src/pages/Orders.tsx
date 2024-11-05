import React, { useState, useEffect } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "../lib/utils";
import { Calendar } from 'lucide-react';
import axios from 'axios';

const API_ENDPOINT = "http://localhost:5000/api/orders";

const statusColors = {
  Processing: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Delivered: 'bg-green-500',
};

const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        // console.log("Hi");
        const response = await axios.get(API_ENDPOINT);
        // console.log("Hi2");
        if (Array.isArray(response.data)) {
          setOrders(response.data);
          setFilteredOrders(response.data);
        } else {
          console.error("Expected array but received:", response.data);
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setFilteredOrders([]);
      }
    };
    getOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      (order.order_id.toString().includes(searchTerm) ||
       order.customer_id.toString().includes(searchTerm)) &&
      (statusFilter === 'all' || order.status === statusFilter) &&
      (!dateFilter || formatDate(order.order_date) === formatDate(dateFilter))
    );
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, dateFilter, orders]);

  return (
    <div className="space-y-4 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4">
        <Input
          placeholder="Search by Order ID or Customer ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateFilter && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {dateFilter ? formatDate(dateFilter) : <span>Filter by date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFilter}
              onSelect={setDateFilter}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {dateFilter && (
          <Button variant="ghost" onClick={() => setDateFilter(null)}>
            Clear Date Filter
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(filteredOrders) && filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No orders found.</TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.customer_id}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>${order.total_amount}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[order.status]} text-white`}>
                      {order.status}
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
