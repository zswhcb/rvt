/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');

var conf = require('../../settings');

var biz = {
	user: require('../../../biz/user')
};

/**
 *
 * @params
 * @return
 */
exports.indexUI = function(req, res, next){
	biz.user.findByRoleId(null, function (err, docs){
		// TODO
		res.render('manage/authcode/Index', {
			conf: conf,
			title: req.query.name +' | '+ conf.corp.name,
			description: '',
			keywords: ',html5',
			data: {
				users: docs
			}
		});
	});
};