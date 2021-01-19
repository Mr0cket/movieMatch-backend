"use strict";
const bcrypt = require("bcrypt");
const { SALT_ROUNDS } = require("../config/constants");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Milo",
          email: "milo@milo.com",
          password: bcrypt.hashSync("abcd", SALT_ROUNDS || 5),
          partyId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Guido",
          email: "guido@guido.com",
          password: bcrypt.hashSync("iLoveMessi", SALT_ROUNDS),
          partyId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "testuser",
          email: "test@test.com",
          password: bcrypt.hashSync("test1234", SALT_ROUNDS),
          partyId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Chris Ronaldo",
          email: "cr7@juventus.com",
          password: bcrypt.hashSync("iLoveMessi", SALT_ROUNDS),
          partyId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
