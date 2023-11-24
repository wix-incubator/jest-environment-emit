import { resolveSubscription } from './resolveSubscription';

describe('resolveSubscription', function () {
  it('should tolerate falsy values', async function () {
    const [callback] = await resolveSubscription(process.cwd(), undefined as any);
    expect(callback).not.toThrow();
  });

  it('should pass through a function', async function () {
    const fn = jest.fn();
    const [callback] = await resolveSubscription(process.cwd(), fn);
    expect(callback).toBe(fn);
  });

  it('should resolve a module name', async function () {
    const [identity] = await resolveSubscription(process.cwd(), 'lodash/identity');
    const someObject = {} as any;
    expect(identity(someObject)).toBe(someObject);
  });
});
