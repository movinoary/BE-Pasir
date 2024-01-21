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
          permission: `{"server": ["category", "product", "transaction"], "client":["cashier", "inventory", "transaction", "closing", "settings"]}`,
        },
        {
          id: "8ebe255b-89b2-40e2-9bc3-4e8beeabebab",
          name: "cashier",
          permission: `{"server": ["category", "product"], "client":["cashier", "closing", "settings"]}`,
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: "6eb5ef7f-2825-49e4-85af-9cf49ef362e2",
          name: "admin",
          email: "admin@mail.com",
          role_id: "345edfe3-ee84-43ae-8016-7e29bbf93a55",
          password:
            "$2b$10$5Y6c7pi4PTWXGawD5kQAaeYgCqxYVZvzoT9RwGomb1sc1w1Zi4N8G",
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
