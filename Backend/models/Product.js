const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Make sure this is the correct path
const Category = require('./Category');

class Product extends Model {}

// Initialize the Product model
Product.init({
    product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'category_id',
        },
        onDelete: 'SET NULL', // This will set `category_id` to null if the referenced category is deleted
    },
}, {
    sequelize,
    modelName: 'Product',
    tableName: 'products', // Ensure the table name is lowercase if your DB uses lowercase naming
    timestamps: false, // Set to true if you need createdAt/updatedAt fields
});

module.exports = Product;
