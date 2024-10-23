const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary
const Customer = require('./Customer'); // Import the Customer model
class Order extends Model {}

Order.init({
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Customer,
            key: 'customer_id',
        },
        onDelete: 'CASCADE',
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Shipped', 'Processing', 'Delivered'),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    timestamps: false,
});

module.exports = Order;
