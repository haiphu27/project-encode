module.exports = (sequelize,DataTypes) => {
    sequelize.define('golfer_address',{
        id:{
            primaryKey:true,
            autoIncrement:true,
            type:DataTypes.INTEGER(11).UNSIGNED,
            validate:{
                notEmpty:true
            }
        },
        golfer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        is_default: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        district: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        township: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        city: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        city_viettel_post_code : {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        city_viettel_post_id : {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        district_viettel_post_code : {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        district_viettel_post_id : {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        township_viettel_post_code : {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        township_viettel_post_id : {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'golfer_address'
    });

}