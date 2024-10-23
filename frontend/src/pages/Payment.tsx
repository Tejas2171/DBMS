import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// API endpoint
const API_URL = 'http://localhost:5000/api/payments';

// Fetch payments from the API
const fetchPayments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add a new payment to the API
const addPaymentToAPI = async (payment) => {
  const response = await axios.post(API_URL, payment);
  return response.data;
};

// Mapping of payment methods to colors
const paymentMethodColors = {
  'Credit Card': 'bg-blue-500',
  'PayPal': 'bg-yellow-500',
  'Bank Transfer': 'bg-green-500',
};

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPayment, setNewPayment] = useState({ orderId: '', method: '', amount: '' });

  // Fetch payments on component mount
  useEffect(() => {
    const getPayments = async () => {
      const fetchedPayments = await fetchPayments();
      setPayments(fetchedPayments);
      setFilteredPayments(fetchedPayments);
    };
    getPayments();
  }, []);

  // Filter payments based on search and filter criteria
  useEffect(() => {
    const filtered = payments.filter(payment =>
      (payment.payment_id.toString().includes(searchTerm) ||
       payment.order_id.toString().includes(searchTerm)) &&
      (methodFilter === 'all' || payment.payment_method === methodFilter)
    );
    setFilteredPayments(filtered);
  }, [searchTerm, methodFilter, payments]);

  // Add a new payment
  const handleAddPayment = async () => {
    const paymentToAdd = {
      order_id: parseInt(newPayment.orderId),
      payment_method: newPayment.method,
      payment_date: new Date().toISOString(), // Convert to ISO string for API
      amount_paid: parseFloat(newPayment.amount),
    };

    const addedPayment = await addPaymentToAPI(paymentToAdd);
    setPayments([...payments, addedPayment]);
    setFilteredPayments([...payments, addedPayment]); // Update filtered payments
    setNewPayment({ orderId: '', method: '', amount: '' }); // Reset form
    setIsAddDialogOpen(false); // Close dialog
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
      <div className="flex flex-col justify-between sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 py-4">
        <div className='flex gap-9'>
          <Input
            placeholder="Search by Payment ID or Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Payment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Order ID</label>
                <Input
                  value={newPayment.orderId}
                  onChange={(e) => setNewPayment({ ...newPayment, orderId: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Payment Method</label>
                <Select onValueChange={(value) => setNewPayment({ ...newPayment, method: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Amount</label>
                <Input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleAddPayment}>Add Payment</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Amount Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No payments found.</TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.payment_id}>
                  <TableCell>{payment.payment_id}</TableCell>
                  <TableCell>{payment.order_id}</TableCell>
                  <TableCell>
                    <Badge className={`${paymentMethodColors[payment.payment_method]} text-white`}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {payment.payment_method}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4 text-muted-foreground" />
                      {payment.amount_paid}
                    </div>
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
