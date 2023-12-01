/** @type {import('jest-environment-emit').EnvironmentListenerFn} */
export default ({ testEvents }, { prefix }) => {
  testEvents.on('test_environment_teardown', () => {
    console.log(`[${prefix}] test_environment_teardown`);
  });
};
