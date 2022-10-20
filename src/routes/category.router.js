const router = require('../core/router').Router()
const {models} = require('../db/index')
const {modules} = require('../modules/index')
const mysqlpool = require('../util/mysqlpool')

async function list(req, res) {
    let {page,limit} =req.body;
    page=(!page||page===0)? 1 : parseInt(page)
    limit=(!limit)? 10 : parseInt(limit)
    const list_category=await modules.Categorie.list({page,limit})
    return res.send({error: 0,data: list_category})
}

async function create(req, res) {
    let {thumb, name} = req.body;
    let create_category = models.categories.create({thumb: thumb, name: name})
    return res.send({error: 0, data: create_category})
}

async function update(req, res) {
    let {id}=req.body;

    let body=Object.assign({}, req.body)
    delete body.id;

   id=parseInt(id)||0;
   if(!id){
       return res.send({error:1,data:'ko tim thay thong tin danh muc'})
   }

   let sql=`select * from categories where id=${id}`
    let [categories]=await mysqlpool.query(sql)
    if(!categories){
        return res.send({error:1,data:'ko ton tai '})
    }

    // tien hanh update
      sql = `update categories set`









}

async function _delete(req, res) {
    let {id} = req.params;
    await models.Categorie.destroy({
        where: {
            id
        }
    })
    return res.send({error: 0})
}

async function detail(req, res) {
    let {id} = req.params;
    let detail_categories = await modules.Categorie.get({id})
    return res.send({error: 0, data:detail_categories})
}

async function list_v2(req, res) {

}

async function list_cms(req, res) {

}


router.getSS(__filename, '/list', list, false)

router.postS(__filename, '/create', create, true)
router.postS(__filename, '/update', update, true)
router.postS(__filename, '/_delete/:id([0-9]+)', _delete, true)
router.postS(__filename, '/detail/:id([0-9]+)', detail, true)

router.getSS(__filename, '/list_v2', list_v2, true)
router.getSS(__filename, '/list_cms', list_cms, true)


module.exports = router