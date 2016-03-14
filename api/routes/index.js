/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	express = util.express;

var api = {
	index: require('../controllers/api/index')
};

var i = {
	user: require('../controllers/i/user')
};

var manage = {
	task: require('../controllers/manage/task'),
	project: require('../controllers/manage/project'),
	role: require('../controllers/manage/role'),
	site: require('../controllers/manage/site'),
	user: require('../controllers/manage/user')
};

function proc_api(app){
	var index = api.index;

	// TODO
	app.post('/api/', express.valiPostData, index.signature_validate, index.index);
	app.get('/api/test$', index.testUI);
}

function proc_i(app){
	var user = i.user;

	app.post('/i/register$', express.valiPostData, user.register);
	app.get('/i/register$', user.registerUI);

	// TODO
	app.get('/i/logout$', user.logoutUI);
	app.get('/i/login$', user.loginUI);
	app.post('/i/login$', express.valiPostData, user.login);
	// TODO
	app.get('/i/changePwd$', user.login_validate, user.changePwdUI);
	app.post('/i/changePwd$', express.valiPostData, user.login_validate, user.changePwd);

	app.get('/i/welcome$', user.login_validate, user.welcomeUI);
	app.get('/i/', user.login_validate, user.indexUI);
}

function proc_manage(app){
	var user = manage.user;
	var site = manage.site;
	var role = manage.role;
	var project = manage.project;
	var task = manage.task;

	/* task */
	app.post('/manage/task/remove$', express.valiPostData, user.login_validate, task.remove);
	app.post('/manage/task/edit$', express.valiPostData, user.login_validate, task.edit);
	app.post('/manage/task/add$', express.valiPostData, user.login_validate, task.add);
	app.get('/manage/task/edit$', user.login_validate, task.editUI);
	app.get('/manage/task/add$', user.login_validate, task.addUI);
	app.get('/manage/task/', user.login_validate, task.indexUI);
	app.get('/manage/task/monitor$', user.login_validate, task.monitorUI);

	/* project */
	app.post('/manage/project/remove$', express.valiPostData, user.login_validate, project.remove);
	app.post('/manage/project/edit$', express.valiPostData, user.login_validate, project.edit);
	app.post('/manage/project/add$', express.valiPostData, user.login_validate, project.add);
	app.get('/manage/project/edit$', user.login_validate, project.editUI);
	app.get('/manage/project/add$', user.login_validate, project.addUI);
	app.get('/manage/project/', user.login_validate, project.indexUI);

	/* role */
	app.get('/manage/role/', user.login_validate, role.indexUI);

	/* user */
	app.post('/manage/user/list$', express.valiPostData, user.login_validate, user.list);
	app.post('/manage/user/resetPwd$', express.valiPostData, user.login_validate, user.resetPwd);
	app.post('/manage/user/remove$', express.valiPostData, user.login_validate, user.remove);
	app.post('/manage/user/edit$', express.valiPostData, user.login_validate, user.edit);
	app.post('/manage/user/add$', express.valiPostData, user.login_validate, user.add);
	app.get('/manage/user/edit$', user.login_validate, user.editUI);
	app.get('/manage/user/add$', user.login_validate, user.addUI);
	app.get('/manage/user/', user.login_validate, user.indexUI);

	// TODO
	app.get('/manage/user/changePwd$', user.login_validate, user.changePwdUI);
	app.post('/manage/user/changePwd$', express.valiPostData, user.login_validate, user.changePwd);

	// TODO
	app.get('/manage/user/logout$', user.logoutUI);
	app.get('/manage/user/login$', user.loginUI);
	app.post('/manage/user/login$', express.valiPostData, user.login);

	/* site */
	app.get('/manage/welcome$', user.login_validate, site.welcomeUI);
	app.get('/manage/', user.login_validate, site.indexUI);
}

/**
 *
 * @param
 * @return
 */
module.exports = function(app){
	proc_api(app);
	proc_i(app);
	proc_manage(app);
};