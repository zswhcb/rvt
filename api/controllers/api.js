/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	rest = util.service.rest,
	EventProxy = require('eventproxy'),
	path = require('path'),
	fs = require('fs'),
	cwd = process.cwd();

var conf = require('../settings');

var biz = {
	task: require('../../biz/task'),
	user: require('../../biz/user')
};

var exports = module.exports;

/**
 * 签名验证
 *
 * @param
 * @return
 */
(function (exports){

	function isEmtpy(str){
		if(!str) return;
		str = str.trim();
		return '' === str ? null : str;
	}

	exports.signature_validate = function(req, res, next){
		var result = { success: false },
			data = req._data;

		var body = req.body;

		// TODO
		body.command = isEmtpy(body.command);
		if(!body.command) return res.send(result);

		// TODO
		if('login' === body.command) return next();

		body.ts = isEmtpy(body.ts);
		if(!body.ts) return res.send(result);

		body.apikey = isEmtpy(body.apikey);
		if(!body.apikey) return res.send(result);

		body.signature = isEmtpy(body.signature);
		if(!body.signature) return res.send(result);

		// TODO
		biz.user.findByApiKey(body.apikey, function (err, doc){
			if(err) return next(err);
			// TODO
			if(!doc) return res.send(result);

			// TODO
			if(1 !== doc.STATUS) return res.send(result);

			// TODO
			if(!rest.validate(data, doc.SECKEY)) return res.send(result);
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
		var result = { success: false },
			data = req._data;
		// TODO
		biz.user.login(data, function (err, msg, doc){
			if(err) return next(err);
			if(msg){
				result.msg = msg;
				return res.send(result);
			}

			/* result */
			result.data = {
				apikey: doc.APIKEY,
				seckey: doc.SECKEY,
				ver: conf.app.ver,
				ts: (new Date()).getTime()
			};
			result.success = true;
			res.send(result);
		});
	}

	function applyTask(req, res, next){
		var result = { success: false },
			data = req._data,
			user = req.flash('user')[0];
		// TODO
		biz.task.apply(user.id, function (err, msg, doc){
			if(err) return next(err);
			// TODO
			if(msg){
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
		var result = { success: false },
			data = req._data,
			user = req.flash('user')[0];
		// TODO
		biz.task.commit(user.id, data, function (err, msg, status){
			if(err) return next(err);
			// TODO
			if(msg) result.msg = msg;
			result.success = true;
			res.send(result);
		});
	}

	exports.index = function(req, res, next){
		// TODO
		switch(req.body.command){
			case 'login': login(req, res, next); break;
			case 'applyTask': applyTask(req, res, next); break;
			case 'commitTask': commitTask(req, res, next); break;
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
	res.render('test', {
		conf: conf,
		description: '',
		keywords: ',html5'
	});
};