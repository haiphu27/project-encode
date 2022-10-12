const mysqlpool = require("../util/mysqlpool");

async function list(){
    const sql = 'select * from country'
    const list_country = await mysqlpool.query(sql)
    return list_country
}

module.exports = {
list
}