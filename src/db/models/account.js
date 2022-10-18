/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const Account =  sequelize.define('accounts', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(32),
            allowNull: true
        },
        prefix_domain: {
            type: DataTypes.STRING(10),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(12),
            allowNull: true
        },
        active: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '1'
        },
        permission_id: {
            type: DataTypes.STRING(400),
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
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        is_delete: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        is_write: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        is_edit: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        allow_create_bill : {
            type: DataTypes.INTEGER(1),
            allowNull: true
        }
    }, {
        tableName: 'accounts'
    });

    // Account.associate = (models)=>{
    //     Account.belongsTo(models.AdminShop, {
    //         as: 'admins',
    //         foreignKey: 'admin_id',
    //     });
    // }

    return Account
};
