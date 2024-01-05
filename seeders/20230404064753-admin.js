"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          id: "345edfe3-ee84-43ae-8016-7e29bbf93a55",
          name: "admin",
          permission: `{"server": ["category", "product", "transaction"], "client":["cashier", "inventory", "transaction"]}`,
        },
        {
          id: "8ebe255b-89b2-40e2-9bc3-4e8beeabebab",
          name: "cashier",
          permission: `{"server": ["category", "product"], "client":["cashier"]}`,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
