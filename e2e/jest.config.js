const base = require('../jest.config');

module.exports = {
  ...base,

  rootDir: '..',
  testEnvironment: 'jest-environment-emit/node',
  testEnvironmentOptions: {
    eventListeners: [
      './e2e/listeners.cjs',
      './e2e/listeners.mjs',
      {
        test_environment_teardown() {
          console.log('[inline] test_environment_teardown');
        },
      },
    ],
  },
};
