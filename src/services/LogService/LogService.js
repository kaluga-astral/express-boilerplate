const winston = require('winston');

class LogService {
  #logger;

  loggerConfig = {
    transports: [new winston.transports.Console()],
    expressFormat: true,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      winston.format.simple(),
    ),
  };

  constructor() {
    this.#logger = winston.createLogger(this.loggerConfig);
  }

  /**
   * @description Создает строку для отображения message, прикрепленного к express req
   */
  // eslint-disable-next-line class-methods-use-this
  createReqLogString = (req, message) =>
    `${req.method} ${req.headers.referer || req.originalUrl}: ${message}`;

  info = (...params) => {
    this.#logger.info(...params);
  };

  error = (...params) => {
    this.#logger.error(...params);
  };

  /**
   * @description Логирует message с привязкой к req
   */
  reqInfo = (req, message) => {
    this.info(this.createReqLogString(req, message));
  };

  /**
   * @description Логирует message ошибки с привязкой к req
   */
  reqError = (req, message) => {
    this.error(this.createReqLogString(req, message));
  };
}

const logService = new LogService();

module.exports = { logService };
