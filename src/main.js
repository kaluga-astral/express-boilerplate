const path = require('path');

const Sentry = require('@sentry/node');
const express = require('express');

const { createErrorMiddleware, createLogMiddleware } = require('./middlewares');
const { configService, logService, validationService } = require('./services');

const main = () => {
  configService.init({
    envDirPath: path.resolve(process.cwd(), 'env'),
    envValidationScheme: {
      API_URL: validationService.string().url().required(),
      PORT: validationService.number().required(),
      ENV_NAME: validationService.string().required(),
    },
  });

  const { port, envName, monitoringErrorConfig } = configService.config;

  const app = express();

  if (envName !== 'local') {
    Sentry.init(monitoringErrorConfig);
  }

  app.use(createLogMiddleware());

  app.use('/', (req, res) => {
    logService.reqInfo(req, 'Hello!');
    res.send(200);
  });

  // errors middlewares
  app.use(Sentry.Handlers.errorHandler());
  app.use(createErrorMiddleware());

  app.listen(port, () => {
    logService.info(`App listening on port: ${port}`);
  });
};

main();
