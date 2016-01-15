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
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT'+
				'  (SELECT COUNT(1) FROM p_task WHERE PROJECT_ID=a.id) TASK_COUNT,'+
				'  b.TYPE_NAME PROJECT_TYPE_NAME,'+
				'  a.*'+
				' FROM p_project a, p_project_type b'+
				' WHERE a.PROJECT_TYPE_ID=b.id AND a.STATUS=1 AND a.CREATE_USER_ID=? ORDER BY a.PROJECT_TYPE_ID, a.CREATE_TIME DESC'
	// TODO
	exports.getByUserId = function(user_id, cb){
		mysql.query(sql, [user_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

(function (exports){
	var sql_1 = 'SELECT'+
					'  c.USER_NAME, c.REAL_NAME, b.TYPE_NAME PROJECT_TYPE_NAME,'+
					'  a.*'+
					' FROM p_project a, p_project_type b, s_user c'+
					' WHERE a.PROJECT_TYPE_ID=b.id AND a.CREATE_USER_ID=c.id';
	var sql_orderby = ' ORDER BY a.CREATE_USER_ID, a.CREATE_TIME DESC';

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
		var sql = 'INSERT INTO p_project (id, PROJECT_NAME, PROJECT_INTRO, PROJECT_TYPE_ID, TEL_NUM, CREATE_USER_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?)';
		// TODO
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
					newInfo.CREATE_USER_ID,
					new Date(),
					newInfo.STATUS || 1
				];
				// TODO
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
		var sql = 'UPDATE p_project set PROJECT_NAME=?, PROJECT_INTRO=?, PROJECT_TYPE_ID=?, TEL_NUM=?, STATUS=? WHERE id=?';
		// TODO
		exports.editInfo = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// EDIT
				var postData = [
					newInfo.PROJECT_NAME,
					newInfo.PROJECT_INTRO,
					newInfo.PROJECT_TYPE_ID,
					newInfo.TEL_NUM,
					newInfo.STATUS || 1,
					newInfo.id
				];
				// TODO
				mysql.query(sql, postData, function (err, status){
					if(err) return cb(err);
					cb(null, null, status);
				});
			});
		};
	})(exports);
})(exports);