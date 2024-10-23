const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary
class Supplier extends Model {}

Supplier.init({
    supplier_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    contact_info: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Supplier',
    tableName: 'Suppliers',
    timestamps: false,
});

module.exports = Supplier;
