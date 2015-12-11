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
var back = {
	user: require('../controllers/back/user')
};
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
	app.get('/api_test/', front.site.api_testUI);
}

/**
 *
 * @param
 * @return
 */
function proc_back(app){
	app.get('/u/changePwd$', back.user.login_validate, back.user.changePwdUI);
	app.get('/u/task/', back.user.login_validate, back.user.task_indexUI);
	app.get('/u/', back.user.login_validate, back.user.indexUI);
	// TODO
	app.post('/user/register$', express.valiPostData, back.user.register);
	app.get('/user/register$', back.user.registerUI);
	app.get('/user/login$', back.user.loginUI);
	app.get('/', back.user.loginUI);
}

/**
 *
 * @param
 * @return
 */
function proc_manage(app){
	// 认证码
	app.post('/manage/authcode/genAuthCode/:user_id', manage.user.login_validate, manage.authcode.genAuthCode);
	app.post('/manage/authcode/getAuthCodes/:user_id', manage.user.login_validate, manage.authcode.getAuthCodes);
	app.get('/manage/authcode/', manage.user.login_validate, manage.authcode.indexUI);
	// 任务监控
	app.post('/manage/task/monitor/getTaskMonitors/:task_id', manage.user.login_validate, manage.task.getTaskMonitors);
	app.get('/manage/task/monitor/', manage.user.login_validate, manage.task.monitorUI);
	// 任务管理
	app.post('/manage/task/getTasks/:project_id', manage.user.login_validate, manage.task.getTasks);
	app.post('/manage/task/del/:task_id', manage.user.login_validate, manage.task.del);
	app.post('/manage/task/add', express.valiPostData, manage.user.login_validate, manage.task.add);
	app.get('/manage/task/add/:project_id', manage.user.login_validate, manage.task.addUI);
	app.get('/manage/task/', manage.user.login_validate, manage.task.indexUI);
	// 项目管理
	app.post('/manage/project/edit', express.valiPostData, manage.user.login_validate, manage.project.edit);
	app.get('/manage/project/edit/:project_id', manage.user.login_validate, manage.project.editUI);
	app.post('/manage/project/add', express.valiPostData, manage.user.login_validate, manage.project.add);
	app.get('/manage/project/add', manage.user.login_validate, manage.project.addUI);
	app.get('/manage/project/', manage.user.login_validate, manage.project.indexUI);
	// 角色管理
	app.get('/manage/role/', manage.user.login_validate, manage.role.indexUI);
	// 用户相关
	app.get('/manage/user/logout$', manage.user.logoutUI);
	app.get('/manage/user/login$', manage.user.loginUI);
	app.post('/manage/user/login$', express.valiPostData, manage.user.login);
	app.get('/manage/user/changePwd$', manage.user.login_validate, manage.user.changePwdUI);
	// 添加 修改
	app.post('/manage/user/add', express.valiPostData, manage.user.login_validate, manage.user.add);
	app.get('/manage/user/add', manage.user.login_validate, manage.user.addUI);
	app.post('/manage/user/edit', express.valiPostData, manage.user.login_validate, manage.user.edit);
	app.get('/manage/user/edit/:user_id', manage.user.login_validate, manage.user.editUI);

	// 用户管理
	app.get('/manage/user/', manage.user.login_validate, manage.user.indexUI);

	// 管理框架
	app.get('/manage/welcome', manage.user.login_validate, manage.site.welcomeUI);
	app.get('/manage/', manage.user.login_validate, manage.site.indexUI);
}

var str1 = ['参数异常'];

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