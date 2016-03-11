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
var manage = {};

function proc_api(app){
	var index = api.index;

	// TODO
	app.post('/api/', express.valiPostData, index.signature_validate, index.index);
	app.get('/api/test$', index.testUI);
}

function proc_i(app){
}

function proc_manage(app){
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