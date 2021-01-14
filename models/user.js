"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.belongsToMany(models.movie, {
        through: "userMovies",
        foreignKey: "userId", // gives it’s own foreignKey
      });
      user.belongsTo(models.party);
    }
  }
  user.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      partyId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
