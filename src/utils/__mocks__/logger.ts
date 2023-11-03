const { logger, optimizeTracing } = jest.requireActual('../logger');
logger.logger = {
  fatal: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
};

export { logger, optimizeTracing };
