/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	express = util.express;

var front = {
	api: require('../controllers/front/api')
};
var back = {
	user: require('../controllers/back/user')
};
var manage = {
	json: require('../controllers/manage/json'),
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
	app.get('/api$', valiGetData, front.api.signature_validate, front.api.index);
	app.get('/api_test/', front.api.testUI);
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
	proc_manage_json(app);

	proc_manage_task_monitor(app);
	proc_manage_task(app);

	proc_manage_project(app);

	proc_manage_authcode(app);

	proc_manage_role(app);
	// TODO
	proc_manage_user(app);
	// TODO
	proc_manage_login(app);
	// TODO
	proc_manage_site(app);
}

/**
 * 处理json数据
 */
function proc_manage_json(app){
	app.post('/manage/json/getProjectsByUserId/:user_id', manage.user.login_validate, manage.json.getProjectsByUserId);
	app.post('/manage/json/getUsersByPId/:user_id', manage.user.login_validate, manage.json.getUsersByPId);
	app.post('/manage/json/getTasksByProjectId/:project_id', manage.user.login_validate, manage.json.getTasksByProjectId);
}

/**
 * 任务监控
 */
function proc_manage_task_monitor(app){
	app.post('/manage/task/monitor/html/getTaskMonitorsByTaskId/:task_id', manage.user.login_validate, manage.task.getTaskMonitorsByTaskId);
	app.get('/manage/task/monitor/', manage.user.login_validate, manage.task.monitorUI);
}

/**
 * 任务管理
 */
function proc_manage_task(app){
	app.post('/manage/task/html/getTasksByProjectId/:project_id', manage.user.login_validate, manage.task.getTasksByProjectId);
	// 添加 修改 删除
	app.post('/manage/task/del/:task_id', manage.user.login_validate, manage.task.del);
	app.post('/manage/task/edit', express.valiPostData, manage.user.login_validate, manage.task.edit);
	app.post('/manage/task/add', express.valiPostData, manage.user.login_validate, manage.task.add);
	app.get('/manage/task/edit/:task_id', manage.user.login_validate, manage.task.editUI);
	app.get('/manage/task/add/:project_id', manage.user.login_validate, manage.task.addUI);
	// TODO
	app.get('/manage/task/', manage.user.login_validate, manage.task.indexUI);
}

/**
 * 项目管理
 */
function proc_manage_project(app){
	// 添加 修改
	app.post('/manage/project/edit', express.valiPostData, manage.user.login_validate, manage.project.edit);
	app.post('/manage/project/add', express.valiPostData, manage.user.login_validate, manage.project.add);
	app.get('/manage/project/edit/:project_id', manage.user.login_validate, manage.project.editUI);
	app.get('/manage/project/add', manage.user.login_validate, manage.project.addUI);
	// TODO
	app.get('/manage/project/', manage.user.login_validate, manage.project.indexUI);
}

/**
 * 认证码
 */
function proc_manage_authcode(app){
	app.post('/manage/authcode/genAuthCode/:user_id', manage.user.login_validate, manage.authcode.genAuthCode);
	app.post('/manage/authcode/html/getAuthCodesByUserId/:user_id', manage.user.login_validate, manage.authcode.getAuthCodesByUserId);
	app.get('/manage/authcode/', manage.user.login_validate, manage.authcode.indexUI);
}

/**
 * 角色管理
 */
function proc_manage_role(app){
	app.get('/manage/role/', manage.user.login_validate, manage.role.indexUI);
}

/**
 * 用户管理
 */
function proc_manage_user(app){
	// 用户相关
	app.get('/manage/user/changePwd$', manage.user.login_validate, manage.user.changePwdUI);
	// 添加 修改
	app.post('/manage/user/add', express.valiPostData, manage.user.login_validate, manage.user.add);
	app.post('/manage/user/edit', express.valiPostData, manage.user.login_validate, manage.user.edit);
	app.get('/manage/user/edit/:user_id', manage.user.login_validate, manage.user.editUI);
	app.get('/manage/user/add', manage.user.login_validate, manage.user.addUI);
	// TODO
	app.get('/manage/user/', manage.user.login_validate, manage.user.indexUI);
}

/**
 * 用户登陆
 */
function proc_manage_login(app){
	app.get('/manage/user/logout$', manage.user.logoutUI);
	app.get('/manage/user/login$', manage.user.loginUI);
	app.post('/manage/user/login$', express.valiPostData, manage.user.login);
}

/**
 * 管理框架
 */
function proc_manage_site(app){
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
		result.msg = [str1];
		return res.send(result);
	}
	try{
		data = JSON.parse(data);
		if('object' === typeof data){
			req._data = data;
			return next();
		}
		result.msg = [str1];
	}catch(ex){
		result.msg = [ex.message];
	}
	res.send(result);
};