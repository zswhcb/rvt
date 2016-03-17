/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var fs = require('fs'),
	velocity = require('velocityjs'),
	util = require('speedt-utils'),
	cwd = process.cwd();

var conf = require('../settings');

module.exports = {
	parse: function(file){
		var tpl = fs.readFileSync(require('path').join(cwd, 'views', file)).toString();
		return this.eval(tpl);
	}, include: function(file){
		var tpl = fs.readFileSync(require('path').join(cwd, 'views', file)).toString();
		return tpl;
	}, toHtml: function(s){
		return velocity.render(s);
	}, formatDate: function(time){
		return !time ? '' : util.format(time, 'YY-MM-dd hh:mm:ss');
	}
};