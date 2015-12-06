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
	this.findByName(logInfo.USER_NAME, function (err, doc){
		if(err) return cb(err);
		if(!doc) return cb(null, ['用户名或密码输入错误', 'USER_NAME']);
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