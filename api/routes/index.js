/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	express = util.express;

var api = require('../controllers/api');

/**
 *
 * @param
 * @return
 */
module.exports = function(app){
	app.post('/', express.valiPostData, api.signature_validate, api.index);
	app.get('/test$', api.testUI);
};