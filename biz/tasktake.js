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

(function (exports){
    var sql = 'SELECT d.PROJECT_NAME, d.TEL_NUM, c.*'+
                  ' FROM (SELECT b.TASK_NAME, b.PROJECT_ID, b.TASK_INTRO, b.SMS_INTRO, b.TASK_SUM, b.TALK_TIMEOUT, b.TALK_TIME_MIN, b.START_TIME, b.END_TIME, a.*'+
                  ' FROM (SELECT * FROM r_project_task_take WHERE id=?) a'+
                  ' LEFT JOIN r_project_task b ON (a.TASK_ID=b.id) WHERE b.id IS NOT NULL) c'+
                  ' LEFT JOIN r_project d ON (c.PROJECT_ID=d.id) WHERE d.id IS NOT NULL';
    /**
     *
     * @params
     * @return
     */
    exports.getById = function(id, cb){
        mysql.query(sql, [id], function (err, docs){
            if(err) return cb(err);
            var doc = null;

            if(mysql.checkOnly(docs)){
                doc = docs[0];
                doc.TASKTAKE_ID = doc.id;
                doc.TASKTAKE_CREATE_TIME = doc.CREATE_TIME;
                doc.id = doc.TASK_ID;
            }

            cb(null, doc);
        });
    };
})(exports);

/**
 * 获取用户最后一次的任务信息
 *
 * @params
 * @return
 */
(function (exports){
    var sql = 'SELECT d.PROJECT_NAME, d.TEL_NUM, c.*'+
                ' FROM (SELECT b.TASK_NAME, b.PROJECT_ID, b.TASK_INTRO, b.SMS_INTRO, b.TASK_SUM, b.TALK_TIMEOUT, b.TALK_TIME_MIN, b.START_TIME, b.END_TIME, a.*'+
                    ' FROM (SELECT * FROM r_project_task_take WHERE STATUS=0 AND USER_ID=?) a'+
                    ' LEFT JOIN r_project_task b ON (a.TASK_ID=b.id) WHERE b.id IS NOT NULL) c'+
                    ' LEFT JOIN r_project d ON (c.PROJECT_ID=d.id) WHERE d.id IS NOT NULL';
    // TODO
    exports.findLast = function(user_id, cb){
        mysql.query(sql, [user_id], function (err, docs){
            if(err) return cb(err);
            var doc = null;

            if(mysql.checkOnly(docs)){
                doc = docs[0];
                doc.TASKTAKE_ID = doc.id;
                doc.TASKTAKE_CREATE_TIME = doc.CREATE_TIME;
                doc.id = doc.TASK_ID;
            }

            cb(null, doc);
        });
    };
})(exports);

/**
 * 检测数据是否超时
 *
 * @params
 * @return 超时则 true
 */
exports.checkTimeout = function(data){
    var createTime = data.CREATE_TIME.getTime();
    var curTime = (new Date).getTime();
    return curTime > (createTime + 1000 * (data.TALK_TIMEOUT - 60));
};

(function (exports){
    var sql = 'UPDATE r_project_task_take SET STATUS=3'+ // 状态：3，由0变为3，任务超时（失效）
                ' WHERE id in (SELECT a.id FROM'+
                    ' (SELECT id, TASK_ID, CREATE_TIME FROM r_project_task_take WHERE STATUS=0) a'+
                    ' LEFT JOIN r_project_task b ON (a.TASK_ID=b.id)'+
                    ' WHERE b.id IS NOT NULL AND DATE_ADD(a.CREATE_TIME, INTERVAL(b.TALK_TIMEOUT - ?) SECOND) < ?)';
    // TODO
    exports.clearTimeout = function(cb){
        // TODO
        mysql.query(sql, [60, new Date()], function (err, status){
            if(err) return cb(err);
            cb(null, status);
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
	var sql = 'INSERT INTO r_project_task_take (id, TASK_ID, USER_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?)';
	// TODO
	exports.saveNew = function(newInfo, cb){
		var postData = [
			util.replaceAll(uuid.v1(), '-', ''),
			newInfo.TASK_ID,
			newInfo.USER_ID,
			new Date(),
			0
		];
		mysql.query(sql, postData, function (err, status){
            if(err) return cb(err);
            cb(null, { id: postData[0], CREATE_TIME: postData[3], STATUS: postData[4] });
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
    var sql = 'UPDATE r_project_task_take SET UPLOAD_TIME=?, TALK_TIME=?, TALK_TIME_LEN=?, STATUS=? WHERE id=?';
    // TODO
    exports.editInfo = function(newInfo, cb){
        var postData = [
            newInfo.UPLOAD_TIME,
            new Date(newInfo.TALK_TIME),
            newInfo.TALK_TIME_LEN,
            newInfo.STATUS || 4,
            newInfo.id
        ];
        mysql.query(sql, postData, function (err, status){
            if(err) return cb(err);
            cb(null, status);
        });
    };
})(exports);

(function (exports){
    var _sql_start = 'SELECT f.USER_NAME, e.*'+
                ' FROM (SELECT d.PROJECT_NAME, d.TEL_NUM, c.*'+
                    ' FROM (SELECT b.TASK_NAME, b.PROJECT_ID, a.*'+
                        ' FROM (';

    var _sql_end = ') a'+
                        ' LEFT JOIN r_project_task b ON (a.TASK_ID=b.id) WHERE b.id IS NOT NULL) c'+
                        ' LEFT JOIN r_project d ON (c.PROJECT_ID=d.id) WHERE d.id IS NOT NULL) e'+
                        ' LEFT JOIN s_user f ON (e.USER_ID=f.id)'+
                        ' WHERE f.id IS NOT NULL ORDER BY e.PROJECT_ID, e.TASK_ID, e.CREATE_TIME DESC';
    /**
     *
     * @params
     * @return
     */
    exports.findByStartTime = function(start_time, cb){
        var sql = _sql_start;
        sql += 'SELECT * FROM r_project_task_take WHERE TASK_ID IN (SELECT id FROM r_project_task WHERE DATE(START_TIME) = DATE_FORMAT(?, "%Y-%m-%d"))';
        sql += _sql_end;

        mysql.query(sql, [start_time], function (err, docs){
            if(err) return cb(err);
            cb(null, docs);
        });
    };

    /**
     *
     * @params
     * @return
     */
    exports.findByUserId = function(user_id, create_time, cb){
        var sql = _sql_start;
        sql += 'SELECT * FROM r_project_task_take WHERE USER_ID=? AND DATE_FORMAT(CREATE_TIME, "%Y-%m") = ?';
        sql += _sql_end;

        mysql.query(sql, [user_id, create_time], function (err, docs){
            if(err) return cb(err);
            cb(null, docs);
        });
    };
})(exports);