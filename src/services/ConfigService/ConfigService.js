const path = require('path');

const dotenv = require('dotenv');

const { logService } = require('../LogService');
const validationService = require('../ValidationService');

/**
 * @description Отдает env приложения
 * * @param {Object} params
 *  * @param {string} params.envDirPath - Путь до директории с .env файлами.
 */
const getAppEnv = ({ envDirPath }) => {
  const { ENV_NAME } = process.env;

  if (!ENV_NAME) {
    throw Error('ENV_NAME is not defined');
  }

  const { error } = dotenv.config({
    path: path.join(envDirPath, `.env.${ENV_NAME}`),
  });

  if (error) {
    throw error;
  }

  const { API_URL, PORT } = process.env;

  return { API_URL, PORT, ENV_NAME };
};

/**
 * @description Сервис для работы с config. Содержит глобальную конфигурацию приложения
 */
class ConfigService {
  #logger;

  /**
   * @description Схема для валидации env
   */
  #envValidationScheme = {
    API_URL: validationService.string().url().required(),
    PORT: validationService.number().required(),
    ENV_NAME: validationService.string().required(),
  };

  config = {};

  constructor(logger) {
    this.#logger = logger;
  }

  /**
   * @description Валидирует env и формирует config
   * * @param {Object} params
   *  * @param {string} params.envDirPath - Путь до директории с .env файлами.
   */
  init = ({ envDirPath }) => {
    const env = getAppEnv({ envDirPath });

    this.#validateEnv(env);
    this.config = env;
    this.#logger.info('Config:', this.config);
  };

  #validateEnv = (env) => {
    validationService.object(this.#envValidationScheme).validateSync(env);
  };
}

const configService = new ConfigService(logService);

module.exports = { configService };
