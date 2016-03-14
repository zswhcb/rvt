/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');
var EventProxy = require('eventproxy');

var conf = require('../../settings');

var biz = {
	user: require('../../../biz/user')
};

/**
 *
 * @params
 * @return
 */
exports.infoUI = function(req, res, next){
	res.render('i/user/1.0.1/info', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.registerUI = function(req, res, next){
	res.render('i/user/1.0.1/register', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.inviteUI = function(req, res, next){
	res.render('i/user/1.0.1/invite', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.taskUI = function(req, res, next){
	res.render('i/user/1.0.1/task', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.resetPwd = function(req, res, next){
	var data = req._data;
	// TODO
	biz.user.resetPwd(data, function (err, msg, status){
		if(err) return next(err);
		var result = { success: false };

		if(msg){
			result.msg = msg;
			return res.send(result);
		}

		result.success = true;
		res.send(result);
	});
};

/**
 *
 * @params
 * @return
 */
exports.changePwd = function(req, res, next){
	var result = { success: false };
	var data = req._data;

	data.id = req.session.userId;

	// TODO
	biz.user.changePwd(data, function (err, msg, doc){
		if(err) return next(err);
		var result = { success: false };

		if(msg){
			result.msg = msg;
			return res.send(result);
		}

		result.success = true;
		res.send(result);
	});
};

/**
 *
 * @params
 * @return
 */
exports.changePwdUI = function(req, res, next){
	res.render('i/user/1.0.1/changePwd', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.loginUI = function(req, res, next){
	res.render('i/user/1.0.1/login', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs',
		data: {}
	});
};

/**
 *
 * @params
 * @return
 */
exports.login = function(req, res, next){
	var data = req._data;

	biz.user.login(data, function (err, msg, doc){
		if(err) return next(err);
		var result = { success: false };

		if(msg){
			result.msg = msg;
			return res.send(result);
		}

		// session
		req.session.lv = 2;
		req.session.userId = doc.id;
		req.session.user = doc;

		result.success = true;
		res.send(result);
	});
};

/**
 * 用户会话验证
 * 408 Request Timeout (Session)
 *
 * @params
 * @return
 */
exports.login_validate = function(req, res, next){
	if(2 === req.session.lv) return next();
	if(req.xhr) return res.send({ success: false, status: 408 });
	res.redirect(conf.html.virtualPath +'i/login');
};

/**
 * 用户退出
 *
 * @params
 * @return
 */
exports.logoutUI = function(req, res, next){
	req.session.destroy();
	res.redirect(conf.html.virtualPath +'i/');
};