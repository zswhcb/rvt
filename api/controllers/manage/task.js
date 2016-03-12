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
	user: require('../../../biz/user'),
	project: require('../../../biz/project'),
	task: require('../../../biz/task')
};

/**
 *
 * @params
 * @return
 */
exports.remove = function(req, res, next){
	var data = req._data;
	// TODO
	biz.task.remove(data, function (err, msg, status){
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
exports.edit = function(req, res, next){
	var data = req._data;
	// TODO
	biz.task.editInfo(data, function (err, msg, status){
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
	biz.task.saveNew(data, function (err, msg, status){
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
	biz.task.getById(query.id, function (err, doc){
		if(err) return next(err);
		// TODO
		if(!doc) return res.send('Not Found.');
		// TODO
		res.render('manage/task/1.0.1/edit', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				task: doc
			}
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.addUI = function(req, res, next){
	// TODO
	var ep = EventProxy.create('users', 'projects', function (users, projects){
		res.render('manage/task/1.0.1/add', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				task: {
					TASK_SUM: 20,
					TALK_TIME_MIN: 60,
					TALK_TIMEOUT: 3600
				},
				projects: projects,
				users: users
			}
		});
	});

	ep.fail(function (err, msg){
		next(err);
	});

	biz.user.findByUser(null, { ROLE_ID: '819b6eca21a74556b96375964f97edaf' }, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('users', docs);
	});

	biz.project.findByProject(null, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('projects', docs);
	});
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	var query = req.query;

	// TODO
	var ep = EventProxy.create('tasks', 'projects', function (tasks, projects){
		res.render('manage/task/1.0.1/index', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				project_id: query.project_id,
				projects: projects,
				tasks: tasks
			}
		});
	});

	ep.fail(function (err, msg){
		next(err);
	});

	biz.task.findByTask({ PROJECT_ID: query.project_id }, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('tasks', docs);
	});

	biz.project.findByProject(null, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('projects', docs);
	});
};

/**
 *
 * @params
 * @return
 */
exports.monitorUI = function(req, res, next){
	var query = req.query;

	// TODO
	var ep = EventProxy.create('tasks', 'projects', function (tasks, projects){
		res.render('manage/task/1.0.1/monitor', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				project_id: query.project_id,
				projects: projects,
				tasks: tasks
			}
		});
	});

	ep.fail(function (err, msg){
		next(err);
	});

	biz.task.findByTask({ PROJECT_ID: query.project_id }, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('tasks', docs);
	});

	biz.project.findByProject(null, function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('projects', docs);
	});
};