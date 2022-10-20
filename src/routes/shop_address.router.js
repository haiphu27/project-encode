const router = require('../core/router').Router()
const {models} = require('../db/index')
const {modules} = require('../modules/index')

async function create(req, res) {
    let {address, shop_id, city, district, township, name, phone, is_default} = req.body;

    if (is_default) {
        await models.GolferAddress.update(
            {
                is_default: 0
            },
            {
                where: {
                    shop_id
                }
            }
        )
    }
    let dataCreate = await models.GolferAddress.create({
        address, shop_id, city, district, township, name, phone, is_default
    })
    return res.send({error: 0, data: dataCreate})
}

async function update(req, res) {
    let {address, shop_id, city, district, township, id, name, is_default} = req.body;

    let golfer_address = await modules.GolferAddress.get({id})
    if (!golfer_address) {
        return res.send({error: 1, msg_err: 'ko thấy thông tin này '})
    }

    let _update = await models.GolferAddress.update(
        {
            address, shop_id, city, district, township, name, is_default
        },
        {
            where: {
                id
            }
        }
    )
    return res.send({error: 0, data: _update})
}

async function _delete(req, res) {
    let {id} = req.param;
    await models.GolferAddress.destroy({
        where: {id}
    })
    return res.send({error: 0})
}

async function detail(req, res) {
    let {id} = req.param;
    let golfer_address = await modules.GolferAddress.get({id})
    if(!golfer_address) return res.send({error:1, msg:'ko tim thay '})
    return res.send({error: 0,data:golfer_address})
}

async function list(req, res) {
    let {page, limit, shop_id}=Object.assign({}, req.query,req.body)

    let list_golfer = await modules.GolferAddress.list({page, limit,shop_id})

    return res.send({error:0,list:list_golfer.rows,total:list_golfer.count})
}

async function shop(req, res) {
    let {shop_id}=Object.assign({}, req.body, req.query);
    let shop_address = await models.GolferAddress.findOne({
        where: {
            id:shop_id
        }
    })
    if(!shop_address) return res.send({error:1, msg:'ko tim thay'})
    return res.send({error:0, data:shop_address})
}

router.getSS(__filename, '/create', create, true)
router.getSS(__filename, '/update', update, true)
router.getSS(__filename, '/_delete/:id([0-9]+)', _delete, true)
router.getSS(__filename, '/detail/:id([0-9]+)', detail, true)
router.getSS(__filename, '/list', list, true)
router.getSS(__filename, '/shop/:shop_id([0-9]+)', shop, true)

module.exports = router
