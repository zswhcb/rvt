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
	cwd = process.cwd();

var conf = require('../../settings'),
	macros = require('../../lib/macro');

var biz = {
	task: require('../../../biz/task'),
	user: require('../../../biz/user')
};

var exports = module.exports;

/**
 * 签名验证
 *
 * @param
 * @return
 */
exports.signature_validate = function(req, res, next){
	var result = { success: false },
		query = req.query;
	// TODO
	query.command = query.command || '';
	query.command = query.command.trim();
	// TODO
	if('' === query.command) return res.send(result);
	if('login' === query.command) return next();
	next();
};

(function (exports){
	/**
	 *
	 * @param
	 * @return
	 */
	function login(req, res, next){
		var result = { success: false },
			data = req._data;
		// TODO
		biz.user.login(data, function (err, msg, doc){
			if(err) return next(err);
			if(!!msg){
				result.msg = msg;
				return res.send(result);
			}
			if('566512b49012fb044691ace6' !== doc.ROLE_ID){
				result.msg = ['无权登陆'];
				return res.send(result);
			}
			/* result */
			result.data = { apikey: doc.APIKEY, seckey: doc.SECKEY };
			result.success = true;
			res.send(result);
		});
	}

	/**
	 *
	 * @param
	 * @return
	 */
	function getCurrentTasks(req, res, next){
		var result = { success: false },
			data = req._data;
		// TODO
		biz.task.getCurrentTasks(function (err, docs){
			if(err) return next(err);
			/* result */
			result.data = docs;
			result.success = true;
			res.send(result);
		});
	}

	/**
	 * api
	 *
	 * @param
	 * @return
	 */
	exports.index = function(req, res, next){
		var query = req.query;
		// TODO
		switch(query.command){
			case 'login': login(req, res, next); break;
			case 'getCurrentTasks': getCurrentTasks(req, res, next); break;
			default: res.send({ success: false }); break;
		}
	};
})(exports);

/**
 *
 * @param
 * @return
 */
exports.testUI = function(req, res, next){
	res.render('front/Api_testUI', {
		conf: conf,
		title: 'API测试 | '+ conf.corp.name,
		description: '',
		keywords: ',html5'
	});
};