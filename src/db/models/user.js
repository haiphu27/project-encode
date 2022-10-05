const {DataTypes}=require('sequelize')

module.exports=class User{

    static init(sequelize){
        return sequelize.define('users',{
            id: {
                type: DataTypes.INTEGER(11),
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notEmpty: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notEmpty: true
                }
            }
        },{
            timestamps:false,
            tableName:'users'
        })

    }
}



