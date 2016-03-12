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
				' FROM r_project a, r_project_type b'+
				' WHERE a.PROJECT_TYPE_ID=b.id AND a.CREATE_USER_ID=? ORDER BY a.PROJECT_TYPE_ID, a.CREATE_TIME DESC'
	// TODO
	exports.getByUserId = function(user_id, cb){
		mysql.query(sql, [user_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

(function (exports){
	var _sql = 'SELECT b.TYPE_NAME PROJECT_TYPE_NAME, a.* FROM r_project a LEFT JOIN r_project_type b ON (a.PROJECT_TYPE_ID=b.id) WHERE b.id IS NOT NULL';
	var _sql_orderby = ' ORDER BY a.CREATE_TIME DESC';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.getById = function(id, cb){
		var sql = _sql +' AND a.id=?';
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
	exports.findByProject = function(cb){
		var sql = _sql + _sql_orderby;
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
		var sql = 'INSERT INTO r_project (id, PROJECT_NAME, PROJECT_INTRO, PROJECT_TYPE_ID, TEL_NUM, CREATE_USER_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?)';
		// TODO
		exports.saveNew = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// CREATE
				var postData = [
					util.replaceAll(uuid.v1(), '-', ''),
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
		var sql = 'UPDATE r_project set PROJECT_NAME=?, PROJECT_INTRO=?, PROJECT_TYPE_ID=?, TEL_NUM=?, STATUS=? WHERE id=?';
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
					newInfo.STATUS,
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