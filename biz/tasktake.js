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
 * 获取用户最后一次的任务信息
 *
 * @params
 * @return
 */
(function (exports){
    var sql = 'SELECT d.PROJECT_NAME, d.TEL_NUM, c.*'+
                ' FROM (SELECT b.TASK_NAME, b.PROJECT_ID, b.TASK_INTRO, b.SMS_INTRO, b.TASK_SUM, b.TALK_TIMEOUT, b.TALK_TIME_MIN, b.START_TIME, b.END_TIME, a.*'+
                    ' FROM (SELECT * FROM r_project_task_take WHERE USER_ID=? ORDER BY CREATE_TIME DESC LIMIT 1) a'+
                    ' LEFT JOIN r_project_task b ON (a.TASK_ID=b.id) AND b.id IS NOT NULL) c'+
                    ' LEFT JOIN r_project d ON (c.PROJECT_ID=d.id) AND d.id IS NOT NULL';
    // TODO
    exports.findLast = function(user_id, cb){
        mysql.query(sql, [user_id], function (err, docs){
            if(err) return cb(err);
            cb(null, mysql.checkOnly(docs) ? docs[0] : null);
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
    var sql = 'UPDATE r_project_task_take SET STATUS=3 WHERE id=?';
    // TODO
    exports.clearTimeout = function(id, cb){
        // TODO
        mysql.query(sql, [id], function (err, status){
            if(err) return cb(err);
            cb(null, status);
        });
    };
})(exports);