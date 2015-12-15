/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	EventProxy = require('eventproxy'),
	path = require('path'),
	fs = require('fs'),
	velocity = require('velocityjs'),
	cwd = process.cwd();

var conf = require('../../settings'),
	macros = require('../../lib/macro');

var biz = {
	task: require('../../../biz/task'),
	user: require('../../../biz/user'),
	project: require('../../../biz/project')
};

/**
 *
 * @params
 * @return
 */
exports.getProjectsByUserId = function(req, res, next){
	var result = { success: false },
		user_id = req.params.user_id;
	// TODO
	biz.project.getByUserId(user_id, function (err, docs){
		if(err) return next(err);
		result.data = docs;
		result.success = true;
		res.send(result);
	});
};

/**
 * 获取业务员子认证用户
 *
 * @params
 * @return
 */
exports.getUsersByPId = function(req, res, next){
	var result = { success: false },
		user_id = req.params.user_id;
	// TODO
	biz.user.findByPId(user_id, function (err, docs){
		if(err) return next(err);
		result.data = docs;
		result.success = true;
		res.send(result);
	});
};

/**
 * 获取任务
 *
 * @params
 * @return
 */
exports.getTasksByProjectId = function(req, res, next){
	var result = { success: false },
		project_id = req.params.project_id;
	// TODO
	biz.task.findByProjectId(project_id, function (err, docs){
		if(err) return next(err);
		// TODO
		result.data = docs;
		result.success = true;
		res.send(result);
	});
};