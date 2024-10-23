// controllers/orderController.js
const Order = require('../models/Order'); // Make sure this model is correctly imported

// Function for creating an order
exports.createOrder = async (req, res) => {
    try {
        const { customer_id, order_date, total_amount, status } = req.body;

        // Create the order using the validated data
        const newOrder = await Order.create({
            customer_id,
            order_date,
            total_amount,
            status
        });

        res.status(201).json(newOrder); // Return the created order
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function for retrieving all orders
exports.getAllOrders = async (req, res) => {
    console.log('Received GET request for all orders');
    try {
        const orders = await Order.findAll();
        const formattedOrders = orders.map(order => ({
            ...order.toJSON(), // Convert Sequelize instance to plain object
            order_date: order.order_date.toISOString() // Format date
        }));
        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function for retrieving an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function for updating an order
exports.updateOrder = async (req, res) => {
    try {
        const [updated] = await Order.update(req.body, {
            where: { order_id: req.params.id } // Use order_id instead of id
        });
        if (!updated) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function for deleting an order
exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.destroy({
            where: { order_id: req.params.id } // Use order_id instead of id
        });
        if (!deleted) return res.status(404).json({ error: 'Order not found' });
        res.status(204).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
