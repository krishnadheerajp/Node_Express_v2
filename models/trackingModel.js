const { sq } = require("../dbConn");
const { DataTypes } = require("sequelize");
const userModel = require("./userModel");
const foodModel = require("./foodModel");

const Tracking = sq.define('tracking', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: userModel,
            key: 'id'
        },
        allowNull: false
    },
    food_id: {
        type: DataTypes.INTEGER,
        references: {
            model: foodModel,
            key: 'id'
        },
        allowNull: false
    },
    details:{
        type: DataTypes.JSON,
        validate: {
            notEmpty: true,
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true,
            min: 11
        },
        allowNull: false
    }
})

userModel.hasMany(Tracking, { foreignKey: 'user_id', as: 'trackings' });
Tracking.belongsTo(userModel, { foreignKey: 'user_id', as: 'user' });

foodModel.hasMany(Tracking, { foreignKey: 'food_id', as: 'foodTrackings' });
Tracking.belongsTo(foodModel, { foreignKey: 'food_id', as: 'food' });

Tracking.sync().then(() => {
    console.log("Tracking Model synced");
});

module.exports = Tracking;