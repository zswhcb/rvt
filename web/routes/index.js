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
	manager: require('../controllers/manage/manager')
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
	// 用户相关
	app.get('/manage/manager/login$', manage.manager.loginUI);
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