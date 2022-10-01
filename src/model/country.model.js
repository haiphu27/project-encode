const {DataTypes}=require('sequelize')

module.exports=class Country{

    static init(sequelize){
        return sequelize.define('country',{
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                validate:{
                    notEmpty: true
                }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notEmpty: true
                }
            },
            area: {
                type: DataTypes.STRING,
                allowNull: false,
                validate:{
                    notEmpty: true
                }
            }
        },{
            timestamps:false,
            tableName:'country',
        })
    }
}



