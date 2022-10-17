const base_url = 'https://online-gateway.ghn.vn/shiip/public-api/';
const ghn_api= require('../config/ghn_api')
const network = require("./network");
const shop_id = 2562642;




















module.exports.get_all_services= function (from_district,to_district,callback,callError) {
    let url=base_url+ghn_api.all_service(shop_id,from_district,to_district)
    network.httpRequestPost(url,)

}