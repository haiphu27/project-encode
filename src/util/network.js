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
module.exports.httpRequestGet = function (url, callback, callError = null, Authorization, shop_id) {
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
            headers: header(Authorization,shop_id),
            method:'GET'
        }).then(function (response){return response.json()})
            .then(function (response){
                // Clear the timeout as cleanup
                  clearTimeout(timeout);

                  if(!didTimeout) {resolve(response)}
            })
            .catch(function (error){
                if(didTimeout)return;
                reject(error)
            })


    })
        .then(function (response) {
            if(callback) callback(response)
        })
        .catch(function (error) {
            if(callError) callError()
        })
}

//xd tương tự với method Post



// làm xong nghiên cứu file viettel post ultil