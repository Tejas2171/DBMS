import React, { useEffect, useState } from 'react'
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Plus, Pencil, Trash2 } from 'lucide-react'
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/products';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', stock: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all'); 

  const categoryMap = {
    1: "Electronics",
    2: "Clothing",
    3: "Home & Garden"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(API_URL);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === "all" || product.category_id.toString() === categoryFilter;
    const matchesSearchTerm = product?.name?.toLowerCase()?.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearchTerm;
  });

  const handleAddProduct = async () => {
    const productToAdd = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category_id: parseInt(newProduct.category),
      stock_quantity: parseInt(newProduct.stock),
    };

    try {
      const response = await axios.post(API_URL, productToAdd);
      setProducts([...products, response.data]);
      setNewProduct({ name: '', price: '', category: '', stock: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async () => {
    const productToUpdate = {
      ...editingProduct,
      price: parseFloat(editingProduct.price),
      category_id: parseInt(editingProduct.category_id),
      stock_quantity: parseInt(editingProduct.stock_quantity),
    };

    try {
      const response = await axios.put(`${API_URL}/${editingProduct.product_id}`, productToUpdate);
      setProducts(products.map(product => 
        product.product_id === editingProduct.product_id ? response.data : product
      ));
      setEditingProduct(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts(products.filter(product => product.product_id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Electronics</SelectItem>
                    <SelectItem value="2">Clothing</SelectItem>
                    <SelectItem value="3">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      

        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="1">Electronics</SelectItem>
            <SelectItem value="2">Clothing</SelectItem>
            <SelectItem value="3">Home & Garden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.product_id}>
              <TableCell>{product.product_id}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{categoryMap[product.category_id]}</TableCell>
              <TableCell>{product.stock_quantity}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => {
                  setEditingProduct(product);
                  setIsEditDialogOpen(true);
                }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.product_id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingProduct && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <Select value={editingProduct.category_id.toString()} onValueChange={(value) => setEditingProduct({ ...editingProduct, category_id: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Electronics</SelectItem>
                    <SelectItem value="2">Clothing</SelectItem>
                    <SelectItem value="3">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-stock" className="text-right">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editingProduct.stock_quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
