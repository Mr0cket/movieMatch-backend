"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userMovie extends Model {
    static associate(models) {
      userMovie.belongsTo(models.user);
      userMovie.belongsTo(models.movie);
    }
  }
  userMovie.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      movieId: { type: DataTypes.INTEGER, allowNull: false },
      liked: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      sequelize,
      modelName: "userMovie",
    }
  );
  return userMovie;
};
