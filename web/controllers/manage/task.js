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
	project: require('../../../biz/project')
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
	biz.task.saveNew(data, function (err, msg, status){
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
exports.indexUI = function(req, res, next){
	biz.project.findAll(function (err, docs){
		// TODO
		res.render('manage/task/Index', {
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

/**
 *
 * @params
 * @return
 */
exports.addUI = function(req, res, next){
	res.render('manage/task/Add', {
		conf: conf,
		title: '新增 | '+ req.query.name +' | '+ conf.corp.name,
		description: '',
		keywords: ',html5',
		data: {
			task: {
				PROJECT_ID: req.query.project_id
			}
		}
	});
};

(function (exports){
	/**
	 *
	 * @params
	 * @return
	 */
	exports.getTasks = function(req, res, next){
		var result = { success: false };
		var project_id = req.params.project_id;

		biz.task.findByProjectId(project_id, function (err, docs){
			if(err) return next(err);
			// TODO
			getTemplate(function (err, template){
				if(err){
					result.msg = err;
					return res.send(result);
				}

				var html = velocity.render(template, {
					conf: conf,
					data: { tasks: docs }
				}, macros);

				result.success = true;
				result.data = html;
				res.send(result);
			});
		});
	};

	var temp = null;
	/**
	 * 获取模板
	 *
	 * @params
	 * @return
	 */
	 function getTemplate(cb){
		// if(temp) return cb(null, temp);
		fs.readFile(path.join(cwd, 'views', 'manage', 'task', '_pagelet', 'Side.List.Task.html'), 'utf8', function (err, template){
			if(err) return cb(err);
			temp = template;
			cb(null, template);
		});
	};
})(exports);