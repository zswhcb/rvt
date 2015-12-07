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
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	res.render('manage/Index', {
		conf: conf,
		title: '后台管理 | '+ conf.corp.name,
		description: '',
		keywords: ',html5'
	});
};

/**
 *
 * @params
 * @return
 */
exports.welcomeUI = function(req, res, next){
	res.render('manage/Welcome', {
		conf: conf,
		title: '欢迎页 | 后台管理 | '+ conf.corp.name,
		description: '',
		keywords: ',html5'
	});
};