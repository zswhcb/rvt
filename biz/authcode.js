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

(function (exports){
	var sql = 'SELECT a.*, b.USER_NAME, b.MOBILE, b.EMAIL, b.REAL_NAME, b.ALIPAY_ACCOUNT FROM s_auth_code a LEFT JOIN s_user b ON (a.id=b.AUTH_CODE_ID) WHERE a.id=?';

	/**
	 * 检查是否在使用
	 *
	 * @params
	 * @return
	 */
	exports.checkUsed = function(id, cb){
		// TODO
		mysql.query(sql, [id], function (err, docs){
			if(err) return cb(err);
			// TODO
			if(1 !== docs.length) return cb(null, ['认证码不存在']);
			// TODO
			var doc = docs[0];
			if(!!doc.USER_NAME) return cb(null, ['认证码已经使用']);
			// TODO
			cb(null, null, null);
		});
	};
})(exports);

(function (exports){
	var sql = 'SELECT a.*, b.USER_NAME, b.MOBILE, b.EMAIL, b.REAL_NAME, b.ALIPAY_ACCOUNT FROM (SELECT * FROM s_auth_code WHERE USER_ID=?) a LEFT JOIN s_user b ON (a.id=b.AUTH_CODE_ID) ORDER BY a.CREATE_TIME DESC';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByUserId = function(user_id, cb){
		mysql.query(sql, [user_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

(function (exports){
	var sql = 'INSERT INTO s_auth_code (id, USER_ID, CREATE_TIME, STATUS) VALUES (?, ?, ?, ?)';

	/**
	 * 生成认证码
	 *
	 * @params
	 * @return
	 */
	exports.genAuthCode = function(user_id, sum, cb){
		// TODO
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
})(exports);