import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Plus, Pencil, Trash2 } from 'lucide-react'

// Define the API base URL
const apiUrl = 'http://localhost:5000/api/suppliers'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newSupplier, setNewSupplier] = useState({ name: '', contact_info: '' })
  const [editingSupplier, setEditingSupplier] = useState(null)

  // Fetch suppliers from the API
  useEffect(() => {
    axios.get(apiUrl)
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error('Error fetching suppliers:', error))
  }, [])

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_info.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddSupplier = () => {
    axios.post(apiUrl, newSupplier)
      .then((response) => {
        setSuppliers([...suppliers, response.data])
        setNewSupplier({ name: '', contact_info: '' })
        setIsAddDialogOpen(false)
      })
      .catch((error) => console.error('Error adding supplier:', error))
  }

  const handleEditSupplier = () => {
    if (editingSupplier) {
      axios.put(`${apiUrl}/${editingSupplier.supplier_id}`, editingSupplier)
        .then((response) => {
          setSuppliers(suppliers.map(supplier =>
            supplier.supplier_id === editingSupplier.supplier_id ? response.data : supplier
          ))
          setEditingSupplier(null)
        })
        .catch((error) => console.error('Error editing supplier:', error))
    }
  }

  const handleDeleteSupplier = (id) => {
    axios.delete(`${apiUrl}/${id}`)
      .then(() => setSuppliers(suppliers.filter(supplier => supplier.supplier_id !== id)))
      .catch((error) => console.error('Error deleting supplier:', error))
  }

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto"><Plus className="mr-2 h-4 w-4" /> Add Supplier</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact_info" className="text-right">Contact Info</Label>
                <Input
                  id="contact_info"
                  value={newSupplier.contact_info}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact_info: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddSupplier}>Add Supplier</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search suppliers..."
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
            <TableHead>Contact Info</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSuppliers.map((supplier) => (
            <TableRow key={supplier.supplier_id}>
              <TableCell>{supplier.supplier_id}</TableCell>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.contact_info}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => setEditingSupplier(supplier)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteSupplier(supplier.supplier_id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingSupplier && (
        <Dialog open={!!editingSupplier} onOpenChange={() => setEditingSupplier(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Supplier</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingSupplier.name}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact_info" className="text-right">Contact Info</Label>
                <Input
                  id="edit-contact_info"
                  value={editingSupplier.contact_info}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier, contact_info: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleEditSupplier}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
