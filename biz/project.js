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

var sql_1 = 'SELECT c.USER_NAME, c.REAL_NAME, b.TYPE_NAME PROJECT_TYPE_NAME, a.* FROM p_project a, p_project_type b, s_user c WHERE a.PROJECT_TYPE_ID=b.id AND a.USER_ID=c.id';

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
	var sql = sql_1 +' ORDER BY a.CREATE_TIME DESC';
	mysql.query(sql, null, function (err, docs){
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

	var sql_add = 'INSERT INTO p_project (id, PROJECT_NAME, PROJECT_INTRO, PROJECT_TYPE_ID, TEL_NUM, USER_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?)';

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
				newInfo.PROJECT_NAME,
				newInfo.PROJECT_INTRO,
				newInfo.PROJECT_TYPE_ID,
				newInfo.TEL_NUM,
				newInfo.USER_ID,
				new Date(),
				newInfo.STATUS || 1
			];
			mysql.query(sql_add, postData, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		});
	};

	var sql_edit = 'UPDATE p_project set PROJECT_NAME=?, PROJECT_INTRO=?, TEL_NUM=?, STATUS=? WHERE id=?';

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
				newInfo.PROJECT_NAME,
				newInfo.PROJECT_INTRO,
				newInfo.TEL_NUM,
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