/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../settings');

var biz = {
	task: require('../../../biz/task')
};

/**
 *
 * @params
 * @return
 */
exports.editUI = function(req, res, next){
};

/**
 *
 * @params
 * @return
 */
exports.addUI = function(req, res, next){
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.task.findByTask(function (err, docs){
		if(err) return next(err);
		// TODO
		res.render('manage/task/1.0.1/index', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				tasks: docs
			}
		});
	});
};