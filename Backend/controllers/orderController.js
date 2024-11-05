// controllers/orderController.js
const Order = require('../models/Order');

// Function for creating an order
exports.createOrder = async (req, res) => {
    try {
        const { customer_id, order_date, status } = req.body; // Removed total_amount since it's not in the schema

        // Validate required fields
        if (!customer_id || !order_date || !status) {
            return res.status(400).json({ error: 'Missing required fields: customer_id, order_date, and status are required.' });
        }

        // Create the order using the validated data
        const newOrder = await Order.create({
            customer_id,
            order_date,
            status
        });

        res.status(201).json(newOrder); // Return the created order
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error uu' });
    }
};

// Function for retrieving all orders
exports.getAllOrders = async (req, res) => {
    console.log('Received GET request for all orders');
    try {
        const orders = await Order.findAll();
        
        // // Format orders to return dates as strings
        // const formattedOrders = orders.map(order => ({
        //     ...order.toJSON(),
        //     order_date: order.order_date.toString() // Return date as a regular string
        // }));

        res.json(orders); // Return all orders
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error ahe' });
    }
};

// Function for retrieving an order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Format the order date as a string
        const formattedOrder = {
            ...order.toJSON(),
            order_date: order.order_date.toString()
        };

        res.json(formattedOrder); // Return the found order
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function for updating an order
exports.updateOrder = async (req, res) => {
    try {
        const [updated] = await Order.update(req.body, {
            where: { order_id: req.params.id }
        });
        if (!updated) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json({ message: 'Order updated successfully' }); // Confirm update
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function for deleting an order
exports.deleteOrder = async (req, res) => {
    try {
        const deleted = await Order.destroy({
            where: { order_id: req.params.id }
        });
        if (!deleted) return res.status(404).json({ error: 'Order not found' });

        res.status(204).json({ message: 'Order deleted successfully' }); // Confirm deletion
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
