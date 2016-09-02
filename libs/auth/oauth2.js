var oauth2orize = require('oauth2orize');
var passport = require('passport');
var config = require('config');
var md5 = require('md5');
var db = require('./../mongo');

var log = require('./../log')(module);

var User = require('./../../models/user');
var AccessToken = require('./../../models/accessToken');
var RefreshToken = require('./../../models/refreshToken');

var aserver = oauth2orize.createServer();


var generateTokens = function (data, done) {

  var refreshToken;
  var refreshTokenValue;
  var token;
  var tokenValue;

  AccessToken.remove({}, function (err) {
    if (err) {
      return log.error(err);
    }
  });

  RefreshToken.remove({}, function (err) {
    if (err) {
      return log.error(err);
    }
  });

  tokenValue  = md5( data.username + data.clientId + data.clientSecret + Math.random());
  refreshTokenValue = md5( data.username + data.clientId + data.clientSecret + Math.random());

  data.token = tokenValue;
  token = new AccessToken(data);

  data.token = refreshTokenValue;
  refreshToken = new RefreshToken(data);

  refreshToken.save(function (err) {
    if (err) {
      return log.error(err);
    }
  });

  token.save(function (err) {
    if (err) {

      log.error(err);
      return done(err);
    }
    done(null, tokenValue, refreshTokenValue, {
      'expires_in': config.get('security.tokenLife')
    });
  });
};

aserver.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {

  User.findOne({ username: username }, function(err, user) {

    if (err) {
      return done(err);
    }

    if (!user || !user.checkPassword(password)) {
      return done(null, false);
    }

    var model = {
      username: user.username,
      clientSecret: client.clientSecret,
      userId: user.userId,
      clientId: client.clientId
    };

    generateTokens(model, done);
  });

}));

aserver.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

  RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, function(err, token) {
    if (err) {
      return done(err);
    }

    if (!token) {
      return done(null, false);
    }

    User.findById(token.userId, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      var model = {
        userId: user.userId,
        clientId: client.clientId
      };

      generateTokens(model, done);
    });
  });
}));

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  aserver.token(),
  aserver.errorHandler()
];
