const path = require('path')
const fs = require("fs");
const appRoot = require("app-root-path");

module.exports = class Load {
    static load_all_router(app) {
        const rootPath = appRoot.path;
        let routePath = path.join(rootPath, "src", "routes");
        fs.readdirSync(routePath).forEach(async (filename) => {
            try {
                let name = filename.split('.')[0]
                app.use(`/api/${name}`, require(routePath+'/'+name+'.router'));
            } catch (error) {
                console.log(error.message);
            }
        });
    }
}

