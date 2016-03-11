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

var i = {};

var manage = {
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
}

function proc_manage(app){
	var user = manage.user;
	var site = manage.site;
	var role = manage.role;
	var project = manage.project;

	/* project */
	app.get('/manage/project/', user.login_validate, project.indexUI);

	/* role */
	app.get('/manage/role/', user.login_validate, role.indexUI);

	/* user */
	// TODO
	app.get('/manage/user/', user.login_validate, user.indexUI);

	// TODO
	app.get('/manage/user/changePwd$', user.login_validate, user.changePwdUI);
	app.post('/manage/user/changePwd$', express.valiPostData, user.login_validate, user.changePwd);

	// TODO
	app.get('/manage/user/logout$', user.logoutUI);
	app.get('/manage/user/login$', user.loginUI);
	app.post('/manage/user/login$', express.valiPostData, user.login);

	/* site */
	// TODO
	app.get('/manage/welcome', user.login_validate, site.welcomeUI);
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