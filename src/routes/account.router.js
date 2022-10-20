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

const PERMISSIONS = {
    SALE_MANAGER: 'sale_manager',
    SALE: 'sale'
}

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


async function get_captcha_verify(req, res) {
    //check email+ create code
    const {email} = req.body
    if (!email) return res.send({error: 1, msg: "please enter email"})
    let code = Math.floor(Math.random() * 90000 + 100)
    await RedisPool.setS(email, code)
    setTimeout(() => {
        RedisPool.delS(email)
    }, 2 * 60 * 1000)
    //check email

    //gui ve email
    await send_email(email, "Mã xác thực lấy lại mật khẩu", `mã xác thực là ${code} time hợp lệ là 2 phút khi nhận email`)

    //return
    return res.send({
        error: 0,
        msg: 'take code_opt success',
        otp: code
    })
}

async function check_email(email) {
    if (email === null || email === undefined) {
        email = ''
    }
    let emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    let vali_email = email.match(emailRegex)

    if (vali_email == null) {
        return false
    }
    return true
}

async function send_email(to_email, title, message, res) {
    let result = await check_email(to_email)
    if (result === false) {
        return res.send({error: 1, msg: 'gmail incorrect'})
    }
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

    const content_mail = {
        from_email,
        to_email,
        title,
        message
    }
    return new Promise((resolve, reject) => {
        transporter.sendMail(content_mail, (error, info) => {
            if (error) {
                reject({error: 1, msg_err: error.message})
            }
            resolve({error: 0, msg: info})
        })
    })
}

async function change_password(req, res) {
    try {
        let {old_pass, new_pass} = Object.assign({}, req.query, req.body)
        let {account} = req;
        if (account || account.id) {
            return res.send({error: 1, msg: "tài khoản không tồn tại hoặc đã bị xóa"})
        }
        const [row] = await mysqlpool.query(`select *from accounts where id =${account.id}`)
        if (!row || row.length) {
            res.send({error: 1, msg: "tài khoản không tồn tại hoặc đã bị xóa"})
        }
        const {active, password} = row[0];
        if (!active) {
            return res.send({error: 1, msg: "tài khoản đang bị khóa"})
        }

        if (old_pass.trim() === password) {
            let sql = `update accounts set password=${new_pass.trim()} where id = ${account.id}`;
            let [update] = await mysqlpool.query(sql)
            if (!update) {
                return res.send({error: 1, msg: 'đổi mật khẩu không thành công'})
            }
            return res.send({error: 0, msg: "đổi mật khẩu thành công!!"})
        } else {
            return res.send({error: 1, msg: "mật khẩu cũ không trùng khớp!!"})
        }
    } catch (e) {
        res.send({error: 1, msg: "có lỗi xảy ra !!!"})
    }
}

async function forgot_password(req, res) {
    try {
        let {email, new_password, otp} = req.body;
        let sql = `select * from accounts where email='${email}'`
        let [row] = await mysqlpool.query(sql)
        if (!row) res.send({error: 1, msg: 'tài khoản không tồn tại'})

        let code = await redispool.getS(email)
        if (code !== otp.trim()) {
            return res.send({error: 1, msg: 'opt sai or đã hết hạn'})
        }
        await RedisPool.delS(email)

        //đúng otp tiến hành update password
        sql = `update accounts set password='${new_password}' where email='${email}'`
        let [update] = await mysqlpool.query(sql)
        if (!update) {
            return res.send({error: 1, msg: 'change_password fail'})
        }
        return res.send({error: 1, msg: 'change_password success'})
    } catch (e) {
        res.send({error: 1, msg: "có lỗi xảy ra !!!"})
    }
}


async function list_tele_sale(req, res) {
    try {
        let sql = `select * from accounts where permission_id='sale'`
        let [data] = await mysqlpool.query(sql)
        if (!data) return res.send({error: 1, msg: 'không tìm thấy list_tele_sale'})
        return res.send({error: 0, data})
    } catch (e) {
        res.send({error: 1, msg: error.message})
    }
}

async function get_profile(req, res) {
    try {
        //kiem tra co info account chua
        let {account} = req;
        if (!account) {
            return res.send({error: 1, msg: 'chưa có thông tin tài khoản'})
        }
        //tim tai khoan trả về trừ pass + sdt
        let sql = `select * from accounts where id =${account.id}`
        let [rows] = await mysqlpool.query(sql)
        let data = rows && rows.length ? rows[0] : {}
        delete data.phone , data.password
        return res.send({error: 0, data})
    } catch (e) {
        res.send({error: 1, msg: error.message})
    }
}

async function update_profile(req, res) {
    try {
        let {name, avatar, password} = req.body

        //kiem tra co info account chua
        let {account} = req;
        if (!account) {
            return res.send({error: 1, msg: 'chưa có thông tin tài khoản'})
        }

        //tien hanh update
        //phần đầu
        let sql = `update accounts set `

        //phần set update
        if (name && name.trim().length) {
            sql = `${sql} name="${name}",`
        }
        if (avatar && avatar.trim().length) {
            sql = `${sql} name="${avatar}",`
        }
        if (password && password.trim().length) {
            sql = `${sql} name="${password}",`
        }

        //phần where
        let lastIndex = sql.lastIndexOf(',');
        if (lastIndex && lastIndex === sql.length - 1) {
            sql = `${sql} where id =${account.id} and active=1`
        }
        //update
        let [update] = await mysqlpool.query(sql)
        if (!update) {
            return res.send({error: 1, msg: 'update fail'})
        }

        //account after updater
        let [new_account] = await mysqlpool.query(`select * from accounts where id=${account.id}`)
        utils.save_log_history(req, "cập nhật thông tin tài khoản")
        return res.send({error: 0, msg: 'update success', data: new_account[0]})
    } catch (e) {
        res.send({error: 1, msg: error.message})
    }
}

async function list_menu(req, res) {
    try {
        let is_admin = false;
        let {id} = req.account;
        let account = await models.Account.findOne({
            where: {
                id
            }
        })

        if (account.prefix_domain) {
            is_admin = true;
            if (account.prefix_domain === 'account') {
                let sql = `select * from menus where active=1 and account=1`
                let [data] = await mysqlpool.query(sql)
                delete data.password, data.phone
                return res.send({error: 0, menu: data[0], account: account})
            }
        }

        let where = {
            active: 1
        }

        if (!is_admin) {
            where['is_admin'] = 0
        }

        let menu = await models.Menu.findAll({
            where,
            order: [['sort by', 'ASC']],
            raw: true
        })

        let {permission_id} = account;

        //loại bỏ các user không có quyền sale
        if (permission_id !== PERMISSIONS.SALE_MANAGER) {
            let index = menu.findIndex(d => d.path === '/Delivery_admin')
            if (index !== -1) {
                menu.splice(index, 1)
            }
            index = menu.findIndex(d => d.path === '/BillManage')
            if (index !== -1) {
                menu.splice(index, 1)
            }
        }

        if (permission_id !== PERMISSIONS.SALE) {
            let index = menu.findIndex(d => d.path === '/JobDaily')
            if (index !== -1) {
                menu.splice(index, 1)
            }
        }

        if (permission_id === PERMISSIONS.SALE) {
            let index = menu.findIndex(d => d.path === '/Delivery')
            if (index !== -1) {
                menu.splice(index, 1)
            }
        }
        delete account.password,account.phone
        return res.send({error:0, menu:account})
    } catch (e) {
        res.send({error: 1, msg: error.message})
    }
}


//đăng ký ,đăng nhập
router.postS(__filename, '/login', login, false)
router.postS(__filename, '/register', register, false)

//list-menu
router.getSS(__filename, '/list-menu', list_menu, true)

//list tele_sale
router.getSS(__filename, '/list_tele_sale', list_tele_sale, true)

//profile
router.getSS(__filename, '/get_profile', get_profile, true)
router.postS(__filename, '/update_profile', update_profile, true)

//password
router.postS(__filename, '/change_password', change_password, true)
router.postS(__filename, '/forgot_password', forgot_password, true)

//tổng quan account
router.getSS(__filename, '/list', list, true)
router.getSS(__filename, '/details', details, true)
router.getSS(__filename, '/info', info, true)
router.postS(__filename, '/update', update, true)
router.postS(__filename, '/delete/:id([0-9]+)', _delete, true)

//tạo mã xác thực gửi về email lấy lại password
router.postS(__filename, '/get_captcha_verify', get_captcha_verify, false)

//gửi tới  email
router.postS(__filename, '/send_email', send_email, false)

//tạo captcha bằng số :biến nó thành hình ảnh
router.getSS(__filename, '/get_captcha', get_captcha, false)


module.exports = router