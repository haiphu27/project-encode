const {models} = require('../db/index')
const Utils = require('../util/utils')

async function get({id}) {
    let golfer= await models.GolferAddress.findOne({
        where: {id}
    })
    return golfer;
}


async function list({page, limit, golfer_id, shop_id}) {
    page = (!page || page === 0) ? 1 : parseInt(page)
    limit = (!limit) ? 10 : parseInt(limit)

    let where={};
    if(golfer_id||shop_id){
        where=Object.assign(where,Utils.escape_null_querry({ golfer_id, shop_id}))
    }

    let list_golfer = await models.GolferAddress.findAndCountAll({
        where,
        offset: (page - 1) * limit,
        limit,
        order: [['sort by','asc']],
        raw: true
    })
    return list_golfer
}

module.exports = {
    get,
    list
}

