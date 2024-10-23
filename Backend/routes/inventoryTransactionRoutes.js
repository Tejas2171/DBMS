const express = require('express');
const inventoryTransactionController = require('../controllers/inventoryTransactionController');
const router = express.Router();

router.post('/', inventoryTransactionController.createInventoryTransaction);
router.get('/', inventoryTransactionController.getAllInventoryTransactions);
router.get('/:id', inventoryTransactionController.getInventoryTransactionById);
router.put('/:id', inventoryTransactionController.updateInventoryTransaction);
router.delete('/:id', inventoryTransactionController.deleteInventoryTransaction);

module.exports = router;
