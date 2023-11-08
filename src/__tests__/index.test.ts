import JestEnvironmentEmit from '../index';

describe('EmitterMixin', () => {
  it('should be able to subscribe to events', async () => {
    const fnSubscription = jest.fn();
    const objSubscription = {
      add_hook: jest.fn(),
      test_environment_setup: jest.fn(),
      test_environment_teardown: jest.fn(),
    };

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

    const EnvironmentBase = JestEnvironmentEmit(
      OriginalEnvironment as any,
      objSubscription,
      'Base',
    );
    const Environment = EnvironmentBase.derive(fnSubscription, 'WithMocks');

    const config = {
      globalConfig: {},
      projectConfig: { rootDir: process.cwd(), testEnvironmentOptions: {} },
    };
    const context = {};
    const env = new Environment(config, context);

    expect(fnSubscription).not.toHaveBeenCalled();
    expect(objSubscription.test_environment_setup).not.toHaveBeenCalled();
    await env.setup();
    expect(originalMethods.setup).toHaveBeenCalled();
    expect(objSubscription.test_environment_setup).toHaveBeenCalled();
    expect(fnSubscription).toHaveBeenCalledWith({
      env,
      testEvents: env.testEvents,
      context,
      config,
    });

    expect(objSubscription.add_hook).not.toHaveBeenCalled();
    await env.handleTestEvent!({ name: 'add_hook' } as any, {} as any);
    expect(objSubscription.add_hook).toHaveBeenCalled();
    expect(originalMethods.handleTestEvent).toHaveBeenCalled();

    expect(objSubscription.test_environment_teardown).not.toHaveBeenCalled();
    await env.teardown();
    expect(objSubscription.test_environment_teardown).toHaveBeenCalled();
    expect(originalMethods.teardown).toHaveBeenCalled();
  });
});
