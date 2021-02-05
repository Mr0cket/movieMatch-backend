"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("movies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      movieId: {
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      posterUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      backdropUrl: {
        type: Sequelize.STRING,
      },
      mainGenre: {
        type: Sequelize.STRING,
      },
      overview: {
        type: Sequelize.TEXT,
      },
      releaseDate: {
        type: Sequelize.DATE,
      },
      rating: {
        type: Sequelize.FLOAT,
      },
      popularity: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("movies");
  },
};
