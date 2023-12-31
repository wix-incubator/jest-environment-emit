import JestEnvironmentEmit from '../index';

describe('integration test', () => {
  it('should be able to subscribe to events', async () => {
    const fnSubscription = jest.fn();
    const configSubscription = jest.fn();
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
    class EnvironmentMiddle1 extends EnvironmentBase {
      extraMethod() {
        return 1;
      }
    }
    class EnvironmentMiddle2 extends EnvironmentMiddle1 {
      extraMethod() {
        return super.extraMethod() + 1;
      }

      extraMethod2() {
        return 2;
      }
    }

    const Environment = EnvironmentMiddle2.derive(fnSubscription, 'WithMocks');

    const config = {
      globalConfig: {},
      projectConfig: {
        rootDir: process.cwd(),
        testEnvironmentOptions: {
          eventListeners: [configSubscription, [configSubscription, { foo: 'bar' }]],
        },
      },
    };
    const context = {};
    const env = new Environment(config, context);
    expect((env as any).extraMethod()).toBe(2);
    expect((env as any).extraMethod2()).toBe(2);
    const onAddHook = jest.fn();
    env.testEvents.on('add_hook', onAddHook);

    expect(fnSubscription).not.toHaveBeenCalled();
    await env.setup();
    expect(originalMethods.setup).toHaveBeenCalled();
    const expectedContext = {
      env,
      context,
      config,
      testEvents: expect.objectContaining({
        on: expect.any(Function),
        once: expect.any(Function),
        off: expect.any(Function),
      }),
    };
    expect(fnSubscription).toHaveBeenCalledWith(expectedContext, void 0);
    expect(configSubscription).toHaveBeenCalledWith(expectedContext, void 0);
    expect(configSubscription).toHaveBeenCalledWith(expectedContext, { foo: 'bar' });

    await env.handleTestEvent({ name: 'add_hook' } as any, {} as any);
    expect(originalMethods.handleTestEvent).toHaveBeenCalled();
    expect(onAddHook).toHaveBeenCalled();

    await env.teardown();
    expect(originalMethods.teardown).toHaveBeenCalled();
  });
});
