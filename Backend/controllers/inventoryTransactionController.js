const InventoryTransaction = require('../models/InventoryTransaction');

exports.createInventoryTransaction = async (req, res) => {
    try {
        const transaction = await InventoryTransaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllInventoryTransactions = async (req, res) => {
    try {
        const transactions = await InventoryTransaction.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getInventoryTransactionById = async (req, res) => {
    try {
        const transaction = await InventoryTransaction.findByPk(req.params.id);
        if (transaction) {
            res.status(200).json(transaction);
        } else {
            res.status(404).json({ error: 'InventoryTransaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateInventoryTransaction = async (req, res) => {
    try {
        const [updated] = await InventoryTransaction.update(req.body, {
            where: { inventory_transaction_id: req.params.id },
        });
        if (updated) {
            const updatedTransaction = await InventoryTransaction.findByPk(req.params.id);
            res.status(200).json(updatedTransaction);
        } else {
            res.status(404).json({ error: 'InventoryTransaction not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.deleteInventoryTransaction = async (req, res) => {
    try {
        const deleted = await InventoryTransaction.destroy({
            where: { inventory_transaction_id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'InventoryTransaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
