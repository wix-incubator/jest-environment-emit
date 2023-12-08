const base = require('../jest.config');

module.exports = {
  ...base,

  rootDir: '..',
  testEnvironment: './e2e/testEnvironment.js',
  testEnvironmentOptions: {
    eventListeners: [
      ['./e2e/listeners.cjs', { prefix: 'cjs' }],
      ['./e2e/listeners.mjs', { prefix: 'mjs' }],
    ],
  },
};
