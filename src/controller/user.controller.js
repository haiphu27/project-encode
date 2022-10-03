const {sequelize,set,secret_jwt} = require("../config/setting");
const UserModel = require('../model/user.model').init(sequelize)
const CountryModel = require('../model/country.model').init(sequelize)
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

class UserController {

    async login(req, res,next) {
        try {
            const {username,password} = req.body;
            const user = await UserModel.findOne({
                where:{username}
            })
            if (!user.dataValues) {return res.json({msg: 'User not found'})}
            const is_correct=await bcrypt.compare(password,user.dataValues.password)
            if(!is_correct){return res.json({msg: 'Wrong credentials'})}
            const token = await jwt.sign({user_id:user.dataValues.id},secret_jwt)
            res.status(200).json({token})
        }catch (e) {
            next(e)
        }
    }

    async register(req, res) {
        try {
            const {username,password} = req.body;
            const user = await UserModel.findOne({
                where:{username}
            })
            if(user){return res.json({msg: 'Username already registered'})}
            const hash_password = await bcrypt.hashSync(password,10)
            await UserModel.create({username:username,password:hash_password})
            res.status(200).json({msg: 'register successful'})
        }catch (e) {
            next(e)      
          }
    }

     async list_country(req, res) {
        try {
            const key = req.route.path.split('/')[1];
            const list_country=await CountryModel.findAll()
            const array_list_country=[]
            list_country.forEach(element => array_list_country.push(element.dataValues));
            //redis
            set(key,JSON.stringify(array_list_country),{
                EX:3600
            })
           return  res.status(200).json(array_list_country)
        }catch (e) {
            next(e)        
        }
    }
}

module.exports = new UserController()