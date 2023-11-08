import { resolveSubscription } from './resolveSubscription';

describe('resolveSubscription', function () {
  it('should tolerate falsy values', async function () {
    const callback = await resolveSubscription(process.cwd(), undefined as any);
    expect(callback).not.toThrow();
  });

  it('should pass through a function', async function () {
    const fn = jest.fn();
    const callback = await resolveSubscription(process.cwd(), fn);
    expect(callback).toBe(fn);
  });

  it('should resolve a module name', async function () {
    const identity = await resolveSubscription(process.cwd(), 'lodash/identity');
    const someObject = {} as any;
    expect(identity(someObject)).toBe(someObject);
  });

  it('should resolve a smart object', async function () {
    const setup = jest.fn();
    const listener = await resolveSubscription(process.cwd(), { setup });
    const context = { testEvents: { on: jest.fn() } } as any;
    listener(context);
    expect(context.testEvents.on).toHaveBeenCalledWith('setup', setup);
  });
});
