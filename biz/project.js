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

var sql_1 = 'SELECT c.USER_NAME, b.TYPE_NAME PROJECT_TYPE_NAME, a.* FROM p_project a, p_project_type b, s_user c WHERE a.PROJECT_TYPE_ID=b.id AND a.USER_ID=c.id';

/**
 *
 * @params
 * @return
 */
exports.findAll = function(cb){
	var sql = sql_1 +' ORDER BY a.CREATE_TIME DESC';
	mysql.query(sql_1, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};