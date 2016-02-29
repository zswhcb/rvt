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
                ' FROM (SELECT b.TASK_NAME, b.PROJECT_ID, a.*'+
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