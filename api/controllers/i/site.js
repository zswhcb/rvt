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
exports.indexUI = function(req, res, next){
	res.render('i/1.0.2/index', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs',
		data: {
			user: req.session.user
		}
	});
};

/**
 *
 * @params
 * @return
 */
exports.welcomeUI = function(req, res, next){
	res.render('i/1.0.2/welcome', {
		conf: conf,
		description: '',
		keywords: ',html5,nodejs',
		data: {
			current_time: util.format(new Date(), 'YY年MM月dd日'),
			create_time: util.format(new Date(), 'YY-MM')
		}
	});
};