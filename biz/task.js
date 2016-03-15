/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	uuid = require('node-uuid'),
	mysql_util = util.mysql_util,
	mysql = util.mysql;

var exports = module.exports;

var biz = {
    tasktake: require('./tasktake')
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
        if(null === TALK_TIME_LEN || 0 === TALK_TIME_LEN) return cb(null, ['数据异常']);
        // TODO
        biz.tasktake.getById(newInfo.TASKTAKE_ID, function (err, doc){
            if(err) return cb(err);
            if(!doc) return cb(null, ['没有找到该任务']);
            if(user_id !== doc.USER_ID) return cb(null, ['非法操作']);
            // if(TALK_TIME_LEN < doc.TALK_TIME_MIN) return cb(null, ['通话时长不能少于 '+ doc.TALK_TIME_MIN +' 秒']);
            
            // TODO 当前时间
            var curTime = new Date();
            // TODO 超时截止时间
            var timeout = new Date(doc.TASKTAKE_CREATE_TIME.getTime() + (doc.TALK_TIMEOUT * 1000));
            newInfo.STATUS = timeout.getTime() > curTime.getTime() ? 1 : 2;
            
            // 判断通话时长是否够
            if(TALK_TIME_LEN < doc.TALK_TIME_MIN) newInfo.STATUS = 4;
            
            newInfo.TALK_TIME_LEN = TALK_TIME_LEN;
            newInfo.UPLOAD_TIME = curTime;
            newInfo.id = doc.TASKTAKE_ID;
            
            biz.tasktake.editInfo(newInfo, function (err, status){
            	if(err) return cb(err);
            	cb(null, null, status);
            });
        });
    };
})(exports);

(function (exports){
    var _sql = 'SELECT c.* FROM'+
                    ' (SELECT (b.TASK_SUM-b.INIT_COUNT-b.FINISH_COUNT) SURPLUS_COUNT, b.* FROM'+
                      ' (SELECT'+
                        ' (SELECT COUNT(1) FROM r_project_task_take WHERE STATUS=0 AND TASK_ID=a.id) INIT_COUNT,'+
                        ' (SELECT COUNT(1) FROM r_project_task_take WHERE STATUS=1 AND TASK_ID=a.id) FINISH_COUNT, a.*'+
                          ' FROM r_project_task a WHERE a.STATUS=1 AND NOW() BETWEEN a.START_TIME AND a.END_TIME ORDER BY a.CREATE_TIME) b) c WHERE c.SURPLUS_COUNT>0';
	/**
	 * 正常的任务（例如合理的时间区间）
	 *
	 * @params
	 * @return
	 */
	exports.findNormal = function(user_id, cb){
        var sql = 'SELECT g.PROJECT_NAME, g.TEL_NUM, f.* FROM (SELECT e.* FROM'+
                     ' (SELECT'+
                       ' (SELECT COUNT(1) FROM r_project_task_take WHERE TASK_ID in (SELECT id FROM r_project_task WHERE PROJECT_ID=d.PROJECT_ID) AND STATUS in (0,1,2,4) AND USER_ID=?) FINISH_STATUS, d.*'+
                         ' FROM ('+ _sql +') d) e WHERE e.FINISH_STATUS=0 LIMIT 1) f'+
                           ' LEFT JOIN r_project g ON (f.PROJECT_ID=g.id) WHERE g.id IS NOT NULL';
	    // TODO
	    mysql.query(sql, [user_id], function (err, docs){
                if(err) return cb(err);
                cb(null, mysql.checkOnly(docs) ? docs[0] : null);
	    });
	};

	/**
	 * 获取剩余的任务总数
	 *
	 * @params
	 * @return
	 */
    exports.getSurplusCount = function(cb){
        var sql = 'SELECT SUM(d.SURPLUS_COUNT) SURPLUS_COUNT FROM ('+ _sql +') d';
        mysql.query(sql, [], function (err, docs){
            if(err) return cb(err);
            // TODO
	        var doc = mysql.checkOnly(docs) ? docs[0] : null;
	        cb(null, !doc ? 0 : doc.SURPLUS_COUNT);
	    });
	};
})(exports);

(function (exports){
	function apply(user_id, cb){
        this.findNormal(user_id, function (err, doc){
            if(err) return cb(err);
            if(!doc) return cb(null, ['没有合适的任务了']);

            var task = doc;

            biz.tasktake.saveNew({ TASK_ID: doc.id, USER_ID: user_id }, function (err, doc){
                if(err) return cb(err);
                // TODO
                task.TASKTAKE_ID = doc.id;
                task.TASKTAKE_CREATE_TIME = doc.CREATE_TIME;
                task.STATUS = doc.STATUS;
                cb(null, null, task);
            });
        });
    }

	/**
	 * 申请任务
	 *
	 * @params
	 * @return
	 */
	exports.apply = function(user_id, cb){
	    var that = this;
		// TODO
		biz.tasktake.clearTimeout(function (err, status){
		    if(err) return cb(err);
		    // TODO
		    biz.tasktake.findLast(user_id, function (err, doc){
		        if(err) return cb(err);
		        if(!doc) return apply.call(that, user_id, cb);
		        // 除未完成任务外
		        if(0 < doc.STATUS) return apply.call(that, user_id, cb);
		        cb(null, null, doc);
		    });
		});
	};
})(exports);

(function (exports){

	var _sql = 'SELECT d.PROJECT_NAME, c.* FROM'+
				' (SELECT b.USER_NAME CREATE_USER_NAME, a.* FROM r_project_task a LEFT JOIN s_user b ON (a.CREATE_USER_ID=b.id) WHERE b.id IS NOT NULL) c'+
				' LEFT JOIN r_project d ON (c.PROJECT_ID=d.id) WHERE d.id IS NOT NULL';
	/**
	 *
	 * @params
	 * @return
	 */
	exports.getById = function(id, cb){
		var sql = _sql +' AND c.id=?';
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
	exports.findByTask = function(pagination, task, cb){
		var sql = _sql;
		var postData = [];

		if(task){
			// TODO
			var CREATE_USER_ID = util.isEmpty(task.CREATE_USER_ID);
			if(CREATE_USER_ID){
				sql += ' AND c.CREATE_USER_ID=?';
				postData.push(CREATE_USER_ID);
			}
			// TODO
			var PROJECT_ID = util.isEmpty(task.PROJECT_ID);
			if(PROJECT_ID){
				sql += ' AND c.PROJECT_ID=?';
				postData.push(PROJECT_ID);
			}
		}

		sql += ' ORDER BY c.CREATE_TIME DESC';

		if(pagination){
			sql += ' LIMIT ?, ?';
			postData.push((pagination[1] - 1) * pagination[0]);
			postData.push(pagination[0]);
		}

		// TODO
		mysql.query(sql, postData, function (err, docs){
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
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'INSERT INTO r_project_task (id, TASK_NAME, TASK_INTRO, SMS_INTRO, TASK_SUM, PROJECT_ID, TALK_TIME_MIN, TALK_TIMEOUT, START_TIME, END_TIME, CREATE_USER_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		// TODO
		exports.saveNew = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				newInfo.CREATE_USER_ID = util.isEmpty(newInfo.CREATE_USER_ID);
				if(!newInfo.CREATE_USER_ID) return cb(null, ['发布人不能为空']);

				// CREATE
				var postData = [
					util.replaceAll(uuid.v1(), '-', ''),
					newInfo.TASK_NAME,
					newInfo.TASK_INTRO,
					newInfo.SMS_INTRO,
					newInfo.TASK_SUM || 20,
					newInfo.PROJECT_ID,
					newInfo.TALK_TIME_MIN || 30,
					newInfo.TALK_TIMEOUT || 3600,
					newInfo.START_TIME || new Date(),
					newInfo.END_TIME || new Date(),
					newInfo.CREATE_USER_ID,
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
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'UPDATE r_project_task set TASK_NAME=?, TASK_INTRO=?, SMS_INTRO=?, TASK_SUM=?, TALK_TIME_MIN=?, TALK_TIMEOUT=?, START_TIME=?, END_TIME=?, STATUS=? WHERE id=?';
		// TODO
		exports.editInfo = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// EDIT
				var postData = [
					newInfo.TASK_NAME,
					newInfo.TASK_INTRO,
					newInfo.SMS_INTRO,
					newInfo.TASK_SUM || 20,
					newInfo.TALK_TIME_MIN || 30,
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

/**
 *
 * @params
 * @return
 */
(function (exports){

	function proc_sql_center(ids){
		var sql = '';
		for(var i in ids){
			sql += '?, ';
		}
		return sql.substring(0, sql.length - 2);
	}

	/**
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var _sql_start = 'DELETE FROM r_project_task WHERE id IN (';
		var _sql_end = ')';

		// TODO
		exports.remove = function(ids, cb){
			if(!ids && (0 === ids.length)) return cb(null, ['参数异常']);

			var sql = _sql_start;
			sql += proc_sql_center(ids);
			sql += _sql_end;

			mysql.query(sql, ids, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		};
	})(exports);
})(exports);