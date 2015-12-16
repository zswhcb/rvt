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
 * 当前可接的任务信息
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT'+
				' (SELECT COUNT(1) FROM p_handtask WHERE TASK_ID=a.id) CURRENT_TASK_SUM,'+
				' (SELECT COUNT(1) FROM p_handtask WHERE STATUS=2 AND TASK_ID=a.id) COMPLETE_CURRENT_TASK_SUM,'+
				' (SELECT COUNT(1) FROM p_handtask WHERE STATUS=3 AND TASK_ID=a.id) TIMEOUT_CURRENT_TASK_SUM,'+
				' (SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=a.id AND TIMESTAMPDIFF(SECOND, CREATE_TIME, NOW())<a.TALK_TIMEOUT) RUNNING_CURRENT_TASK_SUM,'+
				' a.* FROM p_task a WHERE NOW() BETWEEN a.START_TIME AND a.END_TIME AND a.STATUS=1 ORDER BY a.CREATE_TIME DESC';
	// TODO
	exports.getCurrentTasks = function(cb){
		// TODO
		mysql.query(sql, null, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

/**
 * 删除
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'DELETE FROM p_task WHERE id=?';
	// TODO
	exports.remove = function(id, cb){
		// TODO
		mysql.query(sql, [id], function (err, status){
			if(err) return cb(err);
			cb(null, null, status);
		});
	};
})(exports);


(function (exports){
	var sql_1 = 'SELECT b.PROJECT_NAME, a.* FROM p_task a, p_project b WHERE a.PROJECT_ID=b.id';
	var sql_orderby = ' ORDER BY a.CREATE_TIME DESC';

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
	 *
	 * @params
	 * @return
	 */
	exports.findAll = function(cb){
		var sql = sql_1 + sql_orderby;
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
		var sql = sql_1 +' AND a.PROJECT_ID=?'+ sql_orderby;
		// TODO
		mysql.query(sql, [project_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

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

	/**
	 * 添加
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'INSERT INTO p_task (id, TASK_NAME, TEL_NUM, TASK_INTRO, TASK_SUM, PROJECT_ID, TALK_TIME_LEN, TALK_TIMEOUT, START_TIME, END_TIME, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		// TODO
		exports.saveNew = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// CREATE
				var postData = [
					util.genObjectId(),
					newInfo.TASK_NAME,
					newInfo.TEL_NUM,
					newInfo.TASK_INTRO,
					newInfo.TASK_SUM || 20,
					newInfo.PROJECT_ID,
					newInfo.TALK_TIME_LEN || 30,
					newInfo.TALK_TIMEOUT || 3600,
					newInfo.START_TIME || new Date(),
					newInfo.END_TIME || new Date(),
					new Date(),
					newInfo.STATUS || 1
				];
				mysql.query(sql, postData, function (err, status){
					if(err) return cb(err);
					cb(null, null, status);
				});
			});
		};
	})(exports);

	/**
	 * 修改
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'UPDATE p_task set TASK_NAME=?, TEL_NUM=?, TASK_INTRO=?, TASK_SUM=?, TALK_TIME_LEN=?, TALK_TIMEOUT=?, START_TIME=?, END_TIME=?, STATUS=? WHERE id=?';
		// TODO
		exports.editInfo = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// CREATE
				var postData = [
					newInfo.TASK_NAME,
					newInfo.TEL_NUM,
					newInfo.TASK_INTRO,
					newInfo.TASK_SUM || 20,
					newInfo.TALK_TIME_LEN || 30,
					newInfo.TALK_TIMEOUT || 3600,
					newInfo.START_TIME || new Date(),
					newInfo.END_TIME || new Date(),
					newInfo.STATUS || 1,
					newInfo.id
				];
				mysql.query(sql, postData, function (err, status){
					if(err) return cb(err);
					cb(null, null, status);
				});
			});
		};
	})(exports);
})(exports);