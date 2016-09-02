var express  = require('express');
var app = express();
var http     = require('http');
var server   = http.createServer(app);
var config = require('config')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var passport = require('passport');
require('./libs/auth/auth');
server.listen(config.get('port'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());
app.use(passport.initialize());

var oauth2 = require('./libs/auth/oauth2');

var api = require('./routes/api');
var users = require('./routes/users');

app.use('/api', api);
app.use('/api/users', users);
app.use('/api/oauth/token', oauth2.token);


