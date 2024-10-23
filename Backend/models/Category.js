const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary

class Category extends Model {}

Category.init({
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: false,
});

module.exports = Category;
