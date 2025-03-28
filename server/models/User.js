const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Company = require("./Company");

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    designation: { type: DataTypes.STRING, allowNull: false },
    dateOfBirth: { type: DataTypes.DATEONLY, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true }
});

User.belongsTo(Company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = User;