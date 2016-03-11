/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../settings');

/**
 *
 * @params
 * @return
 */
exports.loginUI = function(req, res, next){
	res.render('manage/user/1.0.1/login', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs',
		data: {
			user: {
				USER_NAME: 'bushuo',
				USER_PASS: '1'
			}
		}
	});
};