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

var sql_1 = 'SELECT * FROM s_role';

/**
 *
 * @params
 * @return
 */
exports.findAll = function(cb){
	var sql = sql_1 +' ORDER BY CREATE_TIME DESC';
	mysql.query(sql, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};