
class Modules {
    static init() {
        this.modules={};
        this.modules.Account=require('./Account')
        this.modules.Country=require('./Country')
        this.modules.GolferAddress=require('./Golfer_address')
    }
}

Modules.init();
module.exports = Modules;