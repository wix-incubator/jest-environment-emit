const base = require('../jest.config');

module.exports = {
  ...base,

  rootDir: '..',
  globalTeardown: './e2e/globalTeardown',
  testEnvironment: './e2e/testEnvironment.js',
  testEnvironmentOptions: {
    eventListeners: [
      ['./e2e/listeners.cjs', { prefix: 'cjs' }],
      ['./e2e/listeners.mjs', { prefix: 'mjs' }],
    ],
  },
};
