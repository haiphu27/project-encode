const redis = require('redis');
const config=require('../../config/setting');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

class RedisPool{

    static init(configRedis){

        this.maxConnections=configRedis.maxConnections

        //khởi tạo pool biến tổng số max kết nối thành mảng full phần tử null tương ứng
        //lặp hết tất cả phần tử mỗi phần tử là 1 kết nối
        this.pool=Array(config.maxConnections)
            .fill(null)
            .map(()=>redis.createClient(configRedis))

        this.waitingTasks=[];

        // thêm 1 số tính năng hữu ích vào redis client

        this.pool.forEach(rd=>{

            //if don't key ,defaultValue=0
            rd.getIntAsync=async function (key,defaultValue=0) {
                let value=await rd.getAsync(key)
                return parseInt(value||defaultValue)
            }

            rd.getFloatAsync=async function(key ,defaultValue=0){
                let value=await rd.getAsync(key)
                return parseFloat(value||defaultValue)
            }

            rd.getJsonAsync=async function(key ,defaultValue=0){
                return await rd.getAsync(key)
                    .then(value => value?JSON.parse(value):defaultValue)
            }
        })

        let a =Object.getOwnPropertyNames(redis.RedisClient.prototype)
        console.log(a)






    }



}

 RedisPool.init(config.redis)

module.exports=RedisPool