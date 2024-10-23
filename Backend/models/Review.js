const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db.config'); // Adjust the path as necessary
const Customer = require('./Customer');
const Product = require('./Product');
class Review extends Model {}

Review.init({
    review_id: {
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
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'product_id',
        },
        onDelete: 'CASCADE',
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
        },
    },
    review_text: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    review_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Review',
    tableName: 'Reviews',
    timestamps: false,
});

module.exports = Review;
