module.exports= (sequelize,DataTypes) => {
        return sequelize.define('user',{
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
            tableName:'user'
        })
}



