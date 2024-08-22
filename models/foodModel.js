const { sq } = require("../dbConn");
const { DataTypes } = require("sequelize");

const Food = sq.define('foods', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    calories: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    protein: {
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: false,
    },
    fat: {
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: false,
    },
    fiber: {
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: false,
    },
    carbohydrates: {
      type: DataTypes.DECIMAL(5, 2), 
      allowNull: false,
    },
    imagePath:{
      type: DataTypes.STRING(255),
      allowNull: false,
    }
  })

  Food.sync().then(() => {
    console.log("Food Model synced");
  });

  module.exports = Food;