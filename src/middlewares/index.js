const { createErrorMiddleware } = require('./errorMiddleware');
const { createLogMiddleware } = require('./logMiddleware');

module.exports = { createErrorMiddleware, createLogMiddleware };
