import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/inventory-transactions';

const InventoryTransaction: React.FC = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        product_id: '',
        supplier_id: '',
        transaction_type: 'restock', // default type
        quantity: '',
        transaction_date: '',
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(API_URL);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(transaction =>
        transaction.product_id.toString().includes(searchTerm) ||
        transaction.supplier_id.toString().includes(searchTerm)
    );

    const handleAddTransaction = async () => {
        try {
            const response = await axios.post(API_URL, newTransaction);
            setTransactions([...transactions, response.data]);
            setNewTransaction({ product_id: '', supplier_id: '', transaction_type: 'restock', quantity: '', transaction_date: '' });
            setIsAddDialogOpen(false);
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const handleDeleteTransaction = async (transaction_id: number) => {
        try {
            console.log(transaction_id);
            await axios.delete(`${API_URL}/${transaction_id}`);
            setTransactions(transactions.filter(transaction => transaction.transaction_id !== transaction_id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    return (
        <div className="space-y-4 p-8 pt-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Inventory Transactions</h1>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="ml-auto"><Plus className="mr-2 h-4 w-4" /> Add Transaction</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Inventory Transaction</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="product_id" className="text-right">Product ID</Label>
                                <Input
                                    id="product_id"
                                    value={newTransaction.product_id}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, product_id: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="supplier_id" className="text-right">Supplier ID</Label>
                                <Input
                                    id="supplier_id"
                                    value={newTransaction.supplier_id}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, supplier_id: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="transaction_type" className="text-right">Type</Label>
                                <select
                                    id="transaction_type"
                                    value={newTransaction.transaction_type}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, transaction_type: e.target.value })}
                                    className="col-span-3"
                                >
                                    <option value="restock">Restock</option>
                                    <option value="sale">Sale</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={newTransaction.quantity}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, quantity: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="transaction_date" className="text-right">Date</Label>
                                <Input
                                    id="transaction_date"
                                    type="date"
                                    value={newTransaction.transaction_date}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, transaction_date: e.target.value })}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <Button onClick={handleAddTransaction}>Add Transaction</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Supplier ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.transaction_id}>
                            <TableCell className="font-medium">{transaction.transaction_id}</TableCell>
                            <TableCell>{transaction.product_id}</TableCell>
                            <TableCell>{transaction.supplier_id}</TableCell>
                            <TableCell>{transaction.transaction_type}</TableCell>
                            <TableCell>{transaction.quantity}</TableCell>
                            <TableCell>{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteTransaction(transaction.transaction_id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default InventoryTransaction;
