/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../settings');

var biz = {
	authcode: require('../../../biz/authcode'),
	user: require('../../../biz/user')
};

/**
 *
 * @params
 * @return
 */
exports.login = function(req, res, next){
	var result = { success: false },
		data = req._data;
	// TODO
	biz.user.login(data, function (err, msg, doc){
		if(err) return next(err);
		if(!!msg){
			result.msg = msg;
			return res.send(result);
		}
		if('566512b49012fb044691ace6' !== doc.ROLE_ID){
			result.msg = ['无权登陆'];
			return res.send(result);
		}
		// session
		req.session.lv = 3;
		req.session.userId = doc.id;
		req.session.roleId = doc.ROLE_ID;
		req.session.user = doc;
		// TODO
		result.success = true;
		res.send(result);
	});
};

/**
 * 登陆
 *
 * @params
 * @return
 */
exports.loginUI = function(req, res, next){
	res.render('back/user/Login', {
		conf: conf,
		title: '用户登陆 | '+ conf.corp.name,
		description: '',
		keywords: ',html5'
	});
};

/**
 *
 * @params
 * @return
 */
exports.registerUI = function(req, res, next){
	res.render('back/user/Register', {
		conf: conf,
		title: '新用户注册 | '+ conf.corp.name,
		description: '',
		keywords: ',html5'
	});
};

/**
 *
 * @params
 * @return
 */
exports.register = function(req, res, next){
	var result = { success: false },
		data = req._data;
	// TODO
	biz.user.register(data, function (err, msg, doc){
		if(err) return next(err);
		if(!!msg){
			result.msg = msg;
			return res.send(result);
		}
		// TODO
		result.success = true;
		res.send(result);
	});
};

/**
 * 用户会话验证
 *
 * @params
 * @return
 */
exports.login_validate = function(req, res, next){
	if(3 === req.session.lv) return next();
	if(req.xhr) return res.send({ success: false, msg: '无权访问' });
	res.redirect('/user/login?refererUrl='+ escape(req.url));
};

/**
 *
 * @params
 * @return
 */
exports.changePwdUI = function(req, res, next){
	// TODO
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	res.render('back/user/Index', {
		conf: conf,
		title: '我的 | '+ conf.corp.name,
		description: '',
		keywords: ',html5',
		loginState: 3 === req.session.lv
	});
};

/**
 *
 * @params
 * @return
 */
exports.task_indexUI = function(req, res, next){
	// TODO
};

/**
 *
 * @params
 * @return
 */
exports.logoutUI = function(req, res, next){
	req.session.destroy();
	res.redirect('/user/login');
};