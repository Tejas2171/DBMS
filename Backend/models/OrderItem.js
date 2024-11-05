const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary
const Order = require('./Order'); // Import the Order model
const Product = require('./Product'); // Import the Product model
class OrderItem extends Model {}

OrderItem.init({
    order_item_id: {
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
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'product_id',
        },
        onDelete: 'CASCADE',
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    item_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
    }
}, {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'OrderItems',
    timestamps: false,
});

module.exports = OrderItem;
