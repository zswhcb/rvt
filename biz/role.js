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

(function (exports){
	var _sql = 'SELECT * FROM s_role ORDER BY CREATE_TIME DESC';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByRole = function(cb){
		var sql = _sql;
		mysql.query(sql, null, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);