/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../settings');

var biz = {
	user: require('../../../biz/user')
};

/**
 *
 * @params
 * @return
 */
exports.loginUI = function(req, res, next){
	res.render('manage/user/Login', {
		conf: conf,
		title: '后台登陆 | '+ conf.corp.name,
		description: '',
		keywords: ',html5'
	});
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
		// TODO
		switch(doc.ROLE_ID){
			case '566512760fd5504c45483a93': // 超级管理员
			case '566512b49012fb044691ace4': // 管理员
				break;
			default:
				result.msg = ['无权登陆', 'USER_NAME'];
				return res.send(result);
		}
		// session
		req.session.lv = 1;
		req.session.userId = doc.id;
		req.session.roleId = doc.ROLE_ID;
		req.session.user = doc;
		// TODO
		result.success = true;
		res.send(result);
	});
};