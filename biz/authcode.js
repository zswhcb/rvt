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

/**
 * 生成认证码
 *
 * @params
 * @return
 */
exports.genAuthCode = function(user_id, sum, cb){
	if(!user_id){
		return cb(null, ['用户ID不能为空']);
	}
	// TODO
	var sql = 'INSERT INTO s_auth_code (id, USER_ID, CREATE_TIME, STATUS) VALUES (?, ?, ?, ?)';
	var postData = null;
	// TODO
	for(var i=0; i<sum; i++){
		postData = [
			util.genObjectId(),
			user_id,
			new Date(),
			1
		];
		mysql.query(sql, postData, function (err, status){
			// TODO
		});
	}
	cb(null, null, null);
};