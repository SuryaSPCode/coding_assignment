const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Company = sequelize.define("Company", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  lat: { type: DataTypes.FLOAT, allowNull: true },
  lng: { type: DataTypes.FLOAT, allowNull: true }
});

module.exports = Company;
