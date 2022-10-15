const fetch = require('node-fetch');


//xd header
function header(Authorization = '', shop_id = 0) {
    return {
        "content-type": "application/json",
        "token": Authorization,
        "h-token": Authorization,
        "shop_id": shop_id
    }
}

//xd http request Get : lấy dữ liệu từ server theo method Get + callback nếu không thành công
module.exports.httpRequestGet = function (url,
                                          callback,
                                          callError = null,
                                          Authorization = '',
                                          shop_id = 0) {
    let didTimeout = false;

    new Promise(function (resolve, reject) {
        const timeout = setTimeout(() => {
            didTimeout = true;
            try {
                reject('request timeout');
            } catch (error) {
            }
        }, 60000)

        fetch(url, {
            headers: header(Authorization, shop_id),
            method: 'GET'
        }).then(function (response) {
            return response.json()
        })
            .then(function (response) {
                // Clear the timeout as cleanup
                clearTimeout(timeout);
                if (!didTimeout) {
                    resolve(response)
                }
            })
            .catch(function (error) {
                if (didTimeout) return;
                reject(error)
            })
    })
        .then(function (response) {
            if (callback) callback(response)
        })
        .catch(function (error) {
            if (callError) callError()
        })
}

//xd tương tự với method Post

module.exports.httpRequestPost = function httpRequestPost(url,
                                                          callback,
                                                          formData,
                                                          callError = null,
                                                          time_out = 0,
                                                          Authorization = '',
                                                          shop_id = 0) {
    let disTimeout = false;
    new Promise(function (resolve, reject) {

        const timeout = setTimeout(() => {
            disTimeout = true;
            try {
                reject('response timeout')
            } catch (e) {
            }
        }, time_out ? time_out : 60000)

        fetch(url, {
            headers: header(Authorization, shop_id),
            body: JSON.stringify(formData),
            method: "POST",
            cache: "no-cache"
        })
            .then(res => res.json())
            .then(res => {
                clearTimeout(timeout)
                if (!disTimeout) resolve(res)
            })
            .catch(err => {
                if (disTimeout) return
                reject(err)
            })
    }).then(res => {
        if (callback) callback(res)
    })
        .catch(err => {
            if (callError) callError()
        })
}


// làm xong nghiên cứu file viettel post ultil