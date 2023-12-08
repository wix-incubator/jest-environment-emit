/** @type {import('jest-environment-emit').EnvironmentListenerFn} */
export default ({ env, testEvents }, { prefix }) => {
  env.counter--;
  testEvents.on('test_environment_teardown', () => {
    console.log(`[${prefix}] test_environment_teardown`);
  });
};
