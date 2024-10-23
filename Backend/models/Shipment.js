const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary
const Order = require('./Order');
class Shipment extends Model {}

Shipment.init({
    shipment_id: {
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
    shipment_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    carrier: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    tracking_number: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Shipment',
    tableName: 'Shipments',
    timestamps: false,
});

module.exports = Shipment;
