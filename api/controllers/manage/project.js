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
	project_type: require('../../../biz/project_type'),
	project: require('../../../biz/project')
};

/**
 *
 * @params
 * @return
 */
exports.edit = function(req, res, next){
	var data = req._data;
	// TODO
	biz.project.editInfo(data, function (err, msg, status){
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
	biz.project.saveNew(data, function (err, msg, status){
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
	biz.project_type.findByProjectType(function (err, docs){
		if(err) return next(err);
		// TODO
		res.render('manage/project/1.0.1/add', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				project_types: docs
			}
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.project.findByProject(function (err, docs){
		if(err) return next(err);
		// TODO
		res.render('manage/project/1.0.1/index', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				projects: docs
			}
		});
	});
};