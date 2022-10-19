const mysqlpool = require('./mysqlpool');
const logger = require('./logger').log;

async function is_admin(account) {
    const {id, prefix_domain} = account;
    if (prefix_domain && (prefix_domain === 'admin' || prefix_domain === 'super_admin' || prefix_domain === 'account')) return true;
    let sql = ` select prefix_domain from accounts where id =${id}`
    const [row_prefix_domain] = await mysqlpool.query(sql)
    if (!row_prefix_domain) return false;
    let prefix = row_prefix_domain[0].prefix_domain;
    if (prefix && (prefix_domain === 'admin' || prefix_domain === 'super_admin' || prefix_domain === 'account')) return true;
    return false;
}

async function save_log_history(req, content = '', before_info = '') {
    try {
        let ip = req.ip ? req.ip : '';
        let browser = req.headers['user-agent'] ? req.headers['user-agent'] : '';
        let account = req.account ? req.account : '';

        if (!ip.length && !browser.length && Object.keys(account).length) {
            logger.info("ko co gi de luu")
            return;
        }
        let {username, id} = account;
        let body = req.body ? JSON.stringify(req.body) : (req.query ? JSON.stringify(req.query) : '');
        content=content.length ? content :body;
        let sql=`insert into log_delivery_history(user_id,user_name,ip_request,content,name_browser,content_old)values(${id},'${username}','${ip}','${content}','${browser}','${before_info}')`
        await mysqlpool.query(sql);
    } catch (e) {

    }
}

function validate_email(email) {
    const pattern=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(String(email).toLowerCase())
}

function validate_username(username) {
    const pattern=/^([0-9a-zA-Z_]+)$/;
    return pattern.test(String(username).toLowerCase())
}

function escape_null_querry(jdata) {
    return JSON.parse(JSON.stringify(jdata))
}


module.exports = {
    is_admin,
    save_log_history,
    validate_username,
    validate_email,
    escape_null_querry
}