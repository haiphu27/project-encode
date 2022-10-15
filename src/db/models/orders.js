module.exports=(sequelize,DataTypes)=>{
    return sequelize.define('orders',{
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        delivery_bill_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        product_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        golfer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        number: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        total_price: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        color: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        size: {
            type: DataTypes.STRING(100),
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
        price: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },

    },{
        tableName:'orders'
    })
}