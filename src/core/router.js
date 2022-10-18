const express = require("express");
const ThrowReturn = require("./throwreturn")
const jwt = require("jsonwebtoken")
const {secret_jwt} = require("../../config/setting")
const {logger} = require("../util/logger");
const {_T} = require("../util/transaction");
const db = require("../db/index")
const RedisPool = require("../util/redispool")

function process_exception(req, res, error) {
    let language = error.lang || req.query.lang || req.body.lang || 'vi';

    if (typeof error == 'ThrowReturn' || error instanceof ThrowReturn || error.name === 'ThrowReturn') {
        return res.send({
            error: error.code,
            error_msg: _T(error.message, language, ...error.args),
            msg: _T(error.message, language, ...error.args),
        });
    }
//
//     if (msg.startsWith('Validation error:'))
//         msg = msg.replace('Validation error:', '').trim();
//
//     logger.error(error);
//
//     res.send({
//         error: 1,
//         error_msg: _T(msg, language),
//     });
}

async function verify_token(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret_jwt, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        })
    })
}

async function redis_cache(req,res) {
    const key = req.route.path.split('/')[1];
    const value = await RedisPool.getS(key);
    if (value !== null) {
        return res.json(JSON.parse(value));
    }
}

function safefy(callback, validateToken, exception,cache) {
    if (callback.constructor.name === "AsyncFunction") {
        return async function (req, res, ...arg) {
            try {
                if (!validateToken) return callback(req, res, ...arg);
                const {authorization} = Object.assign({}, req.query, req.headers);
                if (!authorization)
                    throw  ThrowReturn.create('missing authorization header').error_code(-1000)
                const account = await verify_token(authorization)
                if (!account) ThrowReturn.create('wrong token || permission denied').error_code(-1000)
                req.account = account;

                // if(cache) return cache(req, res)

                return callback(req, res, ...arg);
            } catch (err) {
                if (exception) exception(req, res, err)
            }
        }
    } else {
        return function (req, res, ...arg) {
            try {
                return callback(req, res, ...arg);
            } catch (err) {
                if (exception) exception(req, res, err)
            }
        }
    }
}

function Router(...args) {
    let router = express.Router(...args);

    router.postS = function (filename, path, callback, validateToken = true, exception = process_exception,cache = redis_cache) {
        // let paths = filename.split('/')
        // let currentPath = []

        // paths.map(path => {
        //     console.log(path,1111111111111111)
        //     if(currentPath.length > 0) {
        //         //check path có đuôi .router.js ko? nếu đúng
        //         if(path.indexOf('.router.js')!=-1) {
        //             path=path.slice(0,path.indexOf('.router.js'))
        //             console.log(path,'path11111111..........')
        //         }else{
        //             currentPath.push(path,'path2222222')
        //         }
        //     }
        //     if(path=='router'){
        //         currentPath.push(path)
        //     }
        // })
        this.post(path, safefy(callback, validateToken, exception,cache));
    }

    router.getSS = function (filename, path, callback, validateToken = true, exception = process_exception,cache = redis_cache) {

        this.get(path, safefy(callback, validateToken, exception,cache))
    }


    //add db to router
    router.db = db;

    router.sequelize = db.sequelize;

    //add models
    router.models = db.models;

    //add redis pool to router
    // router.redispool = redispool;

    //add logger to router
    router.logger = logger;
    return router;
}

module.exports = {Router}