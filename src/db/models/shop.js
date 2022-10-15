module.exports = (sequelize,DataTypes) => {
    return sequelize.define('shops',{
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
        address: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        logo: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        active: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '1'
        },
        shop_address_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        cod_priority: {
            type: DataTypes.INTEGER(11),
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
        logo_menu: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        date_active: {
            type: DataTypes.DATE,
            allowNull : true
        },
        date_finish: {
            type: DataTypes.DATE,
            allowNull: true
        },
        active_show_menu: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        }
    },{
        tableName:"shops"
    })
}