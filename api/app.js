/*!
 * hnzswh-rvt-api
 * Copyright(c) 2015 hnzswh-rvt-api <3203317@qq.com>
 * MIT Licensed
 */
'use strict';

var express = require('express'),
	flash = require('connect-flash'),
	velocity = require('velocityjs'),
	fs = require('fs'),
	http = require('http'),
	path = require('path'),
	cwd = process.cwd();

var macros = require('./lib/macro'),
	errorHandler = require("./lib/errorHandler"),
	conf = require('./settings'),  // session config
	mysqlconf = conf.mysql;

var app = express();

// all environments
app.set('port', process.env.PORT || 3011)
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'html')
	/* use */
	.use(flash())
	.use(express.favicon())
	.use(express.json())
	.use(express.urlencoded())
	.use(express.methodOverride())
	.use(express.cookieParser());

// production
if('production' === app.get('env')){
	app.use('/public', express.static(path.join(__dirname, 'public'), { maxAge: 101000 }))
		.use(express.errorHandler())
		.use(express.logger('dev'));
}

// development
if('development' === app.get('env')){
	app.use(express.logger('dev'))
		.use('/public', express.static(path.join(__dirname, 'public')))
		.use(express.errorHandler({
			dumpExceptions: true,
			showStack: true
		}));
}

app.use(express.session({
	secret: conf.cookie.secret,
	key: mysqlconf.database,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 1  //30 days
	}
}));

app.use(app.router)
	/* velocity */
	.engine('.html', function (path, options, fn){
		fs.readFile(path, 'utf8', function (err, data){
			if(err) return fn(err);
			try{ fn(null, velocity.render(data, options, macros)); }
			catch(ex){ fn(ex); }
		});
	});

errorHandler.appErrorProcess(app);

var server = http.createServer(app);
// server.setTimeout(5000);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port %s.', app.get('port'));
	require('./routes')(app);
});