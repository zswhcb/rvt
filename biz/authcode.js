/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	md5 = util.md5,
	mysql_util = util.mysql_util,
	mysql = util.mysql;

var exports = module.exports;

var sql_1 = 'SELECT a.*, b.USER_NAME, b.MOBILE, b.EMAIL, b.REAL_NAME, b.ALIPAY_ACCOUNT FROM (SELECT * FROM s_auth_code WHERE USER_ID=?) a LEFT JOIN s_user b ON (a.id=b.AUTH_CODE_ID)';

/**
 *
 * @params
 * @return
 */
exports.findByUserId = function(user_id, cb){
	var sql = sql_1 +' ORDER BY a.CREATE_TIME DESC';
	mysql.query(sql, [user_id], function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};