/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	rest = util.service.rest,
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
(function (exports){

	function query_command(query){
		query.command = query.command || '';
		query.command = query.command.trim();
		return '' === query.command;
	}

	function query_ts(query){
		query.ts = query.ts || '';
		query.ts = query.ts.trim();
		return '' === query.ts;
	}

	function query_apikey(query){
		query.apikey = query.apikey || '';
		query.apikey = query.apikey.trim();
		return '' === query.apikey;
	}

	function query_signature(query){
		query.signature = query.signature || '';
		query.signature = query.signature.trim();
		return '' === query.signature;
	}

	exports.signature_validate = function(req, res, next){
		var result = { success: false },
			query = req.query;
		// TODO
		if(query_command(query)) return res.send(result);
		// TODO
		if('login' === query.command) return next();
		// TODO
		if(query_ts(query)) return res.send(result);
		// TODO
		if(query_apikey(query)) return res.send(result);
		// TODO
		if(query_signature(query)) return res.send(result);
		// TODO
		biz.user.findByApiKey(query.apikey, function (err, doc){
			if(err) return next(err);
			// TODO
			if(!doc) return res.send(result);
			// TODO
			if(!rest.validate(query, doc.SECKEY)) return res.send(result);
			// TODO
			req.flash('user', doc);
			next();
		});
	};
})(exports);

/**
 * api
 *
 * @param
 * @return
 */
(function (exports){

	function login(req, res, next){
		var result = { success: false, ver: conf.app.ver },
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
			result.data = { APIKEY: doc.APIKEY, SECKEY: doc.SECKEY, TS: new Date().getTime() };
			result.success = true;
			res.send(result);
		});
	}

	function getCurrentTasks(req, res, next){
		var result = { success: false, ver: conf.app.ver },
			user = req.flash('user')[0];
		// TODO
		biz.task.getCurrentTasks(function (err, docs){
			if(err) return next(err);
			/* result */
			result.data = docs;
			result.success = true;
			res.send(result);
		});
	}

	function applyTask(req, res, next){
		var result = { success: false, ver: conf.app.ver },
			data = req._data,
			user = req.flash('user')[0];
		// TODO
		biz.task.apply(user.id, data.TASK_ID, function (err, msg, doc){
			if(err) return next(err);
			// TODO
			if(!!msg){
				result.msg = msg;
				return res.send(result);
			}
			// TODO
			result.data = doc;
			result.success = true;
			res.send(result);
		});
	}

	function commitTask(req, res, next){
		var result = { success: false, ver: conf.app.ver },
			data = req._data,
			user = req.flash('user')[0];
		// TODO
		biz.task.commit(user.id, data, function (err, msg, status){
			if(err) return next(err);
			// TODO
			if(!!msg) result.msg = msg;
			result.success = true;
			res.send(result);
		});
	}

	exports.index = function(req, res, next){
		var query = req.query;
		// TODO
		switch(query.command){
			case 'login': login(req, res, next); break;
			case 'getCurrentTasks': getCurrentTasks(req, res, next); break;
			case 'applyTask': applyTask(req, res, next); break;
			case 'commitTask': commitTask(req, res, next); break;
			default: res.send({ success: false, ver: conf.app.ver }); break;
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