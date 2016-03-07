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
    handtask: require('./handtask'),
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

            // if(!doc || (1 === doc.HANDTASK_STATUS) || (user_id !== doc.HANDTASK_USER_ID) ||  (newInfo.TEL_NUM !== doc.TEL_NUM)) return cb(null, ['非法操作']);
            // // TODO 通话时长不达标
            // if(TALK_TIME_LEN < doc.TALK_TIME_LEN) return cb(null, ['通话时长不能少于 '+ doc.TALK_TIME_LEN +' 秒']);
            // // TODO 当前时间
            // var curTime = new Date();
            // // TODO 超时截止时间
            // var timeout = new Date(doc.HANDTASK_CREATE_TIME.getTime() + (doc.TALK_TIMEOUT * 1000));
            // // TODO
            // newInfo.STATUS = timeout.getTime() > curTime.getTime() ? 1 : 2;
            // newInfo.TALK_TIME_LEN = TALK_TIME_LEN;
            // // TODO
            // biz.tasktake.editInfo(newInfo, function (err, status){
            //     if(err) return cb(err);
            //     cb(null, null, status);
            // });

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



 //    // TODO 清理超时数据
 //    biz.handtask.clearTimeout(function (err, status){
	// if(err) return cb(err);
	// // TODO 获取之前申请的任务（未过期）
	// biz.handtask.getMyHandTask(user_id, function (err, msg, doc){
	//     if(err) return cb(err);
	//     if(!!msg) return cb(null, msg);
	//     if(!!doc) return cb(null, null, doc);
	//     // TODO 获取任务状态信息
	//     that.getTaskStatus(user_id, task_id, function (err, msg, doc){
	// 	if(err) return cb(err);
	// 	if(!!msg) return cb(null, msg);
	// 	if(!doc) return cb(null, ['此任务不存在，请重新申请']);
	// 	// TODO
	// 	if(!!doc.HANDTASK_ID) return cb(null, ['同一项目下的任务只能申请一次']);
	// 	// TODO 检测任务状态
	// 	if((doc.INIT_TASK_SUM + doc.SUCCESS_TASK_SUM) >= doc.TASK_SUM) return cb(null, ['下手晚了']);
	// 	// TODO
	// 	var newTask = doc;
	// 	// TODO 开始新的申请
	// 	biz.handtask.saveNew({ TASK_ID: task_id, USER_ID: user_id }, function (err, doc){
	// 	    if(err) return cb(err);
	// 	    // TODO 返回抢任务的ID
	// 	    newTask.HANDTASK_ID = doc.id;
	// 	    newTask.HANDTASK_CREATE_TIME = doc.CREATE_TIME;
	// 	    cb(null, null, newTask);
	// 	});
	//     });
	// });
 //    });




/**
 * 当前可接的任务信息
 *
 * @params
 * @return
 */
(function (exports){
    var sql_1 = 'SELECT'+
	'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=0 AND TASK_ID=b.id) INIT_TASK_SUM,'+
	'  (SELECT COUNT(1) FROM p_handtask WHERE STATUS=1 AND TASK_ID=b.id) SUCCESS_TASK_SUM,'+
	'  b.*'+
	' FROM p_task b WHERE ? BETWEEN b.START_TIME AND b.END_TIME';

    /**
     * 获取指定任务ID的任务状态
     *
     * @params
     * @return
     */
    exports.getTaskStatus = function(user_id, task_id, cb){
	var sql = 'SELECT'+
	    '  (SELECT a.id FROM p_handtask a WHERE a.STATUS=1 AND a.USER_ID=? AND a.TASK_ID IN (SELECT id FROM p_task WHERE PROJECT_ID=c.PROJECT_ID) LIMIT 1) HANDTASK_ID,'+
	    '  (SELECT COUNT(1) FROM p_handtask a WHERE a.STATUS=1 AND a.USER_ID=? AND a.TASK_ID IN (SELECT id FROM p_task WHERE PROJECT_ID=c.PROJECT_ID)) HANDTASK_FINISH_COUNT,'+
	    '  c.*'+
	    ' FROM ('+ sql_1 +') c WHERE c.TASK_SUM>c.SUCCESS_TASK_SUM AND c.id=?';
	// TODO
	mysql.query(sql, [user_id, user_id, new Date(), task_id], function (err, docs){
	    if(err) return cb(err);
	    // TODO
	    if(!mysql.checkOnly(docs)) return cb(null, null, null);
	    // TODO
	    var doc = docs[0];
	    if(1 < doc.HANDTASK_FINISH_COUNT) return cb(null, ['数据异常，请联系管理员']);
	    // TODO
	    cb(null, null, doc);
	});
    };

    // TODO
    exports.getCurrentTasks = function(user_id, cb){
	var sql = 'SELECT'+
	    ' IFNULL((SELECT d.STATUS FROM p_handtask d LEFT JOIN p_task e ON (d.TASK_ID=e.id) WHERE e.id IS NOT NULL AND e.PROJECT_ID=c.PROJECT_ID AND d.USER_ID=? ORDER BY d.CREATE_TIME DESC LIMIT 1), 4) HANDTASK_STATUS,'+
	    ' c.* FROM ('+ sql_1 +') c ORDER BY c.CREATE_TIME DESC';
	// TODO
	mysql.query(sql, [user_id, new Date()], function (err, docs){
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
    var sql_1 = 'SELECT c.USER_NAME, b.PROJECT_NAME, a.* FROM p_task a LEFT JOIN p_project b ON (a.PROJECT_ID=b.id) LEFT JOIN s_user c ON (a.CREATE_USER_ID=c.id) WHERE b.id IS NOT NULL AND c.id IS NOT NULL';
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
	var sql = 'INSERT INTO p_task (id, TASK_NAME, TASK_INTRO, SMS_INTRO, TASK_SUM, PROJECT_ID, TALK_TIME_LEN, TALK_TIMEOUT, START_TIME, END_TIME, CREATE_USER_ID, CREATE_TIME) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
	// TODO
	exports.saveNew = function(newInfo, cb){
	    formVali(newInfo, function (err){
		if(err) return cb(err);
		// CREATE
		var postData = [
		    util.genObjectId(),
		    newInfo.TASK_NAME,
		    newInfo.TASK_INTRO,
		    newInfo.SMS_INTRO,
		    newInfo.TASK_SUM || 20,
		    newInfo.PROJECT_ID,
		    newInfo.TALK_TIME_LEN || 30,
		    newInfo.TALK_TIMEOUT || 3600,
		    newInfo.START_TIME || new Date(),
		    newInfo.END_TIME || new Date(),
		    newInfo.CREATE_USER_ID,
		    new Date()
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
	var sql = 'UPDATE p_task set TASK_NAME=?, TASK_INTRO=?, SMS_INTRO=?, TASK_SUM=?, TALK_TIME_LEN=?, TALK_TIMEOUT=?, START_TIME=?, END_TIME=? WHERE id=?';
	// TODO
	exports.editInfo = function(newInfo, cb){
	    formVali(newInfo, function (err){
		if(err) return cb(err);
		// CREATE
		var postData = [
		    newInfo.TASK_NAME,
		    newInfo.TASK_INTRO,
		    newInfo.SMS_INTRO,
		    newInfo.TASK_SUM || 20,
		    newInfo.TALK_TIME_LEN || 30,
		    newInfo.TALK_TIMEOUT || 3600,
		    newInfo.START_TIME || new Date(),
		    newInfo.END_TIME || new Date(),
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