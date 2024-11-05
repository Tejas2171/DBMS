// models/Order.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

class Order extends Model {}

Order.init({
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DOUBLE
    },
    status: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders', // Ensure the table name is correct
    timestamps: false // Add this if you don't have createdAt/updatedAt fields
});

module.exports = Order;
