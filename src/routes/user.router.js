const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const router = require('../core/router').Router()
const {models} = require("../db/index");
const {secret_jwt} = require("../../config/setting");
const {redis_pool,set_redis,get_redis} = require("../util/redispool");
const RedisPool = require("../util/redispool");

async function login(req, res,next) {
    try {
        const {username,password} = req.body;
        const user = await models.user.findOne({
            where:{username},
            raw:true
        })
        if (!user) {return res.json({msg: 'User not found'})}
        const is_correct=await bcrypt.compare(password,user.password)
        if(!is_correct){return res.json({msg: 'Wrong credentials'})}
        const token = await jwt.sign({user_id:user.id},secret_jwt)
        res.status(200).json({ error: 0, data: { token} })
    }catch (error) {
        console.log('........co loi : ', error)
    }
}

async function register(req, res) {
    try {
        const {username,password} = req.body;
        const user = await models.user.findOne({
            where:{username}
        })
        if(user){return res.json({msg: 'Username already registered'})}
        const hash_password = await bcrypt.hashSync(password,10)
        await models.user.create({username:username,password:hash_password})
        res.status(200).json({msg: 'register successful'})
    }catch (error) {
        console.log('........co loi : ', error)
    }
}

async function list_country(req, res,next) {
    try {
        const key = req.route.path.split('/')[1];
        const resp= await axios.get('https://jsonplaceholder.typicode.com/posts')
        // const sql='select * from country'
        // const list_country=await pool.query(sql)
        //redis
        // await redis_pool
        // redis_pool[0].set(key,JSON.stringify(resp.data))
        // console.log( set_redis,1111111111111111111111111111111111)
         RedisPool.pool[0].set(key,JSON.stringify(resp.data))

        // const value= get_redis(key)
        // console.log('value: ...............',value)

        // console.log(a,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        return  res.status(200).json(resp.data)
    }catch (error) {
        console.log('........co loi : ', error)
    }
}

router.postS(__filename,'/login',login,false,)
router.postS(__filename,'/register',register,false,)
router.getS(__filename,'/list',list_country,true,)

module.exports = router












