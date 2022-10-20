/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('categories', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        thumb: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        sort_index: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '100'
        },
        type: {
            type: DataTypes.INTEGER(2),
            allowNull: true,
        },
        active: {
            type: DataTypes.INTEGER(2),
            allowNull: true,
        }
    }, {
        tableName: 'categories'
    });
};
