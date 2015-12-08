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

// 查询用户 关联用户角色表
var sql_1 = 'SELECT b.id ROLE_ID, b.ROLE_NAME, a.* FROM s_user a, s_role b, s_user_role c WHERE a.id=c.USER_ID AND b.id=c.ROLE_ID';

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
 * 用户登陆
 *
 * @params {Object} logInfo 用户登陆信息
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	var sql = sql_1 +' AND a.STATUS=1 AND b.STATUS=1 AND a.USER_NAME=?';
	// TODO
	mysql.query(sql, [logInfo.USER_NAME], function (err, docs){
		if(err) return cb(err);
		// TODO
		if(!mysql.checkOnly(docs)) return cb(null, ['用户名或密码输入错误', 'USER_NAME']);
		// TODO
		var doc = docs[0];
		// TODO
		if(md5.hex(logInfo.USER_PASS) !== doc.USER_PASS)
			return cb(null, ['用户名或密码输入错误', 'USER_PASS'], doc);
		cb(null, null, doc);
	});
};

/**
 *
 * @params
 * @return
 */
exports.getById = function(id, cb){
	var sql = sql_1 +' AND a.id=?';
	mysql.query(sql, [id], function (err, docs){
		if(err) return cb(err);
		cb(null, mysql.checkOnly(docs) ? docs[0]: null);
	});
};

/**
 * 查找用户通过用户名
 *
 * @params
 * @return
 */
exports.findByName = function(name, cb){
	mysql_util.find(null, 's_user', [['USER_NAME', '=', name]], null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, mysql.checkOnly(docs) ? docs[0]: null);
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

	var sql_add = 'INSERT INTO s_user (id, USER_NAME, USER_PASS, AVATAR_URL, EMAIL, MOBILE, REAL_NAME, ALIPAY_ACCOUNT, APIKEY, SECKEY, AUTH_CODE_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

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
				newInfo.USER_NAME.toLowerCase(),
				md5.hex(newInfo.USER_PASS),
				newInfo.AVATAR_URL,
				newInfo.EMAIL,
				newInfo.MOBILE,
				newInfo.REAL_NAME,
				newInfo.ALIPAY_ACCOUNT,
				newInfo.APIKEY,
				newInfo.SECKEY,
				newInfo.AUTH_CODE_ID,
				new Date(),
				newInfo.STATUS || 1
			];
			mysql.query(sql_add, postData, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		});
	};

	var sql_edit = 'UPDATE s_user set EMAIL=?, MOBILE=?, REAL_NAME=?, ALIPAY_ACCOUNT=?, STATUS=? WHERE id=?';

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
				newInfo.EMAIL,
				newInfo.MOBILE,
				newInfo.REAL_NAME,
				newInfo.ALIPAY_ACCOUNT,
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