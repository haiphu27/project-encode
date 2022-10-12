const express = require('express');
const app = express();
const cors = require("cors");
require('dotenv').config()
const helmet = require('helmet')
const xss = require('xss-clean')
const logg = require('morgan')
const path = require('path')
const rateLimit = require("express-rate-limit");
const {logger} = require('./src/util/logger')
const log4js = require('log4js')
const fs = require("fs");
const {http} = require("./config/setting");

function load_router(app, baseUri, folder) {
    let routerFolder = path.join(__dirname, folder)
    fs.readdirSync(routerFolder)
        .filter(n => n.toLowerCase().endsWith('.router.js'))
        .map(n => n.replace('.js', ''))
        .forEach(name => {
            const routerFile = `${routerFolder}/${name}`;
            const routerPath =
                name === 'index.router' ? '' : `${name.replace('.router', '')}`;
            const urlPath = `${baseUri}/${routerPath}`;
            // logger.info(`loading router ${urlPath} -> ${routerFile}.js`);
            app.use(urlPath, require(routerFile));
        });
}

//add header
app.use((err, req, res, next) => {
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
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(helmet())
app.use(xss())

function logResponseBody(req, res, next) {
    const oldWrite = res.write
    const oldEnd = res.end;
    const chunks = [];
    res.write = function (chunk) {
        chunks.push(chunk);
        return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk)
            chunks.push(chunk);
        var body = Buffer.concat(chunks).toString('utf8');
        console.log(req.path, body);
        oldEnd.apply(res, arguments);
    };

    next();
}



//rate limit (max 60 request per 60 minutes)
const rate_limit = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 60, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour"
})

app.use(
    log4js.connectLogger(logger, {
            level: log4js.levels.INFO,
        }
    ))

//ghi log...
app.use(logResponseBody);


//static file
Object.values(http.static).forEach(({baseUri, folder}) => {
    logger.info(`static files`, baseUri, '->', folder);
    app.use(baseUri, express.static(path.join(__dirname, folder)));
})

//load_router
Object.values(http.router).forEach(({baseUri, folder}) => {
    load_router(app, baseUri, folder)
})

module.exports = app;







