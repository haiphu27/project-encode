const {models} = require('../db/index')
const jwt = require("jsonwebtoken");
const {secret_jwt} = require('../../config/setting')
const bcrypt = require("bcrypt");






async function find({username,phone,email}) {
    const account = await models.account.findOne({
        where: {
                $or:[
                    {username},
                    {phone},
                    {email}
                     ]
        },
        raw: true
    })
    return account;
}





async function create_token(account) {
    return await jwt.sign({
        id_user: account.id_user,
        username: account.username
    }, secret_jwt);
}

async function compare_pass_hash(password, pass_hash) {
    return await bcrypt.compare(password, pass_hash)
}

async function hash_password(password, salt) {
    return await bcrypt.hashSync(password, salt)
}

async function create({name,email,phone,username,password,active}) {
    return await models.account.create({
        name,
        email,
        phone,
        username,
        password,
        active
    })
}

async function list({page, limit, username, phone, email}) {
    page = (!page || page===0) ? 1 : parseInt(page)
    limit= !limit ? 10 :parseInt(limit)

    let where=null;
    if( username|| phone || email){
        where=JSON.parse(JSON.stringify({username,phone,email}))
    }
    let customer=await models.Account.findAndCountAll({
        where,
        offset:(page-1)*limit,
        limit,
        order:[['id','desc']],
        raw: true
    })
    return customer;
}

async function get({id}){
    const customer = await models.account.findOne({
        where: {
            id
        },
        raw: true
    })
    return customer;
}

























module.exports = {
    find,
    create_token,
    compare_pass_hash,
    hash_password,
    create,
    list,
    get,
}