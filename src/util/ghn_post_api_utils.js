//Check xem da nhan ve het data chua
const mysqlpool = require("express");
const ghn_post_ultil = require("./ghn_post_util");

function check_recever_all(data = []) {
    if (!data.length) return 0;
    let filter = data.map(d => {
        return d.hasOwnProperty('price_code') && d.hasOwnProperty('time_ship')
    })
    if (filter.length === data.length) {
        let check = filter.filter(d => d.price_code && d.time_ship)
        return check.length === filter.length ? 1 : 0
    }
    return -1
}


function check_status(data = [], res) {
    let check = check_recever_all(data);

    if (check === 1) {
        data.forEach(d => {
            d.GIA_CUOC = d.price_code
            d.TEN_DICHVU = d.short_name
            let time_ship = d.time_ship_data.leadtime - Math.round(Date.now() / 1000)
            let hour = Math.round(time_ship / 3600)
            d.MA_DV_CHINH = "GHN_SERVICE"
            d.THOI_GIAN = `${hour} giờ`
        })
        return res.send({error: 0, info: data})
    } else if (check === 0) {
        data.forEach(d => {
            d.GIA_CUOC = d.price_code
            d.TIEN_DICHVU = d.short_name
            let time_ship = d.time_ship - Math.round(Date.now() / 10000)
            let hour = Math.round(time_ship / 3600)
            d.MA_DV_CHINH = "GHN_SERVICE"
            d.THOI_GIAN = `${hour} giờ`
        })
    }
}

module.exports.ghn_get_all_service = async function (req, res) {

    let {
        shop_address_id,
        method_payment_id,
        golfer_address_id,
        orders
    } = req.body;

    shop_address_id = parseInt(shop_address_id) || 0
    golfer_address_id = parseInt(golfer_address_id) || 0

    //dia chi giao nhan
    let sql = `select * from golfer_address where id in (${shop_address_id},${golfer_address_id})`
    const [address] = await mysqlpool.query(sql)
    const info_address_sender = address.find(d => d.id === shop_address_id)
    const info_address_receiver = address.find(d => d.id === golfer_address_id)

    // địa chỉ từ tỉnh này ->đến tỉnh khác
    const from_district_viettel_post_id = info_address_sender.district_viettel_post_id
    const to_district_viettel_post_id = info_address_receiver.district_viettel_post_id
    // địa chỉ từ town này ->đến town khác
    const from_town_viettel_post_id = info_address_sender.township_viettel_post_id
    const to_town_viettel_post_id = info_address_receiver.township_viettel_post_id


    //order->bill van chuyen
    sql = `select * from orders where id in (${orders.join(',')})`
    const [row_order] = await mysqlpool.query(sql)
    let delivery_bill = 0;
    if (row_order && row_order.length > 0) {
        delivery_bill = row_order[0].delivery_bill_id
    } else {
        res.send({error: 1, msg: 'ko có đơn hàng '})
    }

    // cân nặng
    let products_id = row_order.map(d => d.product_id)
    sql = `select weight from products where id in (${products_id.join(',')})`
    let [weights] = await mysqlpool.query(sql)

    weights = weights && weights.length ? weights.map(d => d.weight) : [];
    let weight = !weights.length ? 0 : (weights.length > 1 ? weights.reduce((value1, value2) => value1 + value2) : weights[0])

    // thong tin tỉnh ben ghn
    sql = `select * from district_map_viettel_with_other where viettel_id in (${from_district_viettel_post_id},${to_district_viettel_post_id})`
    let [ghn_address_district] = await mysqlpool.query(sql)
    //lọc ra tỉnh gửi và tỉnh nhận
    let from_district_ghn = ghn_address_district.find(d => d.viettel_id === from_district_viettel_post_id)
    let to_district_ghn = ghn_address_district.find(d => d.viettel_id === to_district_viettel_post_id)
    if (!from_district_ghn || !to_district_ghn) {
        return res.send({error: 0, msg: 'k tìm thấy địa chỉ giao hàng'})
    }

    //thong tin town ben ghn
    sql = `select * from district_map_viettel_with_other where viettel_id in (${from_town_viettel_post_id},${to_town_viettel_post_id})`
    let [ghn_address_town] = await mysqlpool.query(sql)
    //lọc ra town gửi và town nhận
    let from_town_ghn = ghn_address_district.find(d => d.viettel_id === from_town_viettel_post_id)
    let to_town_ghn = ghn_address_district.find(d => d.viettel_id === to_town_viettel_post_id)
    if (!from_town_ghn || !to_town_ghn) {
        return res.send({error: 0, msg: 'k tìm thấy địa chỉ giao/nhận  hàng'})
    }

    // truyền các thông số vào hàm get_all_services -> trả data về 1 mảng  _>duyêt mảng và
    // trong for tính luôn phí dịch vụ,time nhận hàng dự tính

     ghn_post_ultil.get_all_services(from_district_ghn.ghn_id,to_district_ghn.ghn_id,(data)=>{










     },()=>{
         res.send({
             error: 1,
             msg:'có lỗi vui lòng thử lại sau'
         })
     })

}