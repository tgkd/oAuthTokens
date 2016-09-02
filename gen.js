var db = require('./libs/mongo');
var config = require('config');

var log = require('./libs/log')(module);
var User = require('./models/user');
var Client = require('./models/client');
var AccessToken = require('./models/accessToken');
var RefreshToken = require('./models/refreshToken');

User.remove({}, function(err) {
  var user = new User({
    username: config.get("generator.user.username"),
    password: config.get("generator.user.password")
  });

  user.save(function(err, user) {
    if(!err) {
      log.info("New user - %s:%s", user.username, user.password);
    }else {
      return log.error(err);
    }
  });
});

Client.remove({}, function(err) {
  var client = new Client({
    name: config.get("generator.client.name"),
    clientId: config.get("generator.client.clientId"),
    clientSecret: config.get("generator.client.clientSecret")
  });

  client.save(function(err, client) {

    if(!err) {
      log.info("New client - %s:%s", client.clientId, client.clientSecret);
    } else {
      return log.error(err);
    }

  });
});

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

setTimeout(function() {
  db.disconnect();
}, 3000);