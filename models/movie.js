"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
