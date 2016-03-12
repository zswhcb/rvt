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
exports.edit = function(req, res, next){
	var data = req._data;
	// TODO
	biz.user.editInfo(data, function (err, msg, status){
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
exports.add = function(req, res, next){
	var data = req._data;
	// TODO
	biz.user.saveNew(data, function (err, msg, status){
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
exports.editUI = function(req, res, next){
	var query = req.query;

	// TODO
	var ep = EventProxy.create('project_types', 'project', function (project_types, project){
		res.render('manage/project/1.0.1/edit', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				project: project,
				project_types: project_types
			}
		});
	});

	ep.fail(function (err, msg){
		if(err) return next(err);
		res.send(msg);
	});

	biz.project.getById(query.id, function (err, doc){
		if(err) return ep.emit('error', err);
		if(!doc) return ep.emit('error', null, 'Not Found.');
		ep.emit('project', doc);
	});

	biz.project_type.findByProjectType(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('project_types', docs);
	});
};

/**
 *
 * @params
 * @return
 */
exports.addUI = function(req, res, next){
	res.render('manage/user/1.0.1/add', {
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
exports.indexUI = function(req, res, next){
	biz.user.findByUser(function (err, docs){
		if(err) return next(err);
		// TODO
		res.render('manage/user/1.0.1/index', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				users: docs
			}
		});
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

	return res.send(result);
};

/**
 *
 * @params
 * @return
 */
exports.changePwdUI = function(req, res, next){
	res.render('manage/user/1.0.1/changePwd', {
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
	var data = req._data;

	biz.user.login(data, function (err, msg, doc){
		if(err) return next(err);
		var result = { success: false };

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
	res.redirect(conf.html.virtualPath +'manage/user/login');
};

/**
 * 用户退出
 *
 * @params
 * @return
 */
exports.logoutUI = function(req, res, next){
	req.session.destroy();
	res.redirect(conf.html.virtualPath +'manage/');
};