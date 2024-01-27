"use strict";
/** @type {import('DataTypes-cli').Migration} */
const { Sequelize} = require('sequelize');
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("roles", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
      },
      permission: {
        type: DataTypes.JSON,
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
    await queryInterface.dropTable("roles");
  },
};
