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
 * 获取指定任务ID的任务状态
 *
 * @params
 * @return
 */
(function (exports){
	// TODO
	exports.commit = function(newInfo, cb){
		// TODO 检查是否为数字
		var TASK_TALK_TIME_LEN = util.checkNum(newInfo.TASK_TALK_TIME_LEN);
		if(null === TASK_TALK_TIME_LEN || 0 === TASK_TALK_TIME_LEN) return cb(null, ['参数异常']);
		// TODO
		biz.handtask.getById(newInfo.HANDTASK_ID, function (err, doc){
			if(err) return cb(err);
			if(!doc || (1 === doc.STATUS) || (newInfo.USER_ID !== doc.USER_ID)) return cb(null, ['非法操作']);
			// TODO 通话时长不达标
			if(TASK_TALK_TIME_LEN < doc.TASK_TALK_TIME_LEN) return cb(null, ['通话时长不能少于 '+ doc.TASK_TALK_TIME_LEN +' 秒']);
			// TODO 当前时间
			var curTime = new Date();
			// TODO 超时截止时间
			var timeout = new Date(doc.CREATE_TIME.getTime() + (doc.TASK_TALK_TIMEOUT * 1000));
			// TODO
			newInfo.STATUS = timeout.getTime() > curTime.getTime() ? 1 : 2;
			// TODO
			biz.handtask.editInfo(newInfo, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		});
	};
})(exports);

/**
 * 获取指定任务ID的任务状态
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT'+
				'  (SELECT b.id FROM p_handtask b WHERE STATUS=1 AND b.USER_ID=? AND b.TASK_ID IN (SELECT id FROM p_task WHERE PROJECT_ID=a.PROJECT_ID)) HANDTASK_ID,'+
				'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=0 AND TASK_ID=a.id) INIT_TASK_SUM,'+
				'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=a.id) SUCCESS_TASK_SUM,'+
				'  a.*'+
				' FROM p_task a WHERE a.id=? AND ? BETWEEN a.START_TIME AND a.END_TIME';
	// TODO
	exports.getTaskStatus = function(user_id, task_id, curTime, cb){
		curTime = curTime || new Date();
		// TODO
		mysql.query(sql, [user_id, task_id, curTime], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};
})(exports);

/**
 * 申请任务
 *
 * @params
 * @return
 */
(function (exports){
	// 一个复杂的 用户申请任务使用
	// SELECT b1.id HANDTASK_ID, b1.USER_ID HANDTASK_USER_ID, b1.CREATE_TIME HANDTASK_CREATE_TIME, b1.STATUS HANDTASK_STATUS, a1.* FROM (SELECT b.PROJECT_NAME, a.* FROM (SELECT (SELECT COUNT(1) FROM p_handtask WHERE STATUS=0 AND TASK_ID=a01.id AND DATE_ADD(CREATE_TIME, INTERVAL a01.TALK_TIMEOUT second)>NOW()) INIT_TASK_SUM, (SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=a01.id) SUCCESS_TASK_SUM, a01.* FROM p_task a01 WHERE a01.STATUS=1) a LEFT JOIN (SELECT * FROM p_project WHERE STATUS=1) b ON (a.PROJECT_ID=b.id)) a1 LEFT JOIN (SELECT * FROM p_handtask WHERE USER_ID='566512760fd5504c45483a92') b1 ON (a1.id=b1.TASK_ID)
	var sql_1 = 'SELECT'+
				'  b1.id HANDTASK_ID, b1.USER_ID HANDTASK_USER_ID, b1.CREATE_TIME HANDTASK_CREATE_TIME, b1.STATUS HANDTASK_STATUS,'+
				'  a1.*'+
				' FROM (SELECT'+
				'  b.PROJECT_NAME,'+
				'  a.*'+
				' FROM (SELECT'+
				'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=0 AND TASK_ID=a01.id AND DATE_ADD(CREATE_TIME, INTERVAL a01.TALK_TIMEOUT second)>?) INIT_TASK_SUM,'+
				'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=a01.id) SUCCESS_TASK_SUM,'+
				'  a01.*'+
				' FROM p_task a01 WHERE a01.STATUS=1) a'+
				' LEFT JOIN (SELECT * FROM p_project WHERE STATUS=1) b ON (a.PROJECT_ID=b.id)) a1'+
				' LEFT JOIN (SELECT * FROM p_handtask WHERE USER_ID=?) b1 ON (a1.id=b1.TASK_ID)'; // 暂时此 sql 无用
	// TODO
	exports.apply = function(user_id, task_id, cb){
		var that = this;
		// TODO 清理超时数据
		biz.handtask.clearTimeout(null, function (err, status){
			if(err) return cb(err);
			// TODO 获取之前申请的任务（未过期）
			biz.handtask.getMyHandTask(0, user_id, function (err, msg, doc){
				if(err) return cb(err);
				if(!!msg) return cb(null, msg);
				if(!!doc) return cb(null, null, doc);
				// TODO 获取任务状态信息
				that.getTaskStatus(user_id, task_id, null, function (err, doc){
					if(err) return cb(err);
					if(!doc) return cb(null, ['此任务不存在，请重新申请']);
					// TODO
					if(!!doc.HANDTASK_ID) return cb(null, ['此任务之前已经申请过']);
					// TODO 检测任务状态
					if((doc.INIT_TASK_SUM + doc.SUCCESS_TASK_SUM) >= doc.TASK_SUM) return cb(null, ['下手晚了']);
					// TODO 开始新的申请
					biz.handtask.saveNew({ TASK_ID: task_id, USER_ID: user_id }, function (err, doc){
						if(err) return cb(err);
						// TODO 返回抢任务的ID
						cb(null, null, doc);
					});
				});
			});
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
	var sql = 'SELECT b.* FROM (SELECT'+
				'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=0 AND TASK_ID=a.id) INIT_TASK_SUM,'+
				'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=a.id) SUCCESS_TASK_SUM,'+
				'  a.*'+
				' FROM p_task a WHERE a.STATUS=1 AND ? BETWEEN a.START_TIME AND a.END_TIME) b'+
				' WHERE b.TASK_SUM>b.SUCCESS_TASK_SUM';
	// TODO
	exports.getCurrentTasks = function(user_id, cb){
		user_id = user_id || '5666d061cca60fe0113d1391';
		var curTime = new Date();
		// TODO
		mysql.query(sql, [curTime], function (err, docs){
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
			cb(null, status);
		});
	};
})(exports);


(function (exports){
	var sql_1 = 'SELECT b.PROJECT_NAME, a.* FROM p_task a LEFT JOIN p_project b ON (a.PROJECT_ID=b.id) WHERE b.id IS NOT NULL';
	var sql_orderby = ' ORDER BY a.CREATE_TIME DESC';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.getById = function(id, cb){
		var sql = sql_1 +' AND a.id=?';
		// TODO
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
		// TODO
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