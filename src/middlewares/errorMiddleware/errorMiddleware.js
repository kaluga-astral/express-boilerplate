const expressWinston = require('express-winston');
const { errors } = require('compose-middleware');

const { logService } = require('../../services');

const createErrorMiddleware = () =>
  errors([
    expressWinston.errorLogger(logService.loggerConfig),
    // eslint-disable-next-line
    (error, request, response, next) => {
      response.status(error.statusCode || 500);
      response.send(error.message);
    },
  ]);

module.exports = { createErrorMiddleware };
