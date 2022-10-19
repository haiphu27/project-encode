const router = require('../core/router').Router()
const {modules}=require('../modules/index')
const RedisPool = require("../util/redispool");

async function list_country(req, res) {
    try {
        const list_country = await modules.Country.list()
        const key = req.route.path.split('/')[1];
        RedisPool.setS(key, JSON.stringify(list_country))
        return res.status(200).json(list_country)
    } catch (error) {
        console.log('........co loi : ', error)
    }
}

router.getSS(__filename, '/list', list_country, true)

module.exports = router