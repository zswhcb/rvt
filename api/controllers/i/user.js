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
	tasktake: require('../../../biz/tasktake'),
	user: require('../../../biz/user')
};

/**
 *
 * @params
 * @return
 */
exports.infoUI = function(req, res, next){
	res.render('i/1.0.2/info', {
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
exports.register = function(req, res, next){
};

/**
 *
 * @params
 * @return
 */
exports.registerUI = function(req, res, next){
	res.render('i/1.0.2/register', {
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
	res.render('i/1.0.2/invite', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs',
		data: {
			user: req.session.user
		}
	});
};

/**
 *
 * @params
 * @return
 */
exports.taskUI = function(req, res, next){
	res.render('i/1.0.2/task', {
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
	res.render('i/1.0.2/changePwd', {
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
	res.render('i/1.0.2/login', {
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

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	res.render('i/1.0.2/index', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs',
		data: {
			user: req.session.user
		}
	});
};

/**
 *
 * @params
 * @return
 */
exports.welcomeUI = function(req, res, next){
	var query = req.query;
	var create_time = query.create_time || util.format(new Date(), 'YY-MM');
	// TODO
	biz.tasktake.findByUserId(req.session.userId, create_time, function (err, docs){
		if(err) return next(err);
		// TODO
		res.render('i/1.0.2/welcome', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				tasktakes: docs,
				current_time: util.format(new Date(), 'YY年MM月dd日'),
				create_time: create_time
			}
		});
	});
};