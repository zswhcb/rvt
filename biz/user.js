/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	uuid = require('node-uuid'),
	rest = util.service.rest,
	md5 = util.md5,
	mysql_util = util.mysql_util,
	mysql = util.mysql;

var exports = module.exports;

var biz = {
	user_role: require('./user_role'),
	authcode: require('./authcode')
};

(function (exports){
	// 查询用户 关联用户角色表
	var _sql = 'SELECT b.ROLE_NAME, a.* FROM s_user a LEFT JOIN s_role b ON (a.ROLE_ID=b.id) WHERE b.id IS NOT NULL';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByUser = function(user, cb){
		var sql = _sql;
		var postData = [];

		if(user){
			// TODO
			var INVITE_USER_ID = util.isEmpty(user.INVITE_USER_ID);
			if(INVITE_USER_ID){
				sql += ' AND a.INVITE_USER_ID=?';
				postData.push(INVITE_USER_ID);
			}
		}

		sql += ' ORDER BY a.ROLE_ID, a.CREATE_TIME DESC';

		// TODO
		mysql.query(sql, postData, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};

	/**
	 * 用户登陆
	 *
	 * @params {Object} logInfo 用户登陆信息
	 * @params {Function} cb 回调函数
	 * @return
	 */
	exports.login = function(logInfo, cb){
		logInfo.USER_NAME = util.isEmpty(logInfo.USER_NAME);
		if(!logInfo.USER_NAME) return cb(null, ['用户名或密码输入错误']);

		this.findByName(logInfo.USER_NAME, function (err, doc){
			if(err) return cb(err);
			// TODO
			if(!doc) return cb(null, ['用户名或密码输入错误']);

			// TODO
			if(1 !== doc.STATUS) return cb(null, ['禁止登陆']);

			// TODO
			if(md5.hex(logInfo.USER_PASS) !== doc.USER_PASS)
				return cb(null, ['用户名或密码输入错误']);
			
			cb(null, null, doc);
		});
	};

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
	exports.findByName = function(user_name, cb){
		var sql = _sql +' AND a.USER_NAME=?';
		mysql.query(sql, [user_name], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByApiKey = function(apiKey, cb){
		var sql = _sql +' AND a.APIKEY=?';
		mysql.query(sql, [apiKey], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
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
		var sql = 'INSERT INTO s_user (id, ROLE_ID, INVITE_USER_ID, USER_NAME, USER_PASS, EMAIL, MOBILE, APIKEY, SECKEY, REAL_NAME, ALIPAY_ACCOUNT, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		// TODO
		exports.saveNew = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// TODO
				exports.findByName(newInfo.USER_NAME, function (err, doc){
					if(err) return cb(err);
					// TODO
					if(doc) return cb(null, ['手机号已经存在']);
					// CREATE
					var postData = [
						util.replaceAll(uuid.v1(), '-', ''),
						newInfo.ROLE_ID || 'e4acb256cafa4cb487fa6abf508df073',
						newInfo.INVITE_USER_ID,
						newInfo.USER_NAME,
						md5.hex(newInfo.USER_PASS || '123456'),
						newInfo.EMAIL,
						newInfo.MOBILE,
						rest.genApiKey(),
						rest.genSecKey(),
						newInfo.REAL_NAME,
						newInfo.ALIPAY_ACCOUNT,
						new Date(),
						newInfo.STATUS || 1
					];
					mysql.query(sql, postData, function (err, status){
						if(err) return cb(err);
						cb(null, null, status);
					});
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
		var sql = 'UPDATE s_user set USER_PASS=?, APIKEY=?, SECKEY=?, EMAIL=?, MOBILE=?, REAL_NAME=?, ALIPAY_ACCOUNT=?, DEVICE_CODE=?, STATUS=? WHERE id=?';
		// TODO
		exports.editInfo = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// EDIT
				var postData = [
					md5.hex(newInfo.USER_PASS || '123456'),
					rest.genApiKey(),
					rest.genSecKey(),
					newInfo.EMAIL,
					newInfo.MOBILE,
					newInfo.REAL_NAME,
					newInfo.ALIPAY_ACCOUNT,
					newInfo.DEVICE_CODE,
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
	var _sql_start = 'DELETE FROM s_user WHERE id IN (';
	var _sql_end = ')';

	// TODO
	exports.remove = function(ids, cb){
		if(!ids && (0 === ids.length)) return cb(null, ['参数异常']);

		var sql = _sql_start;
		for(var i in ids){ sql += '?, '; }
		sql = sql.substring(0, sql.length-2);
		sql += _sql_end;

		mysql.query(sql, ids, function (err, status){
			if(err) return cb(err);
			cb(null, null, status);
		});
	};
})(exports);