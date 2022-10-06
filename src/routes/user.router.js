const router = require('../core/router').Router()
const userController = require('../controller/user.controller')
const verify_token=require('../middaware/verify_token')
const cache=require('../middaware/cache')
const {models} = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {secret_jwt} = require("../../config/setting");


async function login(req, res,next) {
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



router.postS(__filename,'/login',login,false)

// router.post('/register',userController.register)
// router.get('/list-country',verify_token,userController.list_country)

module.exports = router