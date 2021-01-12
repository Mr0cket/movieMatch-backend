"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userMovie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
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
