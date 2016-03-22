/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');
var EventProxy = require('eventproxy');

var conf = require('../../settings');

var biz = {
	task: require('../../../biz/task'),
	tasktake: require('../../../biz/tasktake'),
	user: require('../../../biz/user')
};

/**
 *
 * @params
 * @return
 */
exports.info = function(req, res, next){
	var data = req._data;

	biz.user.getById(req.session.userId, function (err, doc){
		if(err) return next(err);
		var result = { success: false };
		// TODO
		if(!doc){
			result.msg = ['操作失败'];
			return res.send(result);
		}
		// TODO
		doc.EMAIL = data.EMAIL;
		doc.REAL_NAME = data.REAL_NAME;
		doc.MOBILE = data.MOBILE;
		doc.ALIPAY_ACCOUNT = data.ALIPAY_ACCOUNT;
		doc.WEIXIN = data.WEIXIN;

		// TODO
		biz.user.editInfo(doc, function (err, msg, status){
			if(err) return next(err);

			if(msg){
				result.msg = msg;
				return res.send(result);
			}

			result.success = true;
			res.send(result);
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.infoUI = function(req, res, next){
	biz.user.getById(req.session.userId, function (err, doc){
		if(err) return next(err);
		// TODO
		res.render('i/1.0.2/info', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				user: doc
			}
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.register = function(req, res, next){
	var result = { success: false };
	var data = req._data;

	var regex = /^1\d{10}$/;
	if(!regex.test(data.USER_NAME)){
		result.msg = ['请输入正确的手机号'];
		return res.send(result);
	}

	data.INVITE_USER_ID = util.isEmpty(data.INVITE_USER_ID);
	if(!data.INVITE_USER_ID){
		result.msg = ['邀请码不能为空'];
		return res.send(result);
	}

	data.USER_PASS = util.isEmpty(data.USER_PASS);
	if(!data.USER_PASS){
		result.msg = ['密码不能为空'];
		return res.send(result);
	}

	// TODO
	var ep = EventProxy.create('findByName', 'getById', function (findByName, getById){
		data.MOBILE = data.USER_NAME;
		// CREATE
		biz.user.saveNew(data, function (err, msg, status){
			if(err) return next(err);

			if(msg){
				result.msg = msg;
				return res.send(result);
			}

			result.success = true;
			res.send(result);
		});
	});

	ep.fail(function (err, msg){
		if(err) return next(err);
		result.msg = msg;
		res.send(result);
	});

	biz.user.findByName(data.USER_NAME, function (err, doc){
		if(err) return ep.emit('error', err);
		// TODO
		if(doc) return ep.emit('error', null, ['该手机号已经注册过']);
		ep.emit('findByName', null);
	});

	biz.user.getById(data.INVITE_USER_ID, function (err, doc){
		if(err) return ep.emit('error', err);
		// TODO
		if(!doc) return ep.emit('error', null, ['请输入正确的邀请码']);
		ep.emit('getById', null);
	});
};

/**
 *
 * @params
 * @return
 */
exports.registerUI = function(req, res, next){
	res.render('i/1.0.2/register', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.inviteUI = function(req, res, next){
	biz.user.findByUser(null, { INVITE_USER_ID: req.session.userId }, function (err, docs){
		if(err) return next(err);
		// TODO
		res.render('i/1.0.2/invite', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				user: req.session.user,
				users: docs
			}
		});
	});
};

(function (exports){
	function render(task_id, tasks, tasktakes, res){
		res.render('i/1.0.2/task', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				task_id: task_id,
				tasktakes: tasktakes,
				tasks: tasks
			}
		});
	}

	/**
	 *
	 * @params
	 * @return
	 */
	exports.taskUI = function(req, res, next){
		biz.task.findByTask(null, { CREATE_USER_ID: req.session.userId }, function (err, docs){
			if(err) return next(err);
			// TODO
			var query = req.query;
			// 任务ID
			var task_id = query.id;

			if(!task_id){
				if(docs && (0 < docs.length)){
					var doc = docs[0];
					task_id = doc.id;
				}
			}

			if(!task_id) return render(task_id, docs, null, res);

			var tasks = docs;
			// TODO
			biz.tasktake.findByTaskId(task_id, function (err, docs){
				if(err) return next(err);
				// TODO
				render(task_id, tasks, docs, res);
			});
		});
	};
})(exports);

/**
 *
 * @params
 * @return
 */
exports.resetPwd = function(req, res, next){
	var data = req._data;
	// TODO
	biz.user.resetPwd(data, function (err, msg, status){
		if(err) return next(err);
		var result = { success: false };

		if(msg){
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
exports.changePwd = function(req, res, next){
	var result = { success: false };
	var data = req._data;

	data.id = req.session.userId;

	// TODO
	biz.user.changePwd(data, function (err, msg, doc){
		if(err) return next(err);
		var result = { success: false };

		if(msg){
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
exports.changePwdUI = function(req, res, next){
	res.render('i/1.0.2/changePwd', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.loginUI = function(req, res, next){
	res.render('i/1.0.2/login', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs'
	});
};

/**
 *
 * @params
 * @return
 */
exports.login = function(req, res, next){
	var result = { success: false };
	var data = req._data;

	data.USER_NAME = util.isEmpty(data.USER_NAME);
	if(!data.USER_NAME){
		result.msg = ['用户名或密码不能为空'];
		return res.send(result);
	}

	biz.user.login(data, function (err, msg, doc){
		if(err) return next(err);

		if(msg){
			result.msg = msg;
			return res.send(result);
		}

		// session
		req.session.lv = 2;
		req.session.userId = doc.id;
		req.session.user = doc;

		result.success = true;
		res.send(result);
	});
};

/**
 * 用户会话验证
 * 408 Request Timeout (Session)
 *
 * @params
 * @return
 */
exports.login_validate = function(req, res, next){
	if(2 === req.session.lv) return next();
	if(req.xhr) return res.send({ success: false, status: 408 });
	res.redirect(conf.html.virtualPath +'i/login?refererUrl='+ req.url);
};

/**
 * 用户退出
 *
 * @params
 * @return
 */
exports.logoutUI = function(req, res, next){
	req.session.destroy();
	res.redirect(conf.html.virtualPath +'i/');
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	// TODO
	biz.task.findByTask(null, { CREATE_USER_ID: req.session.userId }, function (err, docs){
		if(err) return next(err);

		var data = {
			showTask: (docs && (0 < docs.length)),
			user: req.session.user
		};

		// TODO
		res.render('i/1.0.2/index', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: data
		});
	});
};

/**
 *
 * @params
 * @return
 */
exports.welcomeUI = function(req, res, next){
	var query = req.query;
	var create_time = query.create_time || util.format(new Date(), 'YY-MM');
	// TODO
	biz.tasktake.findByUserId(req.session.userId, create_time, function (err, docs){
		if(err) return next(err);
		// TODO
		res.render('i/1.0.2/welcome', {
			conf: conf,
			description: '',
			keywords: ',html5,nodejs',
			data: {
				tasktakes: docs,
				current_time: util.format(new Date(), 'YY年MM月dd日'),
				create_time: create_time
			}
		});
	});
};