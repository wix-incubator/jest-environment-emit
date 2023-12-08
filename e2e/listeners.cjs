/** @type {import('jest-environment-emit').EnvironmentListenerFn} */
module.exports = ({ env, testEvents }, { prefix }) => {
  env.counter--;
  testEvents.on('test_environment_teardown', () => {
    console.log(`[${prefix}] test_environment_teardown`);
  });
};
