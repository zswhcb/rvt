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
	exports.findByProject = function(pagination, project, cb){
		var sql = _sql + _sql_orderby;

		var postData = [];

		if(pagination){
			sql += ' LIMIT ?, ?';
			postData.push((pagination[1] - 1) * pagination[0]);
			postData.push(pagination[0]);
		}

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
		var _sql_start = 'DELETE FROM r_project WHERE id IN (';
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