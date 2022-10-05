let mysql2 = require('mysql2/promise');
let {mysql}=require('../../config/setting')

let pool=mysql2.createPool(mysql)
module.exports=pool;

