"use strict";
/** @type {import('DataTypes-cli').Migration} */
const { Sequelize} = require('sequelize');
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("categories", {
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
    await queryInterface.dropTable("categories");
  },
};
