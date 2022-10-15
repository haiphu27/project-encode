/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('delivery_bill', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        state: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        code: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        cod_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        cod_time_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        cod_price: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        time_code_type: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        golfer_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        ship_time: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        reason: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        golfer_address_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        noted: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        discount_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        money_discount: {
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
        shop_address_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        reject_content: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        customer_reject_content: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        reject_images: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date_confirm: {
            type: DataTypes.DATE,
            allowNull: true
        },
        method_payment_id : {
            type: DataTypes.INTEGER(2),
            allowNull: true
        },
        payment_des: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        bank_id : {
            type: DataTypes.INTEGER(2),
            allowNull: true
        },
        paid : {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        date_customer_confirm: {
            type: DataTypes.DATE,
            allowNull: true
        },
        date_shop_confirm: {
            type: DataTypes.DATE,
            allowNull: true
        },
        date_complete: {
            type: DataTypes.DATE,
            allowNull: true
        },
        vhandicap_transaction_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        shop_noted: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sale_man: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        called: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
    }, {
        tableName: 'delivery_bill'
    });
};
