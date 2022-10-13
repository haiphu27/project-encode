const mysqlpool = require("../util/mysqlpool");

async function list(){
    const sql = 'select * from country'
    const [row] = await mysqlpool.query(sql)
    return row
}

module.exports = {
list
}