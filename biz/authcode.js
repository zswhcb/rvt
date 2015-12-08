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

/**
 *
 * @params
 * @return
 */
exports.findByUserId = function(user_id, cb){
	var sql = 'SELECT * FROM s_auth_code WHERE USER_ID=? ORDER BY CREATE_TIME DESC';
	mysql.query(sql, [user_id], function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};