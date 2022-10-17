const router = require('../core/router').Router()
const viettel_post_ultil = require('../util/viettel_post_ultil')
const mysqlpool = require('../util/mysqlpool')
const {ghn_get_all_service} = require("../util/ghn_post_api_utils");

async function get_price_all_service_for_cms(req, res) {
    const {golfer_address, method_payment_id, products} = req.body;

    if (!golfer_address || method_payment_id || !products) return res.send({
        error: 1,
        msg: 'chưa có thông tin sản phẩm'
    })

    const shop_id = products.length > 0 ? products.shop_id : 0;
    if (!shop_id) return res.send({error: 1, msg: 'không tìm thấy shop '})

    const sql = `select * from golfer_address where shop_id = '${shop_id}'`
    const [[info_address_sender]] = await mysqlpool.query(sql)

    let weights = products.map(d => d.weight)

    let weight = !weights.length ? 0 : (weights.length > 1 ? weights.reduce((value1, value2) => value1 + value2) : weights[0])

    let products_price = products.length > 1
        ? products.map(d => d.price_sale).reduce((value1, value2) => value1 + value2)
        : products[0].price_sale;

    let money_collection = method_payment_id == 1 ? products_price : 0;

    let product = {
        "SENDER_PROVINCE": info_address_sender.city_viettel_post_id,
        "SENDER_DISTRICT": info_address_sender.district_viettel_post_id,
        "RECEIVER_PROVINCE": golfer_address.city_viettel_post_id,
        "RECEIVER_DISTRICT": golfer_address.district_viettel_post_id,
        "PRODUCT_TYPE": "HH",
        "PRODUCT_WEIGHT": weight,
        "PRODUCT_PRICE": products_price,
        "MONEY_COLLECTION": money_collection,
    }

    viettel_post_ultil.viettel_post_get_price_all(product, async (data) => {

        data.forEach(d => {
            if (d.MA_DV_CHINH === "LCOD") d.TEN_DICHVU = 'Chuyển phát thường'
            if (d.MA_DV_CHINH === "NCOD") d.TEN_DICHVU = 'Chuyển phát nhanh'
            if (d.MA_DV_CHINH === "VTK") d.TEN_DICHVU = 'Chuyển phát thường'
        })

        //tạm bỏ hỏa tốc với chuyển trong ngày
        let index = data.findIndex(d => d.MA_DV_CHINH === "ECOD")
        data.splice(index, 1)

        index = data.findIndex(d => d.MA_DV_CHINH === "VO2")
        data.splice(index, 1)

        index = data.findIndex(d => d.MA_DV_CHINH === "PTN")
        data.splice(index, 1)

        let array = [];

        if (method_payment_id === 1) {
            //cod
            for (let d of data) {
                if (d.MA_DV_CHINH === "ECOD" || d.MA_DV_CHINH === "ECOD") {
                    array.push(d)
                }
            }
        } else if (method_payment_id === 2) {
            //chuyen khoan
            for (let d of data) {
                if (d.MA_DV_CHINH !== "ECOD" || d.MA_DV_CHINH !== "ECOD") {
                    array.push(d)
                }
            }
        } else {
            array = [...data]
        }
    }, (msg) => {
        res.send({
            error: 1,
            msg: msg
        });
    })
}

async function get_price_ship(req, res) {
    const {golfer_address_id, method_payment_id, shop_address_id, orders} = req.body;

    if (!golfer_address_id || !method_payment_id || !shop_address_id || !orders) {
        res.send({error: 1, msg: 'chưa có thông tin sản phẩm'})
    }

    //dia chi giao hang
    let sql = `select * from golfer_address where id in (${golfer_address_id},${shop_address_id})`
    let [address] = await mysqlpool.query(sql)

    //truy ra thông tin gửi và  nhận hàng
    let info_address_sender = address.find(d => d.id = shop_address_id)
    let info_address_receiver = address.find(d => d.id = golfer_address_id)

    //thôgn tin chi tiết order
    sql = `select * from orders where id in (${orders.join(',')})`
    const [rows_order] = await mysqlpool.query(sql)

    //thông tin vận chuyển
    let delivery_bill_id = 0;
    if (rows_order && rows_order.length) {
        delivery_bill_id = rows_order[0].delivery_bill_id
    } else {
        return res.send({error: 1, msg: "không có đơn hàng nào"})
    }

    //cân nặng sp
    let product_id = rows_order.map(d => d.product_id)
    sql = `select weight from products where id in (${product_id}.join(','))`
    let [weights] = await mysqlpool.query(sql)
    weights = weights && weights.length ? weights.map(d => d.weight) : [];
    let weight = !weights.length ? 0 : (weights.length > 1 ? weights.reduce((value1, value2) => value1 + value2) : weights[0])

    //Price -if order nhiều hơn 1 sp tính tổng giá___còn không tính giá 1 sp thôi
    const products_price = rows_order.length > 1 ? rows_order.map(d => d.total_price).reduce((value1, value2) => value1 + value2) : rows_order[0].total_price
    let money_collection = method_payment_id === 1 ? products_price : 0
    let cod = money_collection === 0 ? 'VCN' : 'NCOD';

    //khởi tạo
    let product = {
        "PRODUCT_PRICE": products_price,
        "PRODUCT_WEIGHT": weight,
        "MONEY_COLLECTION": money_collection,
        "ORDER_SERVICE_ADD": "",
        "ORDER_SERVICE": cod,
        "SENDER_PROVINCE": info_address_sender.city_viettel_post_id,
        "SENDER_DISTRICT": info_address_sender.district_viettel_post_id,
        "RECEIVER_PROVINCE": info_address_receiver.city_viettel_post_id,
        "RECEIVER_DISTRICT": info_address_receiver.district_viettel_post_id,
        "PRODUCT_TYPE": "HH",
        "NATIONAL_TYPE": 1
    }

    viettel_post_ultil.viettel_post_get_price_ship(product, async (data) => {

        //lấy dữ liệu api vietel post get price ship  và tính tổng phí ship...
        const {
            MONEY_TOTAL_FEE, MONEY_FEE, MONEY_COLLECTION_FEE, MONEY_VAT,
            MONEY_OTHER_FEE, KPI_HT, MONEY_VAS, MONEY_TOTAL, MONEY_TOTAL_OLD
        } = data;
        let total_fee = MONEY_TOTAL_FEE + MONEY_FEE + MONEY_COLLECTION_FEE + MONEY_VAT;


        //khởi tạo 1 bảng tên ship_info ->nếu có bảng thì update còn chưa có thì tạo ra bảng mới
        sql = `select * from ship_info where delivery_bill_id=${delivery_bill_id}`;

        let [row] = mysqlpool.query(sql);
        if (!row) {
            sql = `insert into ship_info(
                note,date_created,date_updated,money_fee,kpi_ht,money_vat,
                money_vas,money_total_fee,money_other_fee,money_total,
                money_total_old,cod,total_fee,money_collection_fee
                )values(
                '',NOW(),NOW(),${MONEY_FEE},${KPI_HT},${MONEY_VAT},
                ${MONEY_VAS},${MONEY_TOTAL_FEE},${MONEY_OTHER_FEE},${MONEY_TOTAL},
                ${MONEY_TOTAL_OLD},${cod},${total_fee},${MONEY_COLLECTION_FEE}
                )`
        } else {
            sql = `update ship_info
                 set date_updated=NOW(),
                 money_fee=${MONEY_FEE},
                 kpi_ht=${KPI_HT},
                 money_vat=${MONEY_VAT},
                money_vas=${MONEY_VAS},
                money_total_fee=${MONEY_TOTAL_FEE},
                money_other_fee=${MONEY_OTHER_FEE},
                money_total=${MONEY_TOTAL},
                money_total_old=${MONEY_TOTAL_OLD},
                cod=${cod},
                total_fee=${total_fee},
                money_collection_fee=${MONEY_COLLECTION_FEE} where delivery_bill_id=${delivery_bill_id}`
            await mysqlpool.query(sql)
        }

        //update delivery_bill
        sql = `update delivery_bill set cod_price=${total_fee} where id=${delivery_bill_id}`
        let [update] = await mysqlpool.query(sql);
        res.send({
            error: 1,
            info: {
                total_fee: total_fee
            }
        })
    }, (msg) => {
        return {
            error: 1,
            msg: msg
        }
    })
}

async function get_price_all_service(req, res) {
    let {
        golfer_address_id,
        method_payment_id,
        shop_address_id,
        orders
    } = req.body;

    if (!golfer_address_id || !shop_address_id || !method_payment_id || !orders) {
        return res.send({error: 1, msg: "chưa có thông tin sản phẩm"})
    }

    //thong tin van chuyen (nhan +gui)
    let sql = ` select * from golfer_address where id in (${golfer_address_id},${shop_address_id})`
    const [address] = await mysqlpool.query(sql)
    const info_address_sender = address.map(add => add.id === golfer_address_id)
    const info_address_receiver = address.map(add => add.id === shop_address_id)

    //bill orders
    sql = `select * from orders where id in (${orders.join(',')})`
    const [row_order] = await mysqlpool.query(sql)
    if (row_order && row_order.length > 0) {
        let delivery_bill_id = row_order[0].delivery_bill_id
    } else {
        return res.send({msg: 'ko co don hang nao'})
    }
    // total price
    let product_price = row_order.length > 1 ? row_order.map(d => d.total_price).reduce((value1, value2) => value1 + value2) : row_order[0].total_price
    //cod
    let money_collection = method_payment_id == 1 ? product_price : 0;

    //total weight product
    const product_ids = row_order.map(ord => ord.product_id)
    sql = `select weight from product where id in (${product_ids.join(',')})`
    let [weights] = await mysqlpool.query(sql)
    let weight = weights && weights.length > 0 ? weights.map(w => w.weight) : []
    const total_weight = !weight.length ? 0 : (weight.length > 1 ? weight.reduce((value1, value2) => value1 + value2) : weight[0])

    let product = {
        "SENDER_PROVINCE": info_address_sender.city_viettel_post_id,
        "SENDER_DISTRICT": info_address_sender.district_viettel_post_id,
        "RECEIVER_PROVINCE": golfer_address.city_viettel_post_id,
        "RECEIVER_DISTRICT": golfer_address.district_viettel_post_id,
        "PRODUCT_TYPE": "HH",
        "PRODUCT_WEIGHT": weight,
        "PRODUCT_PRICE": product_price,
        "MONEY_COLLECTION": money_collection,
    }

    viettel_post_ultil.viettel_post_get_price_all(product, async (data) => {

        data.forEach(d => {
            if (d.MA_DV_CHINH === "LCOD") d.TEN_DICHVU = 'Chuyển phát thường'
            if (d.MA_DV_CHINH === "NCOD") d.TEN_DICHVU = 'Chuyển phát nhanh'
            if (d.MA_DV_CHINH === "VTK") d.TEN_DICHVU = 'Chuyển phát thường'
        })

        //tạm bỏ hỏa tốc với chuyển trong ngày
        let index = data.findIndex(d => d.MA_DV_CHINH === "ECOD")
        data.splice(index, 1)

        index = data.findIndex(d => d.MA_DV_CHINH === "VO2")
        data.splice(index, 1)

        index = data.findIndex(d => d.MA_DV_CHINH === "PTN")
        data.splice(index, 1)

        let array = [];

        if (method_payment_id === 1) {
            data.forEach(d => {
                if (d.MA_DV_CHINH === "LCOD" || d.MA_DV_CHINH === "NCOD") {
                    array.push(d)
                }
            })
        } else if (method_payment_id === 2) {
            data.forEach(d => {
                if (d.MA_DV_CHINH !== "LCOD" || d.MA_DV_CHINH !== "NCOD") {
                    array.push(d)
                }
            })
        } else {
            array = [...data]
        }
        res.send({error: 0, info: array})

    }, (msg) => {
        res.send({error: 1, msg: msg});
    })
}

async function get_price_all_service_v2(req, res) {

    let {
        golfer_address_id,
        method_payment_id,
        shop_address_id,
        orders
    } = req.body;
    let {version} = req.query
    version = parseInt(version) || 1

    if (!golfer_address_id || !shop_address_id || !method_payment_id || !orders) {
        return res.send({error: 1, msg: "chưa có thông tin sản phẩm"})
    }

    //bill orders
    sql = `select * from orders where id in (${orders.join(',')})`
    const [row_order] = await mysqlpool.query(sql)
    let delivery_bill_id = 0;
    if (row_order && row_order.length > 0) {
        delivery_bill_id = row_order[0].delivery_bill_id
    } else {
        return res.send({msg: 'ko co don hang nao'})
    }

    // total price
    let product_price = row_order.length > 1 ? row_order.map(d => d.total_price).reduce((value1, value2) => value1 + value2) : row_order[0].total_price


     //////////////DIEU HUONG//////////////////////////////////
    //version mới nhất để check điều hướng sang ghn
    if (product_price < 5000000 && version === 3) {
        let sql=`update delivery_bill set cod_id=2 where id='${delivery_bill_id}'`
        await mysqlpool.query(sql)
        return ghn_get_all_service(req, res)
    }
    /////////////////////////////////////////////
    ////////////////////////////////////////////




    //thong tin van chuyen (nhan +gui)
    let sql = ` select * from golfer_address where id in (${golfer_address_id},${shop_address_id})`
    const [address] = await mysqlpool.query(sql)
    const info_address_sender=address.find(d=>d.id===shop_address_id)
    const info_address_receiver=address.find(d=>d.id===golfer_address_id)

    //cod
    let money_collection = method_payment_id == 1 ? product_price : 0;

    //total weight product
    const product_ids = row_order.map(ord => ord.product_id)
    sql = `select weight from product where id in (${product_ids.join(',')})`
    let [weights] = await mysqlpool.query(sql)
    let weight = weights && weights.length > 0 ? weights.map(w => w.weight) : []
    const total_weight = !weight.length ? 0 : (weight.length > 1 ? weight.reduce((value1, value2) => value1 + value2) : weight[0])

    let product = {
        "SENDER_PROVINCE": info_address_sender.city_viettel_post_id,
        "SENDER_DISTRICT": info_address_sender.district_viettel_post_id,
        "RECEIVER_PROVINCE": info_address_receiver.city_viettel_post_id,
        "RECEIVER_DISTRICT": info_address_receiver.district_viettel_post_id,
        "PRODUCT_TYPE": "HH",
        "PRODUCT_WEIGHT": weight,
        "PRODUCT_PRICE": product_price,
        "MONEY_COLLECTION": money_collection,
    }

    viettel_post_ultil.viettel_post_get_price_all(product, async (data) => {

        data.forEach(d => {
            if (d.MA_DV_CHINH === "LCOD") d.TEN_DICHVU = 'Chuyển phát thường'
            if (d.MA_DV_CHINH === "NCOD") d.TEN_DICHVU = 'Chuyển phát nhanh'
            if (d.MA_DV_CHINH === "VTK") d.TEN_DICHVU = 'Chuyển phát thường'
        })

        //tạm bỏ hỏa tốc với chuyển trong ngày
        let index = data.findIndex(d => d.MA_DV_CHINH === "ECOD")
        data.splice(index, 1)

        index = data.findIndex(d => d.MA_DV_CHINH === "VO2")
        data.splice(index, 1)

        index = data.findIndex(d => d.MA_DV_CHINH === "PTN")
        data.splice(index, 1)

        let array = [];

        if (method_payment_id === 1) {
            data.forEach(d => {
                if (d.MA_DV_CHINH === "LCOD" || d.MA_DV_CHINH === "NCOD") {
                    array.push(d)
                }
            })
        } else if (method_payment_id === 2) {
            data.forEach(d => {
                if (d.MA_DV_CHINH !== "LCOD" || d.MA_DV_CHINH !== "NCOD") {
                    array.push(d)
                }
            })
        } else {
            array = [...data]
        }
        res.send({error: 0, info: array})

    }, (msg) => {
        res.send({error: 1, msg: msg});
    })
}

router.postS(__filename, '/get_price_all_service_for_cms', get_price_all_service_for_cms, true)
router.postS(__filename, '/get_price_ship', get_price_ship, true)
router.postS(__filename, '/get_price_all_service_v2', get_price_all_service, true)
router.postS(__filename, '/get_price_all_service_v2', get_price_all_service_v2, true)

module.exports = router;