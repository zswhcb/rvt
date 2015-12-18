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
 * 获取用户接手的任务列表
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT b.STATUS TASK_STATUS, b.END_TIME TASK_END_TIME, b.TALK_TIMEOUT TASK_TALK_TIMEOUT,'+
				' a.* FROM p_handtask a LEFT JOIN p_task b ON (a.TASK_ID=b.id)'+
				' WHERE a.STATUS=? AND a.USER_ID=?';
	// TODO
	exports.findByUserId = function(status, user_id, cb){
		mysql.query(sql, [status, user_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

/**
 * 批量更新状态
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'UPDATE p_handtask SET STATUS=? WHERE id in (?)';
	// TODO
	exports.editStatus = function(status, handtask_ids, cb){
		mysql.query(sql, [status, handtask_ids], function (err, result){
			if(err) return cb(err);
			cb(null, result);
		});
	};
})(exports);

(function (exports){
	var sql_1 = 'SELECT b.USER_NAME, a.* FROM p_handtask a, s_user b WHERE a.USER_ID=b.id AND a.TASK_ID=?';
	var sql_orderby = ' ORDER BY a.STATUS, a.CREATE_TIME DESC';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByTaskId = function(task_id, cb){
		task_id = task_id || '';
		var sql = sql_1 + sql_orderby;
		mysql.query(sql, [task_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);