/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	express = util.express;

var front = {
	site: require('../controllers/front/site')
};
var back = {};
var manage = {
	authcode: require('../controllers/manage/authcode'),
	task: require('../controllers/manage/task'),
	project: require('../controllers/manage/project'),
	role: require('../controllers/manage/role'),
	site: require('../controllers/manage/site'),
	user: require('../controllers/manage/user')
};

/**
 *
 * @param
 * @return
 */
module.exports = function(app){
	proc_manage(app);
	proc_back(app);
	proc_front(app);
};

/**
 *
 * @param
 * @return
 */
function proc_front(app){
	app.get('/api$', valiGetData, front.site.signature_validate, front.site.api);
}

/**
 *
 * @param
 * @return
 */
function proc_back(app){
	// TODO
}

/**
 *
 * @param
 * @return
 */
function proc_manage(app){
	// 认证码
	app.get('/manage/authcode/', manage.user.login_validate, manage.authcode.indexUI);
	// 任务管理
	app.get('/manage/task/add', manage.user.login_validate, manage.task.addUI);
	app.get('/manage/task/', manage.user.login_validate, manage.task.indexUI);
	// 项目管理
	app.get('/manage/project/', manage.user.login_validate, manage.project.indexUI);
	// 角色管理
	app.get('/manage/role/', manage.user.login_validate, manage.role.indexUI);
	// 用户相关
	app.get('/manage/user/logout$', manage.user.logoutUI);
	app.get('/manage/user/login$', manage.user.loginUI);
	app.post('/manage/user/login$', express.valiPostData, manage.user.login);
	app.get('/manage/user/changePwd$', manage.user.login_validate, manage.user.changePwdUI);
	app.get('/manage/user/add', manage.user.login_validate, manage.user.addUI);

	// 用户管理
	app.get('/manage/user/', manage.user.login_validate, manage.user.indexUI);

	// 管理框架
	app.get('/manage/welcome', manage.user.login_validate, manage.site.welcomeUI);
	app.get('/manage/', manage.user.login_validate, manage.site.indexUI);
}

var str1 = '参数异常';

/**
 *
 * @param
 * @return
 */
function valiGetData(req, res, next){
	var result = { success: false },
		data = req.query.data;
	if(!data){
		result.msg = str1;
		return res.send(result);
	}
	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		result.msg = str1;
		res.send(result);
	}catch(ex){
		result.msg = ex.message;
		res.send(result);
	}
};