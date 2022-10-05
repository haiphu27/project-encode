
const redis = require('redis');
// const util=require('util')
const config=require('../../config/setting');

// const redisClient=redis.createClient(config.redis)

// const get_redis = util.promisify(redisClient.get).bind(redisClient);
// const set_redis = util.promisify(redisClient.set).bind(redisClient);

// module.exports={
//     get_redis,
//     set_redis,
//     redisClient
// }


class RedisPool{
    
    static init(config){
        this.pool=Array(config.maxConnections)
        .fill()
        .map(()=>redis.createClient(config.redis))
        console.log(this.pool,'11111111111111111');
    }
}

new RedisPool(config.redis)

module.exports=RedisPool