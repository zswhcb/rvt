/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

module.exports = {
	cookie: {
		secret: 'hnzswh-rvt-api'
	}, corp: {
		name: '打电话',
		website: 'http://www.dolalive.com/'
	}, mysql: {
		database: 'rvt-manage',
		host: '127.0.0.1',
		port: 22306,
		user: 'root',
		password: 'password',
		connectionLimit: 50
	}, html: {
		cdn: 'http://www.foreworld.net/',
		pagesize: 10,
		cache_time: 1000 * 3
	}, mail: {
		secureConnection: true,
		host: 'smtp.163.com',
		port: 465,
		to: ['huangxin@foreworld.net'],
		auth: {
			user: 'firefrog@163.com',
			pass: ''
		}
	}, app: {
		ver: 104
	}
};