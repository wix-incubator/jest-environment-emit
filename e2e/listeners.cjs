module.exports = ({ testEvents }) => {
  testEvents.on('test_environment_teardown', () => {
    console.log('[cjs] test_environment_teardown');
  });
};
