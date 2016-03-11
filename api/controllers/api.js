/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils');
var rest = util.service.rest;
var EventProxy = require('eventproxy');
var path = require('path');
var fs = require('fs');
var cwd = process.cwd();

var conf = require('../settings');

var biz = {
    task: require('../../biz/task'),
    user: require('../../biz/user')
};

var exports = module.exports;

/**
 * 签名验证
 *
 * @param
 * @return
 */
(function (exports){

    exports.signature_validate = function(req, res, next){
		var result = { success: false };
		var body = req.body;
		var data = req._data;
		
		// 判断设备号
		data.DEVICE_CODE = util.isEmpty(data.DEVICE_CODE);
		if(!data.DEVICE_CODE) return res.send(result);
		
		// TODO
		body.command = util.isEmpty(body.command);
		if(!body.command) return res.send(result);
	
		// TODO
		if('login' === body.command) return next();
	
		body.ts = util.isEmpty(body.ts);
		if(!body.ts) return res.send(result);
	
		body.apikey = util.isEmpty(body.apikey);
		if(!body.apikey) return res.send(result);
	
		body.signature = util.isEmpty(body.signature);
		if(!body.signature) return res.send(result);
	
		// TODO
		biz.user.findByApiKey(body.apikey, function (err, doc){
			if(err) return next(err);
			// TODO
			if(!doc) return res.send(result);
			
			// TODO
			if(1 !== doc.STATUS){
				result.msg = ['禁止登陆'];
				return res.send(result);
			}
			
			function run(){
				if(body.data) delete body.data;
				// TODO
				if(!rest.validate(body, doc.SECKEY)){
					result.msg = ['验证失败'];					
					return res.send(result);
				}
				// TODO
				req.flash('user', doc);
				next();
			}
			
			// 判断设备号
			if(doc.DEVICE_CODE){
				if(data.DEVICE_CODE !== doc.DEVICE_CODE){
					result.msg = ['您的帐号暂时无法登陆，请联系管理员'];
					return res.send(result);
				}
			}else{
				return biz.user.editDeviceCode({ DEVICE_CODE: data.DEVICE_CODE, id: doc.id }, function (err, status){
					if(err) return next(err);
					// TODO
					run();
				});
			}
			
			run();
		});
    };
})(exports);

/**
 * api
 *
 * @param
 * @return
 */
(function (exports){

    function login(req, res, next){
		var result = { success: false };
		var data = req._data;
		
		// TODO
		biz.user.login(data, function (err, msg, doc){
		    if(err) return next(err);
		    if(msg){
				result.msg = msg;
				return res.send(result);
		    }
	
		    /* result */
		    result.data = {
				APIKEY: doc.APIKEY,
				SECKEY: doc.SECKEY,
				TS: (new Date()).getTime()
		    };
		    result.ver = conf.app.ver;
		    result.success = true;
		    res.send(result);
		});
    }

    function applyTask(req, res, next){
        var result = { success: false };
        var user = req.flash('user')[0];
        // TODO
        biz.task.apply(user.id, function (err, msg, doc){
            if(err) return next(err);
            // TODO
            if(msg){
                result.msg = msg;
                return res.send(result);
            }
            // TODO
            result.data = doc;
	    	result.ver = conf.app.ver;
            result.success = true;
            res.send(result);
        });
    }

    function commitTask(req, res, next){
		var result = { success: false };
		var data = req._data;
		var user = req.flash('user')[0];
		// TODO
		biz.task.commit(user.id, data, function (err, msg, status){
		    if(err) return next(err);
		    // TODO
		    if(msg) result.msg = msg;
            result.ver = conf.app.ver;
		    result.success = true;
		    res.send(result);
		});
    }

    function getSurplusCount(req, res, next){
		var result = { success: false };
		// TODO
		biz.task.getSurplusCount(function (err, count){
		    if(err) return next(err);
		    // TODO
		    result.data = count;
	    	result.ver = conf.app.ver;
		    result.success = true;
		    res.send(result);
		});
    }

    exports.index = function(req, res, next){
	// TODO
		switch(req.body.command){
			case 'login': login(req, res, next); break;
			case 'applyTask': applyTask(req, res, next); break;
			case 'commitTask': commitTask(req, res, next); break;
			case 'getSurplusCount': getSurplusCount(req, res, next); break;
			default: res.send({ success: false }); break;
		}
    };
})(exports);

/**
 *
 * @param
 * @return
 */
exports.testUI = function(req, res, next){
    var query = req.query;
    if(query.seckey){
        var seckey = query.seckey;
        delete query.seckey;
        var signature = rest.genSignature(query, seckey);
        query.signature = signature;
        query.seckey = seckey;
    }

    res.render('test', {
        conf: conf,
        description: '',
        keywords: ',html5',
        data: query
    });
};