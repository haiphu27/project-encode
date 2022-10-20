const {models}= require('../db/index')

async function get({id}){
    let categories = await models.Categorie.findOne({
        where: {
            id
        }
    })
    return categories
}

async function list({page,limit}){
    let where= {};
    await models.Categorie.findAndCountAll({
        where,
        offset:(page - 1)* limit,
        limit,
        order:[['sort_categories', 'asc']],
        raw: true
    })
}

module.exports ={
    get,
    list
}