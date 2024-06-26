"use strict";
/** @type {import('sequelize-cli').Migration} */
const { Sequelize} = require('sequelize');module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("product_prices", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      product_id: {
        type: DataTypes.STRING,
        type: DataTypes.UUID,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      purchase_price: {
        type: DataTypes.INTEGER(15),
      },
      selling_price: {
        type: DataTypes.INTEGER(15),
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("product_prices");
  },
};
