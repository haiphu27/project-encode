module.exports = (sequelize,DataTypes) => {
    const User = sequelize.define('account', {
        id_user: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        // id_country: {
        //     type: DataTypes.INTEGER(11),
        //     foreignKey: true,
        //     allowNull: false
        // },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        timestamps: false,
        tableName: 'account'
    })

    // User.associate = (models) => {
    //     User.belongsToMany(models.country, {
    //         as: 'country',
    //         foreignKey: 'id_country',
    //     });
    // }

    return User;
}



