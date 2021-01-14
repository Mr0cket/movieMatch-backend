"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("parties", [
      {
        name: "coolParty1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "coolParty2",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "whyDoIhaveNames",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
