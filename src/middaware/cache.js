const {get_redis} = require('../util/redispool');

module.exports=async function cache(req, res, ) {
    const key = req.route.path.split('/')[1];
    const value=await get_redis(key);
    console.log('value: redis.......................', value )
    // if(value!==null) {
    //     return res.json(JSON.parse(value));
    // }
}