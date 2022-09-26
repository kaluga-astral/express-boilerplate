const path = require('path');

const dotenv = require('dotenv');

const { MONITORING_ERROR_DSN } = require('../../constants');
const { logService } = require('../LogService');
const { validationService } = require('../ValidationService');

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

const validateEnv = (env, validationScheme) => {
  validationService.object(validationScheme).validateSync(env);
};

/**
 * @description Сервис для работы с config. Содержит глобальную конфигурацию приложения
 */
class ConfigService {
  #logger;

  config = {
    apiUrl: '',
    port: 0,
    envName: '',
    monitoringErrorConfig: { dsn: '', environment: '' },
  };

  constructor(logger) {
    this.#logger = logger;
  }

  /**
   * @description Валидирует env и формирует config
   * * @param {Object} params
   *  * @param {string} params.envDirPath - Путь до директории с .env файлами.
   */
  init = ({ envDirPath, envValidationScheme }) => {
    const env = getAppEnv({ envDirPath });

    validateEnv(env, envValidationScheme);
    this.#initConfig(env);
    this.#logger.info('Config:', this.config);
  };

  #initConfig = (env) => {
    this.config = {
      envName: env.ENV_NAME,
      port: env.PORT,
      apiUrl: env.API_URL,
      monitoringErrorConfig: {
        dsn: MONITORING_ERROR_DSN,
        environment: env.ENV_NAME,
      },
    };
  };
}

const configService = new ConfigService(logService);

module.exports = { configService };
