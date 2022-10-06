const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const {secret_jwt} = require("../../config/setting");
const {set_redis}=require("../util/redispool")
const pool = require('../util/mysqlpool')
const {logger}=require('../util/logger')
const {models}=require('../db/index')


class UserController {

    async login(req, res,next) {
        try {
            const {username,password} = req.body;
                const user = await models.User.findOne({
                where:{username},
                    raw:true
            })
            if (!user) {return res.json({msg: 'User not found'})}
            const is_correct=await bcrypt.compare(password,user.password)
            if(!is_correct){return res.json({msg: 'Wrong credentials'})}
            const token = await jwt.sign({user_id:user.id},secret_jwt)
            res.status(200).json({token})
        }catch (e) {
            next(e)
        }
    }

    async register(req, res) {
        try {
            const {username,password} = req.body;
            const user = await models.User.findOne({
                where:{username}
            })
            if(user){return res.json({msg: 'Username already registered'})}
            const hash_password = await bcrypt.hashSync(password,10)
            await models.User.create({username:username,password:hash_password})
            res.status(200).json({msg: 'register successful'})
        }catch (e) {
            next(e)      
          }
    }

    async list_country(req, res,next) {
        try {
            const key = req.route.path.split('/')[1];
            const sql='select * from country'
            const list_country=await pool.query(sql)
            //redis
            // set_redis(key,JSON.stringify(list_country[0]),{
            //     EX:3600
            // })
           return  res.status(200).json(list_country[0])
        }catch (e) {
            next(e)        
        }
    }
}

module.exports = new UserController()