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
exports.editUI = function(req, res, next){
	// TODO
	var ep = EventProxy.create('users', 'project_types', 'project', function (users, project_types, project){
		// TODO
		res.render('manage/project/Edit', {
			conf: conf,
			title: '编辑 | '+ req.query.name +' | '+ conf.corp.name,
			description: '',
			keywords: ',html5',
			data: {
				project: project,
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

	biz.project.getById(req.query.id, function (err, doc){
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
				roles: docs
			}
		});
	});
};