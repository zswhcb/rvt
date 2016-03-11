/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
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
	res.render('manage/user/1.0.1/login', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs',
		data: {
			user: {
				USER_NAME: 'bushuo',
				USER_PASS: '1'
			}
		}
	});
};

/**
 *
 * @params
 * @return
 */
exports.login = function(req, res, next){
	var result = { success: false };
	var data = req._data;

	biz.user.login(data, function (err, msg, doc){
		if(err) return next(err);
		if(msg){
			result.msg = msg;
			return res.send(result);
		}

		// session
		req.session.lv = 1;
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
	if(1 === req.session.lv) return next();
	if(req.xhr) return res.send({ success: false, status: 408 });
	res.redirect('/rvt/manage/user/login');
};

/**
 * 用户退出
 *
 * @params
 * @return
 */
exports.logoutUI = function(req, res, next){
	req.session.destroy();
	res.redirect('/rvt/manage/');
};