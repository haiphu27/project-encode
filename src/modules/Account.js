const {models} =require('../db/index')
const jwt = require("jsonwebtoken");
const {secret_jwt}=require('../../config/setting')
const bcrypt = require("bcrypt");

async function find_account({username}){
    const account = await models.user.findOne({
        where: {username},
        raw: true
    })
    return account;
}

async function create_token(account){
    return  await jwt.sign({
        id_user: account.id_user,
        username: account.username
    },secret_jwt);
}

async function compare_pass_hash(password,pass_hash) {
   return  await bcrypt.compare(password, pass_hash)
}

async function hash_password(password,salt) {
   return  await bcrypt.hashSync(password, salt)
}

async function create_account(username,password) {
    return await models.user.create({username, password})
}

module.exports ={
    find_account,
    create_token,
    compare_pass_hash,
    hash_password,
    create_account
}