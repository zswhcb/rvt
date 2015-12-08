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

var sql_1 = 'SELECT b.PROJECT_NAME, b.TEL_NUM, a.* FROM p_task a, p_project b WHERE a.PROJECT_ID=b.id';

/**
 *
 * @params
 * @return
 */
exports.findAll = function(cb){
	var sql = sql_1 +' ORDER BY a.CREATE_TIME DESC';
	mysql.query(sql, null, function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 *
 * @params
 * @return
 */
exports.findByProjectId = function(project_id, cb){
	var sql = sql_1 +' AND a.PROJECT_ID=? ORDER BY a.CREATE_TIME DESC';
	mysql.query(sql, [project_id], function (err, docs){
		if(err) return cb(err);
		cb(null, docs);
	});
};

/**
 * 表单
 *
 * @params
 * @return
 */
(function (exports){
	function formVali(newInfo, cb){
		cb(null);
	}

	var sql_add = 'INSERT INTO p_task (id, TASK_NAME, TASK_INTRO, TASK_SUM, PROJECT_ID, TALK_TIME_LEN, START_TIME, END_TIME, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.saveNew = function(newInfo, cb){
		formVali(newInfo, function (err){
			if(err) return cb(err);
			// CREATE
			var postData = [
				util.genObjectId(),
				newInfo.TASK_NAME,
				newInfo.TASK_INTRO,
				newInfo.TASK_SUM,
				newInfo.PROJECT_ID,
				newInfo.TALK_TIME_LEN,
				newInfo.START_TIME,
				newInfo.END_TIME,
				new Date(),
				newInfo.STATUS || 1
			];
			mysql.query(sql_add, postData, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		});
	};

	var sql_edit = 'UPDATE s_user set TASK_NAME=?, TASK_INTRO=?, TASK_SUM=?, TALK_TIME_LEN=?, START_TIME=?, END_TIME=?, STATUS=? WHERE id=?';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.editInfo = function(newInfo, cb){
		formVali(newInfo, function (err){
			if(err) return cb(err);
			// CREATE
			var postData = [
				newInfo.TASK_NAME,
				newInfo.TASK_INTRO,
				newInfo.TASK_SUM,
				newInfo.TALK_TIME_LEN,
				newInfo.START_TIME,
				newInfo.END_TIME,
				newInfo.STATUS || 1,
				newInfo.id
			];
			mysql.query(sql_edit, postData, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		});
	};
})(exports);