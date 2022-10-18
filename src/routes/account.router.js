const router = require('../core/router').Router()
const {modules} = require("../modules/index")
const {models} = require("../db/index")
const utils = require("../util/utils")
const CryptoJS = require("crypto-js");
const mysqlpool = require("../util/mysqlpool");
const Constants = require("../config/Constant")
const {logger} = require("../util/logger");
const redispool = require("../util/redispool");

function en_crypto_text(text) {
    return CryptoJS.AES.encrypt(text, 'secret key 123').toString()
}

function de_crypto_text(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return bytes.toString(CryptoJS.enc.Utf8);
}

function create_captcha(uid, capstr) {
    let body = {uid, capstr};
    body = JSON.stringify(body);
    let captcha = "captcha-" + Date.now() + "-" + body;
    return en_crypto_text(captcha)
}

function make_id(length) {
    const characters = '0123456789'
    const charactersLength = characters.length;
    let result = ''
    for (let i = 0; i < charactersLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result;
}

async function register(req, res) {
    try {
        const {name, username, password, phone, email, active} = Object.assign({}, req.body, req.query);

        const account = await modules.Account.find({username, phone, email})
        if (account) return res.json({msg: Constants.ERROR.ACCOUNT_IS_EXIT})

        const validate_email = utils.validate_email(email)
        const validate_username = utils.validate_username(username)

        if (!validate_email && !validate_username) {
            return res.send(Constants.ERROR.ACCOUNT_NOT_MATCH);
        }

        const hash_password = await modules.Account.hash_password(password, 10)

        let insert = await modules.Account.create({
            name,
            email,
            phone,
            username,
            hash_password,
            active: 0
        })

        res.status(200).json({msg: 'register successful', data: insert})
    } catch (error) {
        console.log('........co loi : ', error)
    }
}

async function login(req, res, next) {
    try {
        const {username, password} = Object.assign({}, req.body, req.query);
        const account = await modules.Account.find_account({email: username})

        if (!account) return res.json({msg: 'User not found'})

        const pass_is_correct = await modules.Account.compare_pass_hash(password, account.password)

        if (!pass_is_correct) return res.json({msg: 'Wrong credentials'})

        account.token = await modules.Account.create_token(account)

        let is_Admin = utils.is_admin(account)

        let where = {
            active: 1,
        }

        if (!is_Admin) {
            where["is_admin"] = 0
        }

        let menu = await models.Menu.find({
            where,
            order: [['sort_by', 'ASC']],
            raw: true
        })
        res.status(200).json({error: 0, data: {token: account.token}})

        utils.save_log_history(req, "đăng nhập vào tài khoản..")
    } catch (error) {
        console.log('........co loi : ', error)
    }
}

async function list(req, res) {
    let {page, limit, username, phone, email} = Object.assign({}, req.body, req.query)
    let customer = await models.Account.list({page, limit, username, phone, email});
    let total = customer.count;
    let row = [];
    for (let item in customer.rows) {
        if (!item) continue;
        let {shop_id} = item;
        let shop = {};
        if (shop_id) {
            let sql = `select * from shops where id=${shop_id}`;
            let [rows] = mysqlpool.query(sql);
            if (rows && rows.length) {
                shop = rows[0];
            }
            item.shop = shop;
        }
        row.push(item)
    }
    res.send({error: 0, accounts: row, total})
}

async function details(req, res) {
    let {id} = Object.assign({}, req.body, req.query)
    let account = await modules.Account.get({id})
    return res.send({error: 0, account})
}

async function get_captcha(req, res) {
    let {uid} = req.query;
    uid = String(uid).replace(/^-$/g, '')
    let cap_text = parseInt(Math.random() * 9000 + 1000)
    logger.info('captext', cap_text)

    let keydata=create_captcha(uid, cap_text)
    logger.info('captcha',keydata)
    await redispool.setS(keydata,0,{EX:3600})

    res.setHeader('keydata',keydata)
    res.setHeader("access-control-expose-headers","keydata,captext")

    let p = new captchapng(80,30,cap_text); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    const img = p.getBase64();
    const imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}








router.postS(__filename, '/login', login, false)
router.postS(__filename, '/register', register, false)
router.getSS(__filename, '/list', list, true)
router.getSS(__filename, '/details', details, true)
router.getSS(__filename, '/get_captcha', get_captcha, false)

module.exports = router