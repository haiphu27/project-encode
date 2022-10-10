const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config()
const helmet = require('helmet')
const xss = require('xss-clean')
const path=require('path')
const rateLimit = require("express-rate-limit");
const {logger}=require('./src/util/logger')
const log4js=require('log4js')
const fs = require("fs");

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

//rate limit (max 60 request per 60 minutes)
const rate_limit = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 60, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour"
})

function load_router(app, baseUri) {
    // Tự động tạo routing
    let routerFolder = path.join(__dirname, "./src/routes")
    fs.readdirSync(routerFolder)
        .filter(n => n.toLowerCase().endsWith('.router.js'))
        .map(n => n.replace('.js', ''))
        .forEach(name => {
            const routerFile = `${routerFolder}/${name}`;
            const routerPath =
                name === 'index.router' ? '' : `${name.replace('.router', '')}`;
            const urlPath = `${baseUri}${routerPath}`;
            // logger.info(`loading router ${urlPath} -> ${routerFile}.js`);
            app.use(urlPath,require(routerFile));
        });
}

load_router(app,'/api/')

//error handler
app.use((err, req, res, next) => {
    return res.status(500).json({ message: err.message });
})
// app.use((err, req, res, next) => {
//     const status = err.status || 500;
//     const message = err.message || "something went wrong";
//     res.status(status).json({
//         success: false,
//         status,
//         message
//     })

app.use(
    log4js.connectLogger(logger, {
        level: log4js.levels.INFO,
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
