const { sq } = require("../dbConn");
const { DataTypes } = require("sequelize");

const User = sq.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
    notEmpty: true 
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
    notEmpty: true,
    isEmail: true
    }
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
    notEmpty: true 
    }
  },
  age:{
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
    notEmpty: true,
    min: 12
    }
  }
});

User.sync().then(() => {
  console.log("User Model synced");
});

module.exports = User;