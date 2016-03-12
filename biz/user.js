/*!
 * hnzswh-rvt
 * Copyright(c) 2015 hnzswh-rvt <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var util = require('speedt-utils'),
	uuid = require('node-uuid'),
	rest = util.service.rest,
	md5 = util.md5,
	mysql_util = util.mysql_util,
	mysql = util.mysql;

var EventProxy = require('eventproxy');

var exports = module.exports;

var biz = {};

(function (exports){
	// 查询用户 关联用户角色表
	var _sql = 'SELECT b.ROLE_NAME, a.* FROM s_user a LEFT JOIN s_role b ON (a.ROLE_ID=b.id) WHERE b.id IS NOT NULL';

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByUser = function(user, cb){
		var sql = _sql;
		var postData = null;

		if(user){
			postData = [];
			// TODO
			var INVITE_USER_ID = util.isEmpty(user.INVITE_USER_ID);
			if(INVITE_USER_ID){
				sql += ' AND a.INVITE_USER_ID=?';
				postData.push(INVITE_USER_ID);
			}
			// TODO
			var ROLE_ID = util.isEmpty(user.ROLE_ID);
			if(ROLE_ID){
				sql += ' AND a.ROLE_ID=?';
				postData.push(ROLE_ID);
			}
			// TODO
			var USER_NAME = util.isEmpty(user.USER_NAME);
			if(USER_NAME){
				sql += ' AND a.USER_NAME like ?';
				postData.push(USER_NAME);
			}
		}

		sql += ' ORDER BY a.ROLE_ID, a.CREATE_TIME DESC';

		// TODO
		mysql.query(sql, postData, function (err, docs){
			if(err) return cb(err);
			cb(null, docs);
		});
	};

	/**
	 *
	 * @params
	 * @return
	 */
	exports.getById = function(id, cb){
		var sql = _sql +' AND a.id=?';
		mysql.query(sql, [id], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByName = function(USER_NAME, cb){
		var sql = _sql +' AND a.USER_NAME=?';
		mysql.query(sql, [USER_NAME], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};

	/**
	 *
	 * @params
	 * @return
	 */
	exports.findByApiKey = function(APIKEY, cb){
		var sql = _sql +' AND a.APIKEY=?';
		mysql.query(sql, [APIKEY], function (err, docs){
			if(err) return cb(err);
			cb(null, mysql.checkOnly(docs) ? docs[0] : null);
		});
	};
})(exports);

/**
 * 用户登陆
 *
 * @params {Object} logInfo 用户登陆信息
 * @params {Function} cb 回调函数
 * @return
 */
exports.login = function(logInfo, cb){
	logInfo.USER_NAME = util.isEmpty(logInfo.USER_NAME);
	if(!logInfo.USER_NAME) return cb(null, ['用户名或密码输入错误']);

	this.findByName(logInfo.USER_NAME, function (err, doc){
		if(err) return cb(err);
		// TODO
		if(!doc) return cb(null, ['用户名或密码输入错误']);

		// TODO
		if(1 !== doc.STATUS) return cb(null, ['禁止登陆']);

		// TODO
		if(md5.hex(logInfo.USER_PASS) !== doc.USER_PASS)
			return cb(null, ['用户名或密码输入错误']);

		cb(null, null, doc);
	});
};

/**
 *
 * @params
 * @return
 */
exports.findBySecKey = function(SECKEY, cb){
	// TODO
	mysql_util.find(null, 's_user', [['SECKEY', '=', SECKEY]], null, null, function (err, docs){
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

	function genApiKey(cb){
		var that = this;
		var apiKey = rest.genApiKey();

		that.findByApiKey(apiKey, function (err, doc){
			if(err) return cb(err);
			// TODO
			if(doc) return genApiKey.call(that, cb);
			cb(null, apiKey);
		});
	}

	function genSecKey(cb){
		var that = this;
		var secKey = rest.genSecKey();

		that.findBySecKey(secKey, function (err, doc){
			if(err) return cb(err);
			// TODO
			if(doc) return genSecKey.call(that, cb);
			cb(null, secKey);
		});
	}

	/**
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var sql = 'INSERT INTO s_user (id, ROLE_ID, INVITE_USER_ID, USER_NAME, USER_PASS, EMAIL, MOBILE, APIKEY, SECKEY, REAL_NAME, ALIPAY_ACCOUNT, CREATE_TIME, STATUS) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		// TODO
		exports.saveNew = function(newInfo, cb){
			newInfo.USER_NAME = util.isEmpty(newInfo.USER_NAME);
			if(!newInfo.USER_NAME) return cb(null, ['手机号不能为空']);

			var that = this;

			formVali(newInfo, function (err){
				if(err) return cb(err);
				// TODO
				that.findByName(newInfo.USER_NAME, function (err, doc){
					if(err) return cb(err);
					// TODO
					if(doc) return cb(null, ['手机号已经存在']);

					// TODO
					var ep = EventProxy.create('apiKey', 'secKey', function (apiKey, secKey){
						// CREATE
						var postData = [
							util.replaceAll(uuid.v1(), '-', ''),
							newInfo.ROLE_ID || 'e4acb256cafa4cb487fa6abf508df073',
							newInfo.INVITE_USER_ID,
							newInfo.USER_NAME,
							md5.hex(newInfo.USER_PASS || '123456'),
							newInfo.EMAIL,
							newInfo.MOBILE,
							apiKey,
							secKey,
							newInfo.REAL_NAME,
							newInfo.ALIPAY_ACCOUNT,
							new Date(),
							newInfo.STATUS || 1
						];
						mysql.query(sql, postData, function (err, status){
							if(err) return cb(err);
							cb(null, null, status);
						});
					});

					ep.fail(function (err, msg){
						cb(err);
					});

					genApiKey.call(that, function (err, apiKey){
						if(err) return ep.emit('error', err);
						ep.emit('apiKey', apiKey);
					});

					genSecKey.call(that, function (err, secKey){
						if(err) return ep.emit('error', err);
						ep.emit('secKey', secKey);
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
		var sql = 'UPDATE s_user set USER_PASS=?, APIKEY=?, SECKEY=?, EMAIL=?, MOBILE=?, REAL_NAME=?, ALIPAY_ACCOUNT=?, DEVICE_CODE=?, STATUS=? WHERE id=?';
		// TODO
		exports.editInfo = function(newInfo, cb){
			var that = this;

			formVali(newInfo, function (err){
				if(err) return cb(err);
				// EDIT
				var ep = EventProxy.create('apiKey', 'secKey', function (apiKey, secKey){
					// CREATE
					var postData = [
						md5.hex(newInfo.USER_PASS || '123456'),
						apiKey,
						secKey,
						newInfo.EMAIL,
						newInfo.MOBILE,
						newInfo.REAL_NAME,
						newInfo.ALIPAY_ACCOUNT,
						newInfo.DEVICE_CODE,
						newInfo.STATUS || 1,
						newInfo.id
					];
					mysql.query(sql, postData, function (err, status){
						if(err) return cb(err);
						cb(null, null, status);
					});
				});

				ep.fail(function (err, msg){
					cb(err);
				});

				genApiKey.call(that, function (err, apiKey){
					if(err) return ep.emit('error', err);
					ep.emit('apiKey', apiKey);
				});

				genSecKey.call(that, function (err, secKey){
					if(err) return ep.emit('error', err);
					ep.emit('secKey', secKey);
				});
			});
		};
	})(exports);
})(exports);

/**
 *
 * @params
 * @return
 */
(function (exports){
	var sql = 'UPDATE s_user set USER_PASS=? WHERE id=?';
	// TODO
	exports.changePwd = function(newInfo, cb){
		var USER_PASS = util.isEmpty(newInfo.USER_PASS);
		if(!USER_PASS) return cb(null, ['新密码不能为空']);

		newInfo.USER_PASS = USER_PASS;

		this.getById(newInfo.id, function (err, doc){
			if(err) return cb(err);
			if(!doc) return cb(null, ['修改密码失败']);
			// TODO
			if(md5.hex(newInfo.OLD_PASS) !== doc.USER_PASS){
				return cb(null, ['原始密码错误']);
			}

			// CREATE
			var postData = [
				md5.hex(newInfo.USER_PASS || '123456'),
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

	function proc_sql_center(ids){
		var sql = '';
		for(var i in ids){
			sql += '?, ';
		}
		return sql.substring(0, sql.length - 2);
	}

	/**
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var _sql_start = 'UPDATE s_user set USER_PASS="e10adc3949ba59abbe56e057f20f883e" WHERE id IN (';
		var _sql_end = ')';

		// TODO
		exports.resetPwd = function(ids, cb){
			if(!ids && (0 === ids.length)) return cb(null, ['参数异常']);

			var sql = _sql_start;
			sql += proc_sql_center(ids);
			sql += _sql_end;

			mysql.query(sql, ids, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		};
	})(exports);

	/**
	 *
	 * @params
	 * @return
	 */
	(function (exports){
		var _sql_start = 'DELETE FROM s_user WHERE id IN (';
		var _sql_end = ')';

		// TODO
		exports.remove = function(ids, cb){
			if(!ids && (0 === ids.length)) return cb(null, ['参数异常']);

			var sql = _sql_start;
			sql += proc_sql_center(ids);
			sql += _sql_end;

			mysql.query(sql, ids, function (err, status){
				if(err) return cb(err);
				cb(null, null, status);
			});
		};
	})(exports);
})(exports);