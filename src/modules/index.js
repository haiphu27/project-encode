
class Modules {
    static init() {
        this.modules={};
        this.modules.Account=require('./Account')
        this.modules.Country=require('./Country')
    }
}

Modules.init();
module.exports = Modules;