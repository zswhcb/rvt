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
	user: require('../../../biz/user'),
	project: require('../../../biz/project')
};

/**
 *
 * @params
 * @return
 */
exports.addUI = function(req, res, next){
	// TODO
	var ep = EventProxy.create('users', function (users){
		// TODO
		res.render('manage/project/Add', {
			conf: conf,
			title: '新增 | '+ req.query.name +' | '+ conf.corp.name,
			description: '',
			keywords: ',html5',
			data: {
				users: users
			}
		});
	});

	ep.fail(function (err){
		next(err);
	});

	biz.user.findAll(function (err, docs){
		if(err) return ep.emit('error', err);
		ep.emit('users', docs);
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