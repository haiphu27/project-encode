const path = require('path')
const fs = require("fs");
const appRoot = require("app-root-path");

module.exports = (sequelize)=> {
    let routePath = path.join(appRoot.path, "src", "model");
    fs.readdirSync(routePath).forEach(async (filename) => {
        try {
            require(routePath+'/'+filename).init(sequelize).sync();
        } catch (error) {
            console.log(error.message);
        }
    });
}