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
	authcode: require('./authcode')
};

/**
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT * FROM s_user WHERE STATUS=1 AND APIKEY=?';
	// TODO
	exports.findByApiKey = function(apiKey, cb){
		mysql.query(sql, [apiKey], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};
})(exports);

/**
 * 通过父Id查询子用户
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'SELECT b.* FROM'+
				' (SELECT '+
					'(SELECT COUNT(1) FROM s_auth_code WHERE USER_ID=a.id) AUTH_CODE_COUNT,'+
					' IFNULL((SELECT USER_ID FROM s_auth_code WHERE id=a.AUTH_CODE_ID), "") PID, a.*'+
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
	var sql = 'SELECT (SELECT COUNT(1) FROM p_project WHERE STATUS=1 AND USER_ID=a.id) PROJECT_COUNT, a.* FROM s_user a where a.ROLE_ID=? ORDER BY a.CREATE_TIME DESC';
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
	var sql_1 = 'SELECT b.ROLE_NAME, a.* FROM s_user a, s_role b WHERE a.ROLE_ID=b.id';
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
		var sql = sql_1 +' AND a.USER_NAME=?';
		// TODO
		mysql.query(sql, [logInfo.USER_NAME], function (err, docs){
			if(err) return cb(err);
			// TODO
			if(!mysql.checkOnly(docs)) return cb(null, ['用户名或密码输入错误', 'USER_NAME']);
			// TODO
			var doc = docs[0];
			// TODO
			if(md5.hex(logInfo.USER_PASS) !== doc.USER_PASS)
				return cb(null, ['用户名或密码输入错误', 'USER_PASS'], doc);
			cb(null, null, doc);
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
	newInfo.AUTH_CODE_ID = newInfo.AUTH_CODE_ID || '';
	biz.authcode.checkUsed(newInfo.AUTH_CODE_ID, function (err, msg){
		if(err) return cb(err);
		if(!!msg) return cb(null, msg);
		// TODO
		newInfo.MOBILE = newInfo.USER_NAME;
		newInfo.ROLE_ID = '566512b49012fb044691ace6';
		exports.saveNew(newInfo, cb);
	});
};

/**
 * 查找用户通过用户名
 *
 * @params
 * @return
 */
exports.findByName = function(name, cb){
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
						newInfo.APIKEY,
						newInfo.SECKEY,
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
})(exports);