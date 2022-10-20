/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('menus', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        icon: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        path: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        active: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '1'
        },
        sort_by: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '100'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_admin: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        }
    }, {
        tableName: 'menus'
    });
};
