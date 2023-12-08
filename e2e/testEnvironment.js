const TestEnvironment = require('jest-environment-emit/node').default;

class E2ETestEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    this.counter = 2;
  }

  async teardown() {
    await super.teardown();
    if (this.counter !== 0) {
      throw new Error('There was an issue with listeners registration or execution');
    }
  }
}

module.exports = E2ETestEnvironment;
