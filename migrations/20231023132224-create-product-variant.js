"use strict";
/** @type {import('DataTypes-cli').Migration} */
const { Sequelize} = require('sequelize');
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("product_variants", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      stockTotal: {
        type: DataTypes.INTEGER(15),
      },
      stock: {
        type: DataTypes.INTEGER(15),
      },
      stockOut: {
        type: DataTypes.INTEGER(15),
      },
      stockSelling: {
        type: DataTypes.INTEGER(15),
      },
      stockReject: {
        type: DataTypes.INTEGER(15),
      },
      product_id: {
        type: DataTypes.UUID,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("product_variants");
  },
};
