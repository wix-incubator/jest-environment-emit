import JestEnvironmentEmit from '../index';

describe('EmitterMixin', () => {
  it('should be able to subscribe to events', async () => {
    const subscription = {
      add_hook: jest.fn(),
      test_environment_setup: jest.fn(),
      test_environment_teardown: jest.fn(),
    };

    JestEnvironmentEmit.subscribe(subscription);
    JestEnvironmentEmit.subscribe('lodash/noop');

    const originalMethods = {
      setup: jest.fn().mockResolvedValue(void 0),
      handleTestEvent: jest.fn().mockResolvedValue(void 0),
      teardown: jest.fn().mockResolvedValue(void 0),
    };

    class OriginalEnvironment {
      async setup() {
        return originalMethods.setup();
      }
      async handleTestEvent() {
        return originalMethods.handleTestEvent();
      }
      async teardown() {
        return originalMethods.teardown();
      }
    }

    const Environment = JestEnvironmentEmit(OriginalEnvironment as any);
    const globalListener = jest.fn();
    JestEnvironmentEmit.subscribe(globalListener);

    const listener = jest.fn();
    Environment.subscribe(listener);

    const config = {
      globalConfig: {},
      projectConfig: { rootDir: process.cwd(), testEnvironmentOptions: {} },
    };
    const context = {};
    const env = new Environment(config, context);

    expect(listener).not.toHaveBeenCalled();

    expect(subscription.test_environment_setup).not.toHaveBeenCalled();
    await env.setup();
    expect(subscription.test_environment_setup).toHaveBeenCalled();
    expect(originalMethods.setup).toHaveBeenCalled();
    const expectedContext = {
      env,
      testEvents: env.testEvents,
      context,
      config,
    };
    expect(globalListener).toHaveBeenCalledWith(expectedContext);
    expect(listener).toHaveBeenCalledWith(expectedContext);

    expect(subscription.add_hook).not.toHaveBeenCalled();
    await env.handleTestEvent!({ name: 'add_hook' } as any, {} as any);
    expect(subscription.add_hook).toHaveBeenCalled();
    expect(originalMethods.handleTestEvent).toHaveBeenCalled();

    expect(subscription.test_environment_teardown).not.toHaveBeenCalled();
    await env.teardown();
    expect(subscription.test_environment_teardown).toHaveBeenCalled();
    expect(originalMethods.teardown).toHaveBeenCalled();
  });
});
