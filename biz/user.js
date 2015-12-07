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
var sql_1 = 'SELECT b.id ROLE_ID, b.ROLE_NAME, a.* FROM s_user a, s_role b, s_user_role c WHERE a.STATUS=1 AND b.STATUS=1 AND a.id=c.USER_ID AND b.id=c.ROLE_ID';

/**
 *
 * @params
 * @return
 */
exports.findAll = function(cb){
	mysql_util.find(null, 's_user', null, [['CREATE_TIME', 'DESC']], null, function (err, docs){
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
	var sql = sql_1 +' AND a.USER_NAME=?';
	// TODO
	mysql.query(sql, [logInfo.USER_NAME], function (err, docs){
		if(err) return cb(err);
		// TODO
		if(!mysql.checkOnly(docs)) return cb(null, ['用户名或密码输入错误', 'USER_NAME']);
		// TODO
		var doc = docs[0];
		// TODO
		if(1 !== doc.STATUS) return cb(null, ['已被禁用', 'USER_NAME']);
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
	mysql_util.find(null, 's_user', [['id', '=', id]], null, null, function (err, docs){
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