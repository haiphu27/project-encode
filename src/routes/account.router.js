const router = require('../core/router').Router()

const {modules}=require("../modules/index")

async function login(req, res, next) {
    try {
        const {username, password} = Object.assign({}, req.body, req.query);
        const account =await modules.Account.find_account({username})

        if (!account) return res.json({msg: 'User not found'})

        const pass_is_correct = await modules.Account.compare_pass_hash(password,account.password)

        if (!pass_is_correct) return res.json({msg: 'Wrong credentials'})

        const token = await modules.Account.create_token(account)
        res.status(200).json({error: 0, data: {token}})
    } catch (error) {
        console.log('........co loi : ', error)
    }
}

async function register(req, res) {
    try {
        const {username, password} = Object.assign({}, req.body, req.query);

        const account =await modules.Account.find_account({username})
        if (account) return res.json({msg: 'Username already registered'})
        const hash_password = await modules.Account.hash_password(password,10)

        await modules.Account.create_account(username, hash_password)
        res.status(200).json({msg: 'register successful'})
    } catch (error) {
        console.log('........co loi : ', error)
    }
}


router.postS(__filename, '/login', login, false)
router.postS(__filename, '/register', register, false)

module.exports = router