const {get_redis} = require('../util/redispool');

module.exports=async function cache(req, res, next) {
    const key = req.route.path.split('/')[1];
    console.log(key)
    // const value=await get_redis(key);
    // if(value!==null) {
    //     return res.json(JSON.parse(value));
    // }else {
    //     next()
    // }
}