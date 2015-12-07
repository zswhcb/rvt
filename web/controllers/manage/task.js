/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../settings');

var biz = {
	project: require('../../../biz/project')
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
		}
	});
};