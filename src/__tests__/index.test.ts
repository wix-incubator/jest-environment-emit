import JestEnvironmentEmit from '../index';

describe('EmitterMixin', () => {
  it('should be able to subscribe to events', async () => {
    const fnSubscription = jest.fn();
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

    const EnvironmentBase = JestEnvironmentEmit(OriginalEnvironment as any, undefined, 'Base');
    const Environment = EnvironmentBase.derive(fnSubscription, 'WithMocks');

    const config = {
      globalConfig: {},
      projectConfig: { rootDir: process.cwd(), testEnvironmentOptions: {} },
    };
    const context = {};
    const env = new Environment(config, context);

    expect(fnSubscription).not.toHaveBeenCalled();
    await env.setup();
    expect(originalMethods.setup).toHaveBeenCalled();
    expect(fnSubscription).toHaveBeenCalledWith(
      {
        env,
        context,
        config,
        testEvents: expect.objectContaining({
          on: expect.any(Function),
          once: expect.any(Function),
          off: expect.any(Function),
        }),
      },
      void 0,
    );

    await env.handleTestEvent!({ name: 'add_hook' } as any, {} as any);
    expect(originalMethods.handleTestEvent).toHaveBeenCalled();

    await env.teardown();
    expect(originalMethods.teardown).toHaveBeenCalled();
  });
});
