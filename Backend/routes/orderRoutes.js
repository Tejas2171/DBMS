// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Ensure this path is correct

// Define your routes
router.post('/', orderController.createOrder); // Create a new order
router.get('/', orderController.getAllOrders); // Retrieve all orders
router.get('/:id', orderController.getOrderById); // Retrieve an order by ID
router.put('/:id', orderController.updateOrder); // Update an order by ID
router.delete('/:id', orderController.deleteOrder); // Delete an order by ID

module.exports = router; // Export the router
