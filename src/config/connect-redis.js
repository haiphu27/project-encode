const redis = require("redis");
const util = require("util");

const redisClient =redis.createClient({
    host: process.env.HOST_REDIS,
    port: process.env.PORT_REDIS,
    options: {},
    maxConnections: 30
});

const get = util.promisify(redisClient.get).bind(redisClient);
const set = util.promisify(redisClient.set).bind(redisClient);

module.exports = {redisClient,get, set};
