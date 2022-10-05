const path = require('path')
const fs = require("fs");
const appRoot = require("app-root-path");

module.exports = (app,rateLimit)=> {
   
    let routePath = path.join(appRoot.path, "src", "routes");
        fs.readdirSync(routePath)
        // .filter(file => file.toLowerCase().endsWith(".router.js"))
        // .map(file => file.replace(".js", ""))
        .forEach(async (filename) => {
            try {
                let name = filename.split('.')[0]
                app.use(`/api/${name}`,rateLimit, require(routePath+'/'+name+'.router'));
            } catch (error) {
                console.log(error.message);
            }
        });
}

