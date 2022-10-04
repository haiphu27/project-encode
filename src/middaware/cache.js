const {redisClient} = require('../../config/setting');

module.exports=async function cache(req, res, next) {
    const key = req.route.path.split('/')[1];
    const value=await redisClient.get(key);
    if(value!==null) {
        return res.json(JSON.parse(value));
    }else {
        next()
    }
}