/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../settings'),
	EventProxy = require('eventproxy');

var biz = {
	project_type: require('../../../biz/project_type'),
	user: require('../../../biz/user'),
	project: require('../../../biz/project')
};

/**
 *
 * @params
 * @return
 */
exports.edit = function(req, res, next){
	var result = { success: false },
		data = req._data;
	// TODO
	biz.project.editInfo(data, function (err, msg, status){
		if(err) return next(err);
		// TODO
		if(!!msg){
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
	var result = { success: false },
		data = req._data;
	// TODO
	data.CREATE_USER_ID = req.session.userId;
	// TODO
	biz.project.saveNew(data, function (err, msg, status){
		if(err) return next(err);
		// TODO
		if(!!msg){
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
	var project_id = req.params.project_id;
	// TODO
	var ep = EventProxy.create('project_types', 'project', function (project_types, project){
		// TODO
		res.render('manage/project/Edit', {
			conf: conf,
			title: '编辑 | '+ req.query.name +' | '+ conf.corp.name,
			description: '',
			keywords: ',html5',
			data: {
				project: project,
				project_types: project_types
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	biz.project_type.findAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('project_types', docs);
	});

	biz.project.getById(project_id, function (err, doc){
		if(err) return ep.emit('error', err);
		ep.emit('project', doc);
	});
};

/**
 *
 * @params
 * @return
 */
exports.addUI = function(req, res, next){
	// TODO
	var ep = EventProxy.create('users', 'project_types', function (users, project_types){
		// TODO
		res.render('manage/project/Add', {
			conf: conf,
			title: '新增 | '+ req.query.name +' | '+ conf.corp.name,
			description: '',
			keywords: ',html5',
			data: {
				project_types: project_types,
				users: users
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	biz.user.findByRoleId('566512b49012fb044691ace5', function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('users', docs);
	});

	biz.project_type.findAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('project_types', docs);
	});
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.project.findAll(function (err, docs){
		// TODO
		res.render('manage/project/Index', {
			conf: conf,
			title: req.query.name +' | '+ conf.corp.name,
			description: '',
			keywords: ',html5',
			data: {
				projects: docs
			}
		});
	});
};