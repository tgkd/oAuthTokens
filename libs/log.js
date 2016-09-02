var winston = require('winston');
var ENV = process.env.NODE_ENV;

function getLogger(module) {

  var path = module.filename.split('/').slice(-2).join('/');

  return new winston.Logger({
    transports : [
      new winston.transports.File({
        level: 'info',
        filename: process.cwd() + '/logs/all.log',
        handleException: true,
        json: true,
        maxSize: 5242880, //5mb
        maxFiles: 2,
        colorize: false
      }),
      new winston.transports.Console({
        level: 'debug',
        label: path,
        handleException: true,
        json: false,
        colorize: true
      })
    ],
    exitOnError: false
  });
}

module.exports = getLogger;