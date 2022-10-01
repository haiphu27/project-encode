const {sequelize} = require("../config/connect-mysql");
const UserModel = require('../model/user.model').init(sequelize)
const CountryModel = require('../model/country.model').init(sequelize)
const {set} =require('../config/connect-redis')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const axios = require("axios");

class UserController {

    async login(req, res) {
        try {
            const {username,password} = req.body;
            const user = await UserModel.findOne({
                where:{username}
            })
            if (!user.dataValues) {return res.json({msg: 'User not found'})}
            const is_correct=await bcrypt.compare(password,user.dataValues.password)
            if(!is_correct){return res.json({msg: 'Wrong credentials'})}
            const token = await jwt.sign({user_id:user.dataValues.id},process.env.JWT_SECRET)
            res.status(200).json({token})
        }catch (e) {
            return res.status(500).json({message: e.message});
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
            return res.status(500).json({message: e.message});
        }
    }

     async list_country(req, res) {
        try {
            const key = req.route.path.split('/')[1];
            const list_country=await CountryModel.findAll()
            const array_list_country=[]
            list_country.forEach(element => array_list_country.push(element.dataValues));
            // //redis
            set(key,JSON.stringify(array_list_country),{
                EX:3600
            })
           return  res.status(200).json(array_list_country)
        }catch (e) {
            return res.status(500).json({message: e.message});
        }
    }





}

module.exports = new UserController()