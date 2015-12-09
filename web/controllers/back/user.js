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
exports.registerUI = function(req, res, next){
	res.render('back/user/Register', {
		conf: conf,
		title: '用户注册 | '+ conf.corp.name,
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
	biz.authcode.checkUsed(data.AUTH_CODE_ID, function (err, status){
		if(err) return next(err);
		if(!!status){
			result.msg = ['认证码不存在或已经使用', 'AUTH_CODE_ID'];
			return res.send(result);
		}
		result.data = data;
		res.send(result);
	});

	// // TODO
	// biz.user.register(data, function (err, msg, doc){
	// 	if(err) return next(err);
	// 	if(!!msg){
	// 		result.msg = msg;
	// 		return res.send(result);
	// 	}
	// 	// TODO
	// 	switch(doc.ROLE_ID){
	// 		case '566512760fd5504c45483a93': // 超级管理员
	// 		case '566512b49012fb044691ace4': // 管理员
	// 			break;
	// 		default:
	// 			result.msg = ['无权登陆', 'USER_NAME'];
	// 			return res.send(result);
	// 	}
	// 	// session
	// 	req.session.lv = 1;
	// 	req.session.userId = doc.id;
	// 	req.session.roleId = doc.ROLE_ID;
	// 	req.session.user = doc;
	// 	// TODO
	// 	result.success = true;
	// 	res.send(result);
	// });
};