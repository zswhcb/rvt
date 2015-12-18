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

var biz = {
	handtask: require('./handtask')
};

/**
 * 申请任务
 *
 * @params
 * @return
 */
(function (exports){
	// 当前时间可申请的任务列表，过滤已经达到完成任务数的任务
	// 传递参数：时间和任务ID
	var sql_1 = 'SELECT a.* FROM p_task a LEFT JOIN p_project b ON (b.STATUS=1 AND a.PROJECT_ID=b.id) WHERE'+
				' a.STATUS=1 AND ? BETWEEN a.START_TIME AND a.END_TIME AND'+
				' a.TASK_SUM>(SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=a.id)'+
				' AND a.id=?';
	// TODO
	exports.apply = function(user_id, task_id, cb){
		// TODO 是否已经申请过，但未完成的任务
		biz.handtask.findByUserId(0, user_id, function (err, docs){
			if(err) return cb(err);
			// TODO
			if(1 < docs.length){ // 非法数据 4，申请的任务未完成超过1个
				var handtask_ids = [];
				// TODO
				for(var i in docs){
					var doc = docs[i];
					handtask_ids.push(doc.id);
				}
				// TODO
				biz.handtask.editStatus(4, handtask_ids, function (err, result){
					if(err) return cb(err);
					cb(null, ['非法操作，请重新申请']);
				});
				return;
			}
			// TODO
			if(1 === docs.length){ // 检查此任务的状态信息
				var doc = docs[0];
				if(1 !== doc.TASK_STATUS || doc.STATUS_END_TIME < (new Date())){ // 任务失效 3
					biz.handtask.editStatus(3, [doc.id], function (err, result){
						if(err) return cb(err);
						cb(null, ['任务失效，请重新申请']);
					});
					return;
				}
				return cb(null, null, doc);
			}
			// TODO
		});
	};
})(exports);

/**
 * 当前可接的任务信息
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT'+
				'  b.STATUS HANDTASK_STATUS,'+
				'  a.*'+
				' FROM'+
				'  p_task a LEFT JOIN p_handtask b ON (a.id=b.TASK_ID AND b.USER_ID=?)'+
				' WHERE'+
				'  a.STATUS=1 AND NOW() BETWEEN a.START_TIME AND a.END_TIME AND'+
				'  a.TASK_SUM>(SELECT COUNT(1) from p_handtask WHERE STATUS=1 AND TASK_ID=a.id)'+
				' ORDER BY a.CREATE_TIME DESC';
	// TODO
	exports.getCurrentTasks = function(user_id, cb){
		user_id = user_id || '5666d061cca60fe0113d1391';
		// TODO
		mysql.query(sql, [user_id], function (err, docs){
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