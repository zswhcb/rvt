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
	exports.commit = function(user_id, newInfo, cb){
		// TODO 检查是否为数字
		var TALK_TIME_LEN = util.checkNum(newInfo.TALK_TIME_LEN);
		if(null === TALK_TIME_LEN || 0 === TALK_TIME_LEN) return cb(null, ['参数异常']);
		// TODO
		biz.handtask.getById(newInfo.id, function (err, doc){
			if(err) return cb(err);
			if(!doc || (1 === doc.STATUS) || (user_id !== doc.USER_ID)) return cb(null, ['非法操作']);
			// TODO 通话时长不达标
			if(TALK_TIME_LEN < doc.TASK_TALK_TIME_LEN) return cb(null, ['通话时长不能少于 '+ doc.TASK_TALK_TIME_LEN +' 秒']);
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
 * 申请任务
 *
 * @params
 * @return
 */
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
				if(!!doc.id) return cb(null, ['此任务之前已经申请过']);
				// TODO 检测任务状态
				if((doc.INIT_TASK_SUM + doc.SUCCESS_TASK_SUM) >= doc.TASK_SUM) return cb(null, ['下手晚了']);
				// TODO
				var newTask = doc;
				// TODO 开始新的申请
				biz.handtask.saveNew({ TASK_ID: task_id, USER_ID: user_id }, function (err, doc){
					if(err) return cb(err);
					// TODO 返回抢任务的ID
					newTask.id = doc.id;
					cb(null, null, newTask);
				});
			});
		});
	});
};

/**
 * 当前可接的任务信息
 *
 * @params
 * @return
 */
(function (exports){
	var sql_1 = 'SELECT c.*'+
				' FROM (SELECT'+
						'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=0 AND TASK_ID=b.id) INIT_TASK_SUM,'+
						'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=b.id) SUCCESS_TASK_SUM,'+
						' b.id TASK_ID, b.TEL_NUM TASK_TEL_NUM, b.TASK_NAME, b.TASK_INTRO, b.TASK_SUM, b.PROJECT_ID, b.TALK_TIMEOUT TASK_TALK_TIMEOUT, b.TALK_TIME_LEN TASK_TALK_TIME_LEN, b.START_TIME TASK_START_TIME, b.END_TIME TASK_END_TIME, b.CREATE_TIME TASK_CREATE_TIME, b.STATUS TASK_STATUS'+
						' FROM p_task b WHERE b.STATUS=1 AND ? BETWEEN b.START_TIME AND b.END_TIME) c';

	/**
	 * 获取指定任务ID的任务状态
	 *
	 * @params
	 * @return
	 */
	exports.getTaskStatus = function(user_id, task_id, curTime, cb){
		curTime = curTime || new Date();
		// TODO
		var sql = 'SELECT'+
				' (SELECT a.id FROM p_handtask a WHERE a.STATUS=1 AND a.USER_ID=? AND a.TASK_ID IN (SELECT id FROM p_task WHERE PROJECT_ID=d.PROJECT_ID)) HANDTASK_ID,'+
				' d.* FROM ('+ sql_1 +') d WHERE d.TASK_ID=?';
		// TODO
		mysql.query(sql, [user_id, curTime, task_id], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};

	// TODO
	exports.getCurrentTasks = function(cb){
		var sql = sql_1 +' WHERE c.TASK_SUM>a.SUCCESS_TASK_SUM';
		// TODO
		mysql.query(sql, [new Date()], function (err, docs){
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