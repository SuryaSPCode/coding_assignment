const sequelize = require("../config/db");
const Company = require("./Company");
const User = require("./User");

Company.hasMany(User,
    { 
        foreignKey: "companyId",
        onDelete: "CASCADE"
    });
User.belongsTo(Company,
    { 
        foreignKey: "companyId" 
    });

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log("Database & tables created!");
};

syncDB();

module.exports = { Company, User };
