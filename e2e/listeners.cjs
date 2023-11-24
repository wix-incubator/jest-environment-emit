/** @type {import('jest-environment-emit').EnvironmentListenerFn} */
module.exports = ({ testEvents }, { prefix }) => {
  testEvents.on('test_environment_teardown', () => {
    console.log(`[${prefix}] test_environment_teardown`);
  });
};
