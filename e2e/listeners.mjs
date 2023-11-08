/** @type {import('jest-environment-emit').Subscription} */
export default ({ testEvents }) => {
  testEvents.on('test_environment_teardown', () => {
    console.log('[cjs] test_environment_teardown');
  });
};
