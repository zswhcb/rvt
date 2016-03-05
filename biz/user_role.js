/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	mysql_util = util.mysql_util,
	mysql = util.mysql;

var exports = module.exports;

/**
 * 根据角色查询用户
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT * FROM s_user_role WHERE USER_ID=? AND ROLE_ID=?';
	// TODO
	exports.checkExistUserRole = function(user_id, role_id, cb){
		mysql.query(sql, [user_id, role_id], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};
})(exports);