const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary
const Order = require('./Order');
class Payment extends Model {}

Payment.init({
    payment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'order_id',
        },
        onDelete: 'CASCADE',
    },
    payment_method: {
        type: DataTypes.ENUM('Credit Card', 'PayPal', 'Bank Transfer'),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Payment',
    tableName: 'Payments',
    timestamps: false,
});

module.exports = Payment;
