"use strict";
/** @type {import('sequelize-cli').Migration} */
const { Sequelize} = require('sequelize');module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("transactions", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      no_transaction: {
        type: DataTypes.STRING,
      },
      methods: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      total_price: {
        type: DataTypes.INTEGER(15),
      },
      information: {
        type: DataTypes.STRING,
      },
      explanation: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      createBy: {
        type: DataTypes.UUID,
        references: {
          model: "users",
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
    await queryInterface.dropTable("transactions");
  },
};
