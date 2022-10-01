const {DataTypes} = require('sequelize')
const {sequelize} = require('../config/connect-mysql')

sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

});

module.exports = sequelize.sync()

