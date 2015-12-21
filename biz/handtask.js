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
	var sql_1 = 'SELECT'+
					'  b.TEL_NUM TASK_TEL_NUM, b.TASK_NAME, b.TASK_INTRO, b.TASK_SUM, b.PROJECT_ID, b.TALK_TIMEOUT TASK_TALK_TIMEOUT, b.TALK_TIME_LEN TASK_TALK_TIME_LEN, b.START_TIME TASK_START_TIME, b.END_TIME TASK_END_TIME, b.CREATE_TIME TASK_CREATE_TIME, b.STATUS TASK_STATUS,'+
					'  a.*'+
					' FROM p_handtask a LEFT JOIN p_task b ON (a.TASK_ID=b.id) WHERE b.id IS NOT NULL';
	/**
	 *
	 * @params
	 * @return
	 */
	exports.getById = function(id, cb){
		var sql = sql_1 +' AND a.id=?';
		mysql.query(sql, [id], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};

	/**
	 * 获取我未过期（未失效）的任务
	 *
	 * @params
	 * @return
	 */
	exports.getMyHandTask = function(status, user_id, cb){
		status = status || 0;
		// TODO
		var sql = sql_1 +' AND a.STATUS=? AND a.USER_ID=?';
		// TODO
		mysql.query(sql, [status, user_id], function (err, docs){
			if(err) return cb(err);
			if(1 < docs.length) return cb(null, ['数据异常，请联系管理员']);
			cb(null, null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};
})(exports);

/**
 * 申请任务时，清理过期状态
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'UPDATE p_handtask SET STATUS=3'+ // 状态：3，由0变为3，任务超时（失效）
				' WHERE id in (SELECT a.id FROM'+
					' (SELECT id, TASK_ID, CREATE_TIME FROM p_handtask WHERE STATUS=0) a'+
					' LEFT JOIN p_task b ON (a.TASK_ID=b.id)'+
					' WHERE b.id IS NOT NULL AND DATE_ADD(a.CREATE_TIME, INTERVAL (b.TALK_TIMEOUT - 10) second)<?)';
	// TODO
	exports.clearTimeout = function(curTime, cb){
		curTime = curTime || new Date();
		// TODO
		mysql.query(sql, [curTime], function (err, status){
			if(err) return cb(err);
			cb(null, status);
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
		mysql.query(sql, [status, handtask_ids], function (err, status){
			if(err) return cb(err);
			cb(null, status);
		});
	};
})(exports);

/**
 * 获取用户名
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT b.USER_NAME, a.* FROM'+
				' (SELECT * FROM p_handtask WHERE TASK_ID=?) a LEFT JOIN s_user b ON (a.USER_ID=b.id) WHERE b.id IS NOT NULL ORDER BY a.STATUS, a.CREATE_TIME DESC';
	// TODO
	exports.findByTaskId = function(task_id, cb){
		mysql.query(sql, [task_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

/**
 * 新的申请
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'INSERT INTO p_handtask (id, TASK_ID, USER_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?)';
	// TODO
	exports.saveNew = function(newInfo, cb){
		var postData = [
			util.genObjectId(),
			newInfo.TASK_ID,
			newInfo.USER_ID,
			new Date(),
			0
		];
		mysql.query(sql, postData, function (err, status){
			if(err) return cb(err);
			cb(null, { id: postData[0], CREATE_TIME: postData[3] });
		});
	};
})(exports);

/**
 * 提交
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'UPDATE p_handtask TEL_NUM=?, UPLOAD_TIME=?, TALK_TIME=?, TALK_TIME_LEN=?, STATUS=? WHERE id=?';
	// TODO
	exports.editInfo = function(newInfo, cb){
		var postData = [
			newInfo.TEL_NUM,
			newInfo.UPLOAD_TIME,
			newInfo.TALK_TIME,
			newInfo.TALK_TIME_LEN,
			newInfo.STATUS,
			newInfo.HANDTASK_ID
		];
		mysql.query(sql, postData, function (err, status){
			if(err) return cb(err);
			cb(null, status);
		});
	};
})(exports);