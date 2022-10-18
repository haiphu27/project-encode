const STATUS_CALL  = {
    INIT: 1,
    CALLING: 2,
    RINGING: 3,
    CALL_FALSE: 4,
    CALL_SUCCESS: 5,
    CALL_ANSWER: 6
}

const ERROR_LOG_API = {
    OK:{
        error: 0,
        msg: 'Thành công'
    } ,
    LOGIN_FALSE:{
        error:1,
        msg:'Tên đăng nhập hoặc mật khẩu không đúng'
    },
    ACCOUNT_NOT_EXITS:{
        error:2,
        msg:'Không tồn tại tài khoản'
    },
    CUSTOMER_IS_EXIT:{
        error:3,
        msg:'Email hoặc số điện thoại đã tồn tại'
    },
    ACCOUNT_IS_EXIT:{
        error:4,
        msg:'Email, username hoặc số điện thoại đã tồn tại'
    },
    BLACKLIST_IS_EXIT:{
        error:5,
        msg:'Thông tin config đã tồn tại'
    },
    HOTLINE_IS_EXIT:{
        error:6,
        msg:'Số điện thoại đã tồn tại'
    },
    CUSTOMER_IS_NOT_EXIT:{
        error:7,
        msg:'Tài khoản không tồn tại'
    },
    HOTLINE_IS_NOT_EXIT:{
        error:8,
        msg:'Đầu số không tồn tại'
    },
    PACKAGE_IS_NOT_EXIT:{
        error:9,
        msg:'Gói cước không tồn tại'
    },


    CAPTCHA_EXPIRE:{
        error:10,
        msg:'Captcha is expired'
    },
    CAPTCHA_IS_NOT_MATCH:{
        error:11,
        msg:'Captcha không đúng'
    },
    TCPDUMP_ERROR:{
        error:12,
        msg:'Chỉ được sử dụng src hoặc dst'
    },
    EXPORT_EXCEL_ERROR:{
        error:13,
        msg:'Không có quyền truy cập export này'
    },
    ACCOUNT_NOT_MATCH:{
        error:14,
        msg:'Tên đăng nhâp không đúng định dạng'
    },
    HOTLINE_IS_USE:{
        error:15,
        msg:'Số hotline đã được sử dụng cho tài khoản khác'
    },
    ACCOUNT_IS_NOT_ACTIVE:{
        error:16,
        msg:'Tài khoản đang bị khóa'
    },
}
const publicDer =`-----BEGIN PUBLIC KEY-----
MIICojANBgkqhkiG9w0BAQEFAAOCAo8AMIICigKCAoEAhf6uQN1ZJZmRzna5r3Lp
O1gI0rr3K/F5bYzFhg1wY+Gq7voDGoNVT+4p0tZ+lt6MVsaCncW/jOf/B7ehpqjB
6a0MVe3FpXrruqxLOjSXKZ+RkkDq9YWSuV1AGTfMRZDnyT09jlhlkU6FYZlosHff
qjZkTx1JM/k6MTj27iv1lxb5aQpomWskA797zgRuCNgJ+mRuOZ3dMx5RZM/gAo1a
DafBxtXeVTk3Nix9uUfgHe97aMV3y5V7w2l26VqMGzR7SJN19FIlEItYALtpQzMy
IFqMXa3D6Avgrpn7amZx9bTmfJzybJvQF6cADNoC1epfq+G+ouGbGJDIkP+dx6QX
Rpl1B7IWb66EjHg+F8Ejig21eVyfQ9Cryj7vvuC+4oMlEyhNS+c0CrpMBCnx19P7
9gEbr/puG0AgvYW4pQQ916UiGQTVn/PPsd/ulXW8e0jrbQ2YsicEfkKA0P5t1APa
RRfeNP+8mJlZAEamJyUTztvmx515WgoRLvY1vVD/KALmI1QjHy9Kcv0gVCilmYxY
JJahg666+ymcsTlOmwHnYbOlLakI60BAx/xy14UMZJP7xl94z+dyYqtASYsHKBsa
UfpnQI0S7BXdymEPyqmQhTjUdrLa3qYnrF66D9U4Zi4JIfoBgb2U5vE9kavvyFdf
i36wBk5IuDwLIDNyQE31gOLtKBJQtdzRzxcKMKsPv+ecwLEOzFK6w0XOlKpT5YgQ
iBaUyxZ5ZdXP7imbFDC/aGe9cc96ts44rSoQkmoXXLgUMpkP7HGvsVBLKqyAeHVV
D+gG7DpHrmbLveAFHtZaBpa4Hf2RAvMDGZN8PTPzsC/idnQ6T5tRBcBnCnPClD/u
0wIDAQAB
-----END PUBLIC KEY-----`;

const privateDer =`-----BEGIN RSA PRIVATE KEY-----
MIILZgIBAAKCAoEAhf6uQN1ZJZmRzna5r3LpO1gI0rr3K/F5bYzFhg1wY+Gq7voD
GoNVT+4p0tZ+lt6MVsaCncW/jOf/B7ehpqjB6a0MVe3FpXrruqxLOjSXKZ+RkkDq
9YWSuV1AGTfMRZDnyT09jlhlkU6FYZlosHffqjZkTx1JM/k6MTj27iv1lxb5aQpo
mWskA797zgRuCNgJ+mRuOZ3dMx5RZM/gAo1aDafBxtXeVTk3Nix9uUfgHe97aMV3
y5V7w2l26VqMGzR7SJN19FIlEItYALtpQzMyIFqMXa3D6Avgrpn7amZx9bTmfJzy
bJvQF6cADNoC1epfq+G+ouGbGJDIkP+dx6QXRpl1B7IWb66EjHg+F8Ejig21eVyf
Q9Cryj7vvuC+4oMlEyhNS+c0CrpMBCnx19P79gEbr/puG0AgvYW4pQQ916UiGQTV
n/PPsd/ulXW8e0jrbQ2YsicEfkKA0P5t1APaRRfeNP+8mJlZAEamJyUTztvmx515
WgoRLvY1vVD/KALmI1QjHy9Kcv0gVCilmYxYJJahg666+ymcsTlOmwHnYbOlLakI
60BAx/xy14UMZJP7xl94z+dyYqtASYsHKBsaUfpnQI0S7BXdymEPyqmQhTjUdrLa
3qYnrF66D9U4Zi4JIfoBgb2U5vE9kavvyFdfi36wBk5IuDwLIDNyQE31gOLtKBJQ
tdzRzxcKMKsPv+ecwLEOzFK6w0XOlKpT5YgQiBaUyxZ5ZdXP7imbFDC/aGe9cc96
ts44rSoQkmoXXLgUMpkP7HGvsVBLKqyAeHVVD+gG7DpHrmbLveAFHtZaBpa4Hf2R
AvMDGZN8PTPzsC/idnQ6T5tRBcBnCnPClD/u0wIDAQABAoICgFTN+W8oKHG5niRz
09WM/rwGXZ8xoZn4PIfvHlxXSRiODOcu6KPxFx99do7wHjJSK7QH80bzjuYZNrml
qPOXvxKr6TDBSeQPxf3hacMu4bUAPtu3pn05ysDymczcGba1nV0qGzlqDO5IKfa5
Zx6436AUyKuht2Djjcb1bKMUw1yat8OZSNZAjwyoNi0PdKy4Pqhww6pHlWXy/ES3
o+k5mRMnZ2b2mL6LdbwdsHyBVwDbPtnykH0S4L+ukgniuuXE83ndijvVeYvdBReB
hX94eXMsm8X2YhUM32jiH9MZf2qo0W9wzaWbf7pYgZmgqUbGDUL1nvfrnYOQrr/G
aA+gdPLD0OPL/JM2esGEoJfcLygCwSZMTqhW+0MHTikaiPVHV0GmsjUl4TQg8Fd6
TIvyqHbsAKAB+YnZrl8EsPYPlyxRbrMKBKyfKbAl1Fe24TFHwIEIj+H0lsq8bSG+
8R6ThPxge2qr0ZYUOICBe6f/l6kPNQOtG1gXmrtp+PgPaQMFfWBqxKacKb2GSSlP
1Sam0q2KGqgXdhfqG7lhft/UA7JhMQ49y90vWcOzYF5yddXhVYkHqwo9Zvh++Xp5
CM8WonwZvzS6hV5/+n+AmqCiUAMi5WnmSc+gCYXL+nL4XB3Gw4v7LSx8HO8ob4UA
nWU7o1Y2z9gyorJQDT/z6iAyTF6pVgKlclHWb+TOXyhDawG+iI29RJjsE7PMs4ZJ
6VuT1IK1+GleOe1tLyy8mYkGQdtPwrLFKYtPTS8F0veXy7/cS6pmXZI4DMCB4nn2
OOoPn6r+WjQw/F1o/lX5Sfx/Jh0RHgq3x5pZkZzrlUh72Ij7TdlgQCU+xqLAYkwS
/imlGDECggFBAPBJmyhhE+DJ13xlxKglmTkZIJHeWbu1bC/jVrFZRoSJgxT3GHnX
g8OyaPdMToX1PjDrY5gIyO+3SPvX1MBf141r89/qBtZCF+zE03flB6JS7e4ywRER
n/RCqUoYGXYaLvlo1Fcs+D++ekZc/MHDDgtnHR86SeoDxv2WUzofDbzftjoFAZOU
T6ODE3k995prS9jWCfIYxpYq4ePO1ldctHPJ3m3ANUTzuM19AF7GxMHqxikW53gp
rgqL9u1YcDBQwks97AvBziJzi9/4dfRpeNhYkz9Q+rW6pib3gpnA43Zupl0zWYL2
37TUFf8CBDrIMsYxxKhZ4P3tA/5sN2YiR62WE5XxTU+yUt0RzBsob66dLiKZ2D9C
p/iS188yxXyp+wiP8Mho47nv4PMNX7g4ijdD9lOxqkRCz22JgDFeNDYvAoIBQQCO
wb5h3q4GY4MODjH4ASZF+wsUEbQfcvDbN0YUD/YCJyMGq5Vk/AcQLuIDxYytkeFd
55HDKozqykPrBMyouhTzx+dSpC+ylDbQo29OxX3NQf71V6eyiDrFNWpH4EvgIAZP
XbE985ZIfUysxRJxUIpAJgAy1mfdx1iTxA1H2BAPAjtRbAVkjOG8bGPBxS/2u/VZ
Q3DIiyeDi7+dqeOXo66Hz4fJ+PLX+/nmQ7+74J7YUu29wrBnSEOSP9JZTnEBNd6D
smhm50oC6wcC7M6xqq6+Z+hfJrW+NIdEcwRAwaZkKmIwBIVblNmpbWyIi5b3Y7+2
C+PjHFm92mK3bNmJUpVcgoM65m5uro2gF0R8ql0bvGtHUQSMlaHXza1yPFfzDHOf
e/FKsXsvGhZcFPMMeBSGLHelPAYu7qtfj2kXi7eMnQKCAT8pTH1ec1D3Ubm3p8Yl
IFE1fxwZ9h12JbhygqBj2vRD0160O8P5LRF4kTF5T6QvYfdOcSas+tWOXfItVus6
JT7nD6ba1V5XdQSnrSyrbrHhNF+wkQid5mmXkd2G3p2Brv5j36CfWxtP2W0qqtDG
fL/tNcvLkjkh/4Q0EaI8WxoBXHH1hua+dr85W039iKkF4Wsn2aHb+mYnaTdp8CLm
4Qgi3o9cTazaLQmWR+XIZGFs8u0cItOl04QWS/gk0w51P2wlgn8Phj/nq/ReilW7
rGUYyiCEwWZV1b6489F+m6h8soflfO3llIjei5U8Pxx6/e28ItGqHciN3C7Ti8X5
x+qJ60FyhAbFq+CSHnz2Lf0EBf/n8ok4VjyIfLSa6B8JTi3XSuYXi++YBaKkI6hQ
AWfAF+4+dErPcKw2J2vhEE/pAoIBQCtehL4q7meWd8wfV+LmRoBgIh94uWYMf0u5
4RpbNvu0dBmkqwBA6Mxr0dIfg/t/JB5pKYlHNgRmanfNv3dLAO6GvqoGo073ZCfC
XyBpMyzWbeSPOq0sYd5jueQYKjTuxbv61MvjYranClI6lL3EIBwY71qCdI+V7j0G
BJrc8xP8M5Uq4gCIJFQgAbZud4HX3FO//1WNoPV/0TjO0gvReEZeL/yWGwCu1l60
Gl2zgc5qczuBGCJoe87EgN0MzZv2h6Eu5DTO81crm7exxaGIHwpNevTdR71/K9EJ
uDMMIcawcZ/w36rQ78dfLOfWsIh7z1Q5DISEqmbZH8Bl2ziy1BmEtOWB9+68LN6D
8xSElUDF3zmNTXqAQujS3WylFHsMP1wmRUnR3YCTxlM3MheJq4KPo9GZCK/dZkbj
xKOYmKypAoIBQFYZB6yI43MebGjUdTog/yI2x0PrtertpDIHdpiC2RZ7u9/1lsjX
Rc2JYl7Y50KC1n8bqm47iejWOXJRd5Xl9teAzY0RZ7k6X2FpV3dPUwL5g/43wLCc
ImyuRbjhieNip8XQsep0cnNre85PrS0ofXP4bewascVStuDwVgi9POYfq6wy3WwF
2m4Am+aMHEhsN9VULvIFHZvpdUR3mAzinDcnnKe7aFkcfos18X938IgazGzRnuT1
HqWp5uQR9ONkkw1k6DuxdFkP14Hmxw+8Gc9cir8YKn/hwujmbudFSExt8HzLTOly
JDX7UqgkLi1DvNDoJ+18W6GyxxogfBvZB/Bmptg7VymC+VDZGo3CVZTjDo4wJp9c
UmA9RpTM10mi6J9LSpw+kiRBFiSql+cFz8MU0HdL3HOO1ul+tD6TjVW4
-----END RSA PRIVATE KEY-----`;

const EXPIRE_TIME_LOGIN = 120*60*60;

const STATE_DELIVERY_BILL = {
    CHO_XAC_NHAN:{
        name: 'Chờ Xác Nhận',
        value: 0
    },
    CHO_GIAO_HANG:{
        name: 'Chờ Giao Hàng',
        value: 1
    },
    DANG_GIAO_HANG:{
        name: 'Đang Giao Hàng',
        value: 2
    },
    DA_GIA_HANG:{
        name: 'Đã Giao Hàng',
        value: 3
    },
    DA_HUY:{
        name: 'Đơn Đã Hủy',
        value: 4
    },
    TRA_HANG:{
        name: 'Đơn Trả Hàng',
        value: 5
    },
}
function get_list_state_home_static(){
    let l = []
    for(let x of Object.keys(STATE_DELIVERY_BILL)){
        const info = STATE_DELIVERY_BILL[x];
        if([0, 1, 3, 4].includes(info.value)) l.push(info);
    }
    return l;
}

function get_state_delivery(state){

    for(let x of Object.keys(STATE_DELIVERY_BILL)){
        const info = STATE_DELIVERY_BILL[x];
        if(state === info.value) return info;
    }
    return {
        name: 'Không xác định',
        value: -1
    }
}

const STATE_PRODUCT = {
    CHO_DUYET:{
        name: 'Chờ Duyệt',
        value: 0
    },
    DANG_BAN:{
        name: 'Đang Bán',
        value: 1
    },
    HET_HANG:{
        name: 'Hết Hàng',
        value: 2
    },
    HUY_DUYET:{
        name: 'Hủy Duyệt',
        value: 3
    }
}

function get_state_product(state){

    for(let x of Object.keys(STATE_PRODUCT)){
        const info = STATE_PRODUCT[x];
        if(state === info.value) return info;
    }
    return {
        name: 'Không xác định',
        value: -1
    }
}

module.exports = {
    publicDer,
    privateDer,
    STATE_PRODUCT,
    get_state_product,
    get_state_delivery,
    get_list_state_home_static,
    STATE_DELIVERY_BILL,
    EXPIRE_TIME_LOGIN,
    ERROR: ERROR_LOG_API,
    STATUS_CALL
}
