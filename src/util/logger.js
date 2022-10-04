
const logj4=require('log4js')
const {loggerj4}=require('../../config/setting')
logj4.configure(loggerj4)
const logger=logj4.getLogger()
module.exports={
    log:logger,
    logger:logger
}
