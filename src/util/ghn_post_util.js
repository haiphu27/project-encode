const base_url = 'https://online-gateway.ghn.vn/shiip/public-api/';
const ghn_api = require('../config/ghn_api');
const network = require("./network");
const shop_id = 2562642;
const message_timeout = 'Hết thời gian xử lý'

module.exports.create_bill_from_ghn_post = function(vgs_order,callback=null,callError=null) {
    let url= base_url + ghn_api.create_order();
    network.httpRequestPost(url,jsonData=>{
        let{code,data,message}=jsonData
        if(code === 200){
            if(callback) callback(data,2)
        }else {
            if(callError) callError(message)
        }
    },vgs_order,()=>{
        if(callError) callError(message_timeout)
    })
}

module.exports.update_bill_from_ghn_post = function(formData,callback=null,callError=null) {
    let url= base_url + ghn_api.update_order();
    network.httpRequestPost(url,jsonData=>{
        let{code,data,message}=jsonData
        if(code === 200){
            if(callback) callback(data,2)
        }else {
            if(callError) callError(message)
        }
    },formData,()=>{
        if(callError) callError(message_timeout)
    })
}

module.exports.cancel_bill_from_ghn_post = function(formData,callback=null,callError=null) {
    let url= base_url + ghn_api.cancel_order();
    network.httpRequestPost(url,jsonData=>{
        let{code,data,message}=jsonData
        if(code === 200){
            if(callback) callback(data,2)
        }else {
            if(callError) callError(message)
        }
    },formData,()=>{
        if(callError) callError(message_timeout)
    })
}

module.exports.get_all_services = function (from_district, to_district, callback = null, callError = null) {
    let url = base_url + ghn_api.all_service(shop_id, from_district, to_district)
    network.httpRequestPost(url, jsonData => {
        const {code, data, code_message} = jsonData
        if (code === 200) {
            if (callback) callback(data)
        } else {
            if (callError) callError(code_message)
        }
    }, () => {
        if (callError) callError(message_timeout)
    })
}

module.exports.calcultor_fee_service = function (formData, callback = null, callError = null) {
    let url = base_url + ghn_api.calculator_fee_service()
    network.httpRequestPost(url, jsonData => {
        const {code, data, code_message} = jsonData;
        if (code === 200) {
            if (callback) callback(data)
        } else {
            if (callError) callError(code_message)
        }
    }, () => {
        if (callError) callError(message_timeout)
    })
}

module.exports.calcultor_time_service = function (from_district_id, from_wards_id, to_district_id, to_wards_id, service_id,callback = null, callError = null) {
    let url = base_url + ghn_api.calculator_time_service()
    network.httpRequestPost(url, jsonData => {
        const {code, data, code_message} = jsonData;
        if (code === 200) {
            if (callback) callback(data)
        } else {
            if (callError) callError(code_message)
        }
    }, () => {
        if (callError) callError(message_timeout)
    })
}

