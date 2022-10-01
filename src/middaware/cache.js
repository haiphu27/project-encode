const {get} =require('../config/connect-redis')

module.exports=async function cache(req, res, next) {
    const key = req.route.path.split('/')[1];
    const value=get(key);
    if(value!==null) {
        return res.json(JSON.parse(value));
    }else {
        next()
    }
}