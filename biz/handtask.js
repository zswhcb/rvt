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

var sql_1 = 'SELECT b.MOBILE, a.* FROM p_handtask a, s_user b WHERE a.USER_ID=b.id AND a.TASK_ID=? ORDER BY a.CREATE_TIME DESC';

/**
 *
 * @params
 * @return
 */
exports.findByTaskId = function(task_id, cb){
	var sql = sql_1;
	mysql.query(sql, [task_id], function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};