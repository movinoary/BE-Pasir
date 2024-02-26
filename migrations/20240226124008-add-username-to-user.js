'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DataTypes } = require('sequelize');
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'username', {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE users
      SET username = COALESCE(
        SUBSTRING_INDEX(email, '@', 1)
      )
      WHERE username IS NULL;
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'username');
  }
};
