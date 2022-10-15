/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        images: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        product_code: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        product_code_shop: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        category_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        old_category_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        thumb: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        desc: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        state: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        sale: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        color: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        size: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        tag_ids: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        condition: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        price_sale: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        old_price_sale: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        number: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '1'
        },
        weight: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        trademark_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        is_book: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        active: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '1'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        day_pickup: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            defaultValue: '0'
        },
        name_param_first: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        name_param_second: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        priority: {
            type: DataTypes.INTEGER(3),
            allowNull: true
        },
        user_upload: {
            type: DataTypes.INTEGER(5),
            allowNull: true
        },
        user_edit: {
            type: DataTypes.INTEGER(5),
            allowNull: true
        },
    }, {
        tableName: 'products'
    });
};
