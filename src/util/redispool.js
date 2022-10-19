const redis = require('redis');
const bluebird = require('bluebird');
const ultil = require("util");

const config = require('../../config/setting');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

class RedisPool {

    static getMaxConnections() {
        return this.maxConnections
    }

    static async init(configRedis = undefined) {

        this.maxConnections = configRedis.maxConnections

        //khởi tạo pool biến tổng số max kết nối thành mảng full phần tử null tương ứng
        //lặp hết tất cả phần tử mỗi phần tử là 1 kết nối
        this.pool = Array(configRedis.maxConnections)
            .fill(null)
            .map(() => redis.createClient(configRedis))

        //list chờ tác vụ redis client
        this.waitingTasks = [];

        // thêm 1 số tính năng hữu ích vào redis client
        this.pool.forEach(rd => {

            this.getS = ultil.promisify(rd.get).bind(rd)
            this.setS = ultil.promisify(rd.set).bind(rd)
            this.delS = ultil.promisify(rd.delete).bind(rd)

            //if don't key ,defaultValue=0
            // rd.getIntAsync=async function (key,defaultValue=0) {
            //     let value=await rd.getAsync(key)
            //     return parseInt(value||defaultValue)
            // }
            //
            // rd.getFloatAsync=async function(key ,defaultValue=0){
            //     let value=await rd.getAsync(key)
            //     return parseFloat(value||defaultValue)
            // }
            //
            // rd.getJsonAsync=async function(key ,defaultValue=0){
            //     return await rd.getAsync(key)
            //         .then(value => value?JSON.parse(value):defaultValue)
            // }
            //
            rd.release=function(){
                RedisPool.release(rd)
            }

        })

        // Object
        //     .getOwnPropertyNames(redis.RedisClient.prototype)
        //     .filter(name => name.endsWith('Async'))
        //     .forEach(name => {
        //         // this[name] = (...args) => this.command(name, ...args);
        //     });
        return this;
    }

    //đợi và bật kết nối
    static getClient(msAutoRelease = 500) {
        return new Promise(resolve => {
            if (this.pool.length) {
                let rd = this.pool.pop();

            } else {
                this.waitingTasks.push({resolve, msAutoRelease})
            }
        })
    }

    static release(RedisClient) {
        if (this.pool.includes(RedisClient)) return;
        if (!this.waitingTasks.length) {
            this.waitingTasks.push(RedisClient)
            return
        }
        let {resolve, msAutoRelease} = this.waitingTasks.pop();
        resolve(RedisClient)
        if (msAutoRelease) {
            setTimeout(() => {
                this.release(RedisClient)
            }, msAutoRelease)
        }
    }
}

RedisPool.init(config.redis)

module.exports = RedisPool