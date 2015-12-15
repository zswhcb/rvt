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
	authcode: require('../../../biz/authcode'),
	user: require('../../../biz/user')
};

var exports = module.exports;

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.user.findByPId('', function (err, docs){
		// TODO
		res.render('manage/authcode/Index', {
			conf: conf,
			title: req.query.name +' | '+ conf.corp.name,
			description: '',
			keywords: ',html5',
			data: {
				users: docs
			}
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.genAuthCode = function(req, res, next){
	var result = { success: false },
		user_id = req.params.user_id;
	// TODO
	biz.authcode.genAuthCode(user_id, 10, function (err, msg, status){
		if(err) return next(err);
		// TODO
		if(!!msg){
			result.msg = msg;
			return res.send(result);
		}
		// TODO
		result.success = true;
		res.send(result);
	});
};

/**
 * 加载块儿
 *
 * @params
 * @return
 */
(function (exports){
	exports.getAuthCodesByUserId = function(req, res, next){
		var result = { success: false },
			user_id = req.params.user_id;
		// TODO
		biz.authcode.findByUserId(user_id, function (err, docs){
			if(err) return next(err);
			// TODO
			getTemplate(function (err, template){
				if(err){
					result.msg = err;
					return res.send(result);
				}
				// TODO
				var html = velocity.render(template, {
					conf: conf,
					data: { authcodes: docs }
				}, macros);
				// TODO
				result.data = html;
				result.success = true;
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
		fs.readFile(path.join(cwd, 'views', 'manage', 'authcode', '_pagelet', 'Side.List.AuthCode.html'), 'utf8', function (err, template){
			if(err) return cb(err);
			temp = template;
			cb(null, template);
		});
	};
})(exports);