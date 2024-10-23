const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
class Customer extends Model {}

Customer.init({
    customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Customer',
    tableName: 'Customers',
    timestamps: false,
});

module.exports = Customer;
