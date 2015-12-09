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