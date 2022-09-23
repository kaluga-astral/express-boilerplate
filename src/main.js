const path = require('path');

const express = require('express');

const { configService, logService } = require('./services');

const main = () => {
  configService.init({
    envDirPath: path.resolve(process.cwd(), 'env'),
  });

  const { PORT } = configService.config;

  const app = express();

  app.use('/', (req, res) => {
    logService.reqInfo(req, 'Hello!');
    res.send(200);
  });

  app.listen(PORT, () => {
    logService.info(`App listening on port: ${PORT}`);
  });
};

main();
