/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	rest = util.service.rest,
	md5 = util.md5,
	mysql_util = util.mysql_util,
	mysql = util.mysql;

var exports = module.exports;

var biz = {
	user_role: require('./user_role'),
	authcode: require('./authcode')
};

function isEmtpy(str){
	if(!str) return;
	str = str.trim();
	return '' === str ? null : str;
}

/**
 *
 * @params
 * @return
 */
exports.findByApiKey = function(apiKey, cb){
	// TODO
	mysql_util.find(null, 's_user', [['APIKEY', '=', apiKey]], null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, mysql.checkOnly(docs) ? docs[0] : null);
	});
};

/**
 * 通过父Id查询子用户
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT b.* FROM'+
				' (SELECT'+
					'  (SELECT COUNT(1) FROM s_auth_code WHERE USER_ID=a.id) AUTH_CODE_COUNT,'+
					'  IFNULL((SELECT USER_ID FROM s_auth_code WHERE id=a.AUTH_CODE_ID), "") PID,'+
					'  a.*'+
					' FROM s_user a WHERE a.STATUS=1 AND a.ROLE_ID="566512b49012fb044691ace6") b'+
				' WHERE b.PID=?'+
				' ORDER BY b.CREATE_TIME DESC';
	// TODO
	exports.findByPId = function(pid, cb){
		pid = pid || '';
		// TODO
		mysql.query(sql, [pid], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

/**
 * 根据角色查询用户
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT'+
				'  (SELECT COUNT(1) FROM p_project WHERE CREATE_USER_ID=a.id) PROJECT_COUNT,'+
				'  a.*'+
				' FROM s_user a where a.ROLE_ID=? ORDER BY a.CREATE_TIME DESC';
	// TODO
	exports.findByRoleId = function(role_id, cb){
		mysql.query(sql, [role_id], function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};
})(exports);

(function (exports){
	// 查询用户 关联用户角色表
	var sql_1 = 'SELECT b.ROLE_NAME, a.* FROM s_user a LEFT JOIN s_role b ON (a.ROLE_ID=b.id) WHERE b.id IS NOT NULL';
	var sql_orderby = ' ORDER BY a.ROLE_ID, a.CREATE_TIME DESC';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findAll = function(cb){
		var sql = sql_1 + sql_orderby;
		mysql.query(sql, null, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};

	/**
	 * 用户登陆
	 *
	 * @params {Object} logInfo 用户登陆信息
	 * @params {Function} cb 回调函数
	 * @return
	 */
	exports.login = function(logInfo, cb){
		logInfo.USER_NAME = isEmtpy(logInfo.USER_NAME);
		if(!logInfo.USER_NAME) return cb(null, ['用户名或密码输入错误', 'USER_NAME']);

		this.findByName(logInfo.USER_NAME, function (err, doc){
			if(err) return cb(err);
			// TODO
			if(!doc) return cb(null, ['用户名或密码输入错误', 'USER_NAME']);

			// TODO
			if(1 !== doc.STATUS) return cb(null, ['禁用状态']);

			// TODO
			if(md5.hex(logInfo.USER_PASS) !== doc.USER_PASS)
				return cb(null, ['用户名或密码输入错误'], doc);

			if('e4acb256cafa4cb487fa6abf508df073' !== doc.ROLE_ID)
				return cb(null, ['无权登陆'], doc);
			
			cb(null, null, user);
		});
	};

	/**
	 *
	 * @params
	 * @return
	 */
	exports.getById = function(id, cb){
		var sql = sql_1 +' AND a.id=?';
		mysql.query(sql, [id], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};
})(exports);

/**
 *
 * @params
 * @return
 */
exports.register = function(newInfo, cb){
	var that = this;
	// TODO
	var mobile = util.checkMobile(newInfo.USER_NAME);
	if('' === mobile) return cb(null, ['请输入正确的手机号']);
	// TODO
	newInfo.AUTH_CODE_ID = newInfo.AUTH_CODE_ID || '';
	// TODO
	biz.authcode.checkUsed(newInfo.AUTH_CODE_ID, function (err, msg, result, doc){
		if(err) return cb(err);
		// TODO
		if(!doc) return cb(null, msg);
		if(result) return cb(null, msg);
		// TODO
		newInfo.USER_NAME = mobile;
		newInfo.MOBILE = newInfo.USER_NAME;
		newInfo.ROLE_ID = '566512b49012fb044691ace6';
		newInfo.STATUS = 2;
		that.saveNew(newInfo, cb);
	});
};

/**
 * 查找用户通过用户名
 *
 * @params
 * @return
 */
exports.findByName = function(name, cb){
	// TODO
	mysql_util.find(null, 's_user', [['USER_NAME', '=', name]], null, null, function (err, docs){
		if(err) return cb(err);
		cb(null, mysql.checkOnly(docs) ? docs[0] : null);
	});
};

/**
 * 表单
 *
 * @params
 * @return
 */
(function (exports){
	function formVali(newInfo, cb){
		cb(null);
	}

	/**
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'INSERT INTO s_user (id, ROLE_ID, USER_NAME, USER_PASS, AVATAR_URL, EMAIL, MOBILE, REAL_NAME, ALIPAY_ACCOUNT, APIKEY, SECKEY, AUTH_CODE_ID, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		// TODO
		exports.saveNew = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// TODO
				exports.findByName(newInfo.USER_NAME, function (err, doc){
					if(err) return cb(err);
					// TODO
					if(!!doc) return cb(null, ['用户名或手机号已经存在', 'USER_NAME']);
					// CREATE
					var postData = [
						util.genObjectId(),
						newInfo.ROLE_ID,
						newInfo.USER_NAME,
						md5.hex(newInfo.USER_PASS || '123456'),
						newInfo.AVATAR_URL,
						newInfo.EMAIL,
						newInfo.MOBILE,
						newInfo.REAL_NAME,
						newInfo.ALIPAY_ACCOUNT,
						rest.genApiKey(),
						rest.genSecKey(),
						newInfo.AUTH_CODE_ID || '',
						new Date(),
						newInfo.STATUS || 1
					];
					mysql.query(sql, postData, function (err, status){
						if(err) return cb(err);
						cb(null, null, status);
					});
				});
			});
		};
	})(exports);

	/**
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'UPDATE s_user set APIKEY=?, SECKEY=?, EMAIL=?, MOBILE=?, REAL_NAME=?, ALIPAY_ACCOUNT=?, STATUS=? WHERE id=?';
		// TODO
		exports.editInfo = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// EDIT
				var postData = [
					rest.genApiKey(),
					rest.genSecKey(),
					newInfo.EMAIL,
					newInfo.MOBILE,
					newInfo.REAL_NAME,
					newInfo.ALIPAY_ACCOUNT,
					newInfo.STATUS || 1,
					newInfo.id
				];
				mysql.query(sql, postData, function (err, status){
					if(err) return cb(err);
					cb(null, null, status);
				});
			});
		};
	})(exports);

	/**
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'UPDATE s_user set DEVICE_CODE=? WHERE id=?';
		// TODO
		exports.editDeviceCode = function(newInfo, cb){
			formVali(newInfo, function (err){
				if(err) return cb(err);
				// EDIT
				var postData = [
					newInfo.DEVICE_CODE,
					newInfo.id
				];
				mysql.query(sql, postData, function (err, status){
					if(err) return cb(err);
					cb(null, status);
				});
			});
		};
	})(exports);
})(exports);