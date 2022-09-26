const expressWinston = require('express-winston');

const { logService } = require('../../services');

const createLogMiddleware = () =>
  expressWinston.logger(logService.loggerConfig);

module.exports = { createLogMiddleware };
