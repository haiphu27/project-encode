const userModel = require('../model/user')
const {set} =require('../config/connect-redis')
const bcrypt = require('bcrypt')

class UserController {

    async login(req, res, next) {
        try {
            const {username,password} = req.body;
            // const user = await userModel.findUserWithName(username)
            if (!user) {return res.json({msg: 'User not found'})}
            const is_correct=await bcrypt.compare(password,user.password)
            if(!is_correct){return res.json({msg: 'Wrong credentials'})}

        }catch (e) {
            return res.status(500).json({message: e.message});
        }
    }

}

module.exports = new UserController()