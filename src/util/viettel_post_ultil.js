const network = require('./network')

var viettel_post_user_data = '';

module.exports.get_viettel_post_user_data = function () {
    return viettel_post_user_data
}

function set_viettel_post_user_data(data) {
    viettel_post_user_data = data;
}


//Login
function viettel_post_login(callback = null, callError = null) {
    try {
        let url = 'https://partner.viettelpost.vn/v2/uer/Login';

        let formData = {
            "USERNAME": '123',
            "PASSWORD": "123"
        }

        network.httpRequestPost(url, (jsonData) => {
            const {status, data, message} = jsonData
            if (status === 200) {
                set_viettel_post_user_data(Object.assign({}, data))
                if (callback) callback()
            } else {
                if (callError) callError()
            }
        }, formData, () => {
            if (callError) callError()
        })
    } catch (e) {
    }
}


// price ship
function get_price_ship(product, callback = null, callError = null) {
    const url = 'https://partner.viettelpost.vn/v2/order/getPrice';

    network.httpRequestPost(url, jsonData => {
        const {status, data, message} = jsonData

        if (status === 200) {
            if (callback) callback(data)
        } else {
            if (callError) callError(message)
        }
    }, product, () => {
        if (callError) {
            callError()
        }
    }, 0, viettel_post_user_data.token)
}

module.exports.viettel_post_get_price_ship = function (product, callback = null, callError = null) {
    if (!viettel_post_user_data || !viettel_post_user_data.token) {
        viettel_post_login(() => {
            get_price_ship(product, callback, callError)
        })
    } else {
        get_price_ship(product, callback, callError)
    }
}


//Bill order
function viettel_post_create_order(vgs_order, callback = null, callError = null) {
    const url = 'https://partner.viettelpost.vn/v2/order/createOrder';

    network.httpRequestPost(url, jsonData => {
        const {status, data, message} = jsonData
        if (status === 200) {
            if (callback) callback(data)
        } else if (status == 202) {
            //token het han =>login lai
            viettel_post_login(() => {
                viettel_post_create_order(vgs_order, callback, callError)
            })
        } else {
            if (callError) callError(message)
        }
    }, vgs_order, () => {
        if (callError) callError('qu?? time x??? l??')
    }, 0, viettel_post_user_data.token)
}

module.exports.create_bill_order_viettel_post = function (vgs_order, callback = null, callError = null) {
    if (!viettel_post_user_data || !viettel_post_user_data.token) {
        viettel_post_login(() => {
            viettel_post_create_order(vgs_order, callback, callError)
        })
    } else {
        viettel_post_create_order(vgs_order, callback, callError)
    }
}


//formatString (Date:Day,Month,...)
module.exports.formatString = function (number) {
    return number < 10 ? '0' + number : number
}


//list inventory(h??ng t???n)
function list_inventory(callback = null, callError = null) {
    const url = 'https://partner.viettelpost.vn/v2/user/listInventory';

    network.httpRequestGet(url, (jsonData) => {
        const {status, data,} = jsonData;
        if (status === 200) {
            if (callback) callback(data)
        } else if (status === 202) {
            viettel_post_login(() => {
                list_inventory(callback, callError)
            })
        } else {
            if (callError) callError()
        }
    }, () => {
        if (callError) callError()
    }, viettel_post_user_data.token)
}

module.exports.viettel_post_list_inventory = function (callback = null, callError = null) {
    if (!viettel_post_user_data || !viettel_post_user_data.token) {
        viettel_post_login(() => {
            list_inventory(callback, callError)
        })
    } else {
        list_inventory(callback, callError)
    }
}


//  register store inventory (????ng k?? ki???m k?? c???a h??ng)
function register_store_inventory(callback = null, callError = null) {
    const url = 'https://partner.viettelpost.vn/v2/user/regiterStoreInventory';

    const body={
        "PHONE": "0963333336",
        "NAME": "Nguy???n Tr?? D??ng",
        "ADDRESS": "20 V?? Ch?? C??ng, Xu??n La, T??y H???, H?? N???i",
        "WARDS_ID": 223
    }

    network.httpRequestPost(url, (jsonData)=>{
        const {status,data}= jsonData
        if(status ===200){
            list_inventory()
        }else {
            viettel_post_login(()=>{
                register_store_inventory()
            })
        }
    },body,()=>{},0, viettel_post_user_data.token)

}

module.exports.viettel_post_register_store_inventory=function (callback=null,callError= null){
    if(!viettel_post_user_data||!viettel_post_user_data.token){
        viettel_post_login(()=>{
            register_store_inventory(callback,callError)
        })
    }else {
        register_store_inventory(callback,callError)
    }
}


//c??c b???ng gi?? d???ch v???
function get_price_all(body,callback=null,callError=null){
    const url="https://partner.viettelpost.vn/v2/order/getPriceAll"

    network.httpRequestPost(url, (jsonData)=>{
        if(Array.isArray(jsonData)){
            jsonData.forEach(d=>{
                let time=parseInt(d.THOI_GIAN.trim().replace('gi???','').trim())
                time=time+48;
                d.THOI_GIAN=time+'gi???'
            })
            if(callback) callback(jsonData)
        }else {
            const {status,message}=jsonData;
            if(status === 202){
                viettel_post_login(()=>{
                    get_price_all(body,callback, callError)
                    })
            }else {
                if(callError) callError(message)
            }
        }
    },body,()=>{
        if(callError) callError('kh??ng l???y ???????c d??? li???u')
    }, 0,viettel_post_user_data.token)
}

module.exports.viettel_post_get_price_all= function (body,callback = null, callError = null){
    if(!viettel_post_user_data || !viettel_post_user_data.token){
        viettel_post_login(()=>{
            get_price_all(body,callback, callError)
        })
    }else{
        get_price_all(body,callback, callError)
    }
}


//h???y ????n h??ng b??n viettel
function cancel_order(body,callback=null,callError=null) {
    const url ='https://partner.viettelpost.vn/v2/order/cancelOrder';

    network.httpRequestPost(url, (jsonData)=>{
        const {status, data}= jsonData;

        if(status === 200){
            if (callback) callback(data)
        }else if (status === 202){
            viettel_post_login(()=>{
                cancel_order(body,callback, callError)
            })
        }
        else{
            if(callError) callError()
        }
    }, body,()=>{},0, viettel_post_user_data.token)
}

module.exports.viettel_post_cancel_order= function (body,callback=null,callError=null) {
    if(!viettel_post_user_data || !viettel_post_user_data.token){
        viettel_post_login(() => {
            cancel_order(body,callback,callError)
        })
    }else {
        cancel_order(body,callback,callError)
    }
}

// mai x??y d???ng t??? file n??y require lu???ng qua router
// x??y d???ng  c??c router:viettel_post    va  delivery
// c??c h??m trong c??c router truy su???t d??? li???u d??ng :mysqlpool,db_sequelize













































