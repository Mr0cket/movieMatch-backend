"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class party extends Model {
    static associate(models) {
      party.hasMany(models.user);
    }
  }
  party.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "party",
    }
  );
  return party;
};
