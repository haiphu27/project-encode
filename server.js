const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config()
const helmet = require('helmet')
const xss = require('xss-clean')
const path=require('path')
const rateLimit = require("express-rate-limit");
const { redisClient } = require('./config/setting');
const load_router = require('./src/loadfile/load-router')
const load_model = require('./src/loadfile/load-model')
const { sequelize } = require('./config/setting')
const {logger}=require('./src/util/logger')
const logj4=require('log4js')


//connect mysql + redis load +model 
sequelize.authenticate().then(async () => {
    await load_model(sequelize)
    await redisClient.connect()
        .then(() => {
            console.log('connected to Redis server')
        })
        .catch(err => console.error(err))
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

//add header
app.use((err,req,res,next)=>{
    //web to alow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    //alow to request method
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

    //alow to request header
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    //alow to check credential with cookie
    res.setHeader("Access-Control-Allow-Credentials", true);

    next();
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(xss())

//rate limit (max 60 request per 10 minutes)
const rate_limit = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 60, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour"
})

//load all router
load_router(app, rate_limit)

//error handler
app.use((err, req, res, next) => {
    return res.status(500).json({ message: err.message });
})

app.use(
    logj4.connectLogger(logger, {
        level: logj4.levels.INFO,
    }
))

const path_log=
{
    uploads:{
        baseUri:'/static/uploads/',
        folder:'./uploads/'
    }
}

Object.values(path_log).forEach(({baseUri,folder}) => {
    logger.info(`static files`, baseUri, '->', folder);
app.use(baseUri, express.static(path.join(__dirname, folder)));
})


module.exports = app;
