module.exports = (sequelize,DataTypes) => {
        return sequelize.define('country',{
            id_country: {
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
        },
        {
            timestamps:false,
            tableName:'country',
        })
}

// $and: {a: 5}           // AND (a = 5)
// $or: [{a: 5}, {a: 6}]  // (a = 5 OR a = 6)
// $gt: 6,                // > 6
//     $gte: 6,               // >= 6
//     $lt: 10,               // < 10
//     $lte: 10,              // <= 10
//     $ne: 20,               // != 20
//     $between: [6, 10],     // BETWEEN 6 AND 10
//     $notBetween: [11, 15], // NOT BETWEEN 11 AND 15
//     $in: [1, 2],           // IN [1, 2]
//     $notIn: [1, 2],        // NOT IN [1, 2]
//     $like: '%hat',         // LIKE '%hat'
//     $notLike: '%hat'       // NOT LIKE '%hat'
// $iLike: '%hat'         // ILIKE '%hat' (Phân biệt hoa thường) (chỉ hộ trợ PG)
// $notILike: '%hat'      // NOT ILIKE '%hat'  (chỉ hộ trợ PG)
// $like: { $any: ['cat', 'hat']}
// // LIKE ANY ARRAY['cat', 'hat']
// $overlap: [1, 2]       // && [1, 2] (PG array overlap )
// $contains: [1, 2]      // @> [1, 2] (PG array contains )
// $contained: [1, 2]     // <@ [1, 2] (PG array contained )
// $any: [2,3]



