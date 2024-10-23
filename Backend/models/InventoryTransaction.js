const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary
const Product = require('./Product')
const Supplier = require('./Supplier')
class InventoryTransaction extends Model {}

InventoryTransaction.init({
    transaction_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'product_id',
        },
        onDelete: 'CASCADE',
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Supplier,
            key: 'supplier_id',
        },
        onDelete: 'SET NULL',
    },
    transaction_type: {
        type: DataTypes.ENUM('restock', 'sale'),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'InventoryTransaction',
    tableName: 'InventoryTransactions',
    timestamps: false,
});

module.exports = InventoryTransaction;
