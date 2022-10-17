

module.exports.create_order = ()=>{
    return `v2/shipping-order/create`
}

module.exports.update_order = ()=>{
    return `v2/shipping-order/update`
}

module.exports.cancel_order = ()=>{
    return 'v2/switch-status/cancel';
}

module.exports.all_service = (shop_id,from_district,to_district)=>{
    return `v2/shipping-order/available-services?shop_id=${shop_id}&from_district=${from_district}&to_district=${to_district}`;
}

module.exports.calculator_fee_service = ()=>{
    return 'v2/shipping-order/fee';
}

module.exports.calculator_time_service  = (from_district_id,from_ward_code,to_district_id,to_ward_code,service_id)=>{
    return `v2/shipping-order/leadtime?from_district_id=${from_district_id}&from_ward_code=${from_ward_code}&to_district_id=${to_district_id}&to_ward_code=${to_ward_code}&service_id=${service_id}`;
}
