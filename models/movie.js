"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    static associate(models) {
      movie.belongsToMany(models.user, {
        through: "userMovies",
        foreignKey: "movieId", // gives it’s own foreignKey
      });
    }
  }
  movie.init(
    {
      title: DataTypes.STRING,
      movieId: DataTypes.INTEGER,
      mainGenre: DataTypes.STRING,
      overview: DataTypes.TEXT,
      posterUrl: DataTypes.STRING,
      backdropUrl: DataTypes.STRING,
      releaseDate: DataTypes.DATE,
      rating: DataTypes.FLOAT,
      popularity: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "movie",
    }
  );
  return movie;
};
