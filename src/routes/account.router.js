const router = require('../core/router').Router()
const {modules} = require("../modules/index")
const {models} = require("../db/index")
const utils = require("../util/utils")
const CryptoJS = require("crypto-js");
const mysqlpool = require("../util/mysqlpool");
const Constants = require("../config/Constant")
const {logger} = require("../util/logger");
const redispool = require("../util/redispool");
const RedisPool = require("../util/redispool");
const Op = require("sequelize").Op
const nodemailer = require("nodemailer")
const smtp_transport = require("nodemailer-smtp-transport")

function en_crypto_text(text) {
    return CryptoJS.AES.encrypt(text, 'secret key 123').toString()
}
function de_crypto_text(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return bytes.toString(CryptoJS.enc.Utf8);
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

async function get_captcha(req, res) {
    let {uid} = req.query;
    uid = String(uid).replace(/^-$/g, '')
    let cap_text = parseInt(Math.random() * 9000 + 1000)
    logger.info('captext', cap_text)

    let keydata = create_captcha(uid, cap_text)
    logger.info('captcha', keydata)
    await redispool.setS(keydata, 0, {EX: 3600})

    res.setHeader('keydata', keydata)
    res.setHeader("access-control-expose-headers", "keydata,captext")

    let p = new captchapng(80, 30, cap_text); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    const img = p.getBase64();
    const imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
}
function create_captcha(uid, capstr) {
    let body = {uid, capstr};
    body = JSON.stringify(body);
    let captcha = "captcha-" + Date.now() + "-" + body;
    return en_crypto_text(captcha)
}

//account
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
async function update(req, res) {
    let {name, email, shop_id, phone, password, id, permission, active} = req.body;
    let customer = await models.Account.get({id})
    if (!customer) return res.send(Constants.ERROR.ACCOUNT_NOT_EXITS)

    let where = null;
    if (email || phone) {
        where = utils.escape_null_querry({email, phone})
    }
    if (where) {
        let customer_email = await models.Account.findOne({
            where: {
                [Op.or]: {
                    id: {
                        [Op.ne]: customer.id
                    },
                    [Op.or]: where
                }
            }
        })
        if (customer_email && customer_email.id !== customer.id) {
            return res.send(Constants.ERROR.ACCOUNT_IS_EXIT)
        }
    }

    //update
    let update = await models.Account.update({
        name, email, phone, password, active, permission, shop_id
    }, {
        where: {
            id
        }
    })
    res.send({error: 0, update})
}
async function _delete(req, res) {
    let {id} = req.params;
    await models.Account.destroy({where: {id}})
    res.send({error: 0})
}
async function info(req, res) {
    const info = Object.assign({}, req.account, {id: 3})
    return res.send({error: 0, res: info})
}

// ma xac thuc lay lai password ve gmail
async function get_captcha_verify(req, res) {
    //check email+ create code
    const {email} = req.body
    if (!email) return res.send({error: 1, msg: "please enter email"})
    let code = Math.floor(Math.random() * 90000 + 100)
    await RedisPool.setS(email, code)
    setTimeout(() => {
        RedisPool.delS(email)
    }, 2 * 60 * 1000)
    //gui ve email
    send_email(email, "Mã xác thực lấy lại mật khẩu", `mã xác thực là ${code} time hợp lệ là 2 phút khi nhận email`)

    //return
    return res.send({
        error: 0,
        msg: 'take code_opt success',
        otp: code
    })
}
async function send_email(to_email, title, message) {
    const from_email = 'phunh@vgsholding.com'
    const password = ''
    let transporter = nodemailer.createTransport(smtp_transport({
        service: 'gmail',
        host: "smtp.gmail.com",
        auth: {
            user: from_email,
            pass: password,
        },
    }))

    const content_mail={
        from_email,
        to_email,
        title,
        message
    }
    return new Promise((resolve, reject) => {
        transporter.sendMail(content_mail,(error,info)=>{
            if(error){
                reject({error: 1, msg_err:error.message})
            }
            resolve({error:0,msg:info})
        })
    })
}

//password
async function change_password(req, res){
    try{

    }catch(e){
        res.send({error: 1,msg:"có lỗi xảy ra !!!"})
    }
}

router.postS(__filename, '/login', login, false)
router.postS(__filename, '/register', register, false)
router.getSS(__filename, '/list', list, true)
router.getSS(__filename, '/details', details, true)
router.getSS(__filename, '/get_captcha', get_captcha, false)
router.getSS(__filename, '/info', info, true)
router.postS(__filename, '/update', update, true)
router.postS(__filename, '/delete/:id([0-9]+)', _delete, true)
router.postS(__filename, '/get_captcha_verify', get_captcha_verify, false)

module.exports = router