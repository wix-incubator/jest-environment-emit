const base = require('../jest.config');

module.exports = {
  ...base,

  rootDir: '..',
  testEnvironment: 'jest-environment-emit/node',
  testEnvironmentOptions: {
    eventListeners: [
      ['./e2e/listeners.cjs', { prefix: 'cjs' }],
      ['./e2e/listeners.mjs', { prefix: 'mjs' }],
    ],
  },
};
