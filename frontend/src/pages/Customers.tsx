import React, { useState, useEffect } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Plus, Pencil, Trash2, Mail, Phone } from 'lucide-react'
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customers';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(API_URL);
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = async () => {
    try {
      const response = await axios.post(API_URL, newCustomer);
      setCustomers([...customers, response.data]);
      setNewCustomer({ name: '', email: '', phone: '', address: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleEditCustomer = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingCustomer.customer_id}`, editingCustomer);
      setCustomers(customers.map(customer => 
        customer.customer_id === editingCustomer.customer_id ? response.data : customer
      ));
      setEditingCustomer(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error editing customer:', error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setCustomers(customers.filter(customer => customer.customer_id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto"><Plus className="mr-2 h-4 w-4" /> Add Customer</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.customer_id}>
              <TableCell>{customer.customer_id}</TableCell>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  {customer.email}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  {customer.phone}
                </div>
              </TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingCustomer(customer);
                  setIsEditDialogOpen(true);
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteCustomer(customer.customer_id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingCustomer && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-address" className="text-right">Address</Label>
                <Input
                  id="edit-address"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
