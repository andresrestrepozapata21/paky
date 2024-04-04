"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _winston = require("winston");
// I import libraries from winston

// I defined const logger with config log
var logger = (0, _winston.createLogger)({
  format: _winston.format.combine(_winston.format.simple(), _winston.format.timestamp(), _winston.format.printf(function (info) {
    return "[".concat(info.timestamp, "] ").concat(info.level, " ").concat(info.message);
  })),
  transports: [new _winston.transports.File({
    maxSize: 5120000,
    maxFiles: 5,
    filename: "src/logs/log_api.txt"
  }), new _winston.transports.Console({
    level: 'debug'
  })]
});
// Case of the error write logger
logger.on('error', function (error) {
  console.error('Error en el logger:', error);
});
//Export logger for to use anytime
var _default = exports["default"] = logger;